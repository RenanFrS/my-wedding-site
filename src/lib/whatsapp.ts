// Integração com a Meta WhatsApp Cloud API.
//
// A Meta NÃO permite texto livre ao iniciar uma conversa: é obrigatório usar um
// template de mensagem previamente aprovado. O conteúdo do template ("a mensagem
// que você define") é configurado e aprovado no painel da Meta; aqui apenas
// preenchemos as variáveis do corpo (body) na ordem em que aparecem no template.
//
// Ordem das variáveis esperada pelo template:
//   {{1}} = nome do grupo
//   {{2}} = link de confirmação (ex: https://site/rsvp/<token>)
//   {{3}} = código de segurança (6 dígitos)

interface WhatsAppConfig {
  apiToken: string;
  phoneNumberId: string;
  templateName: string;
  templateLang: string;
  graphVersion: string;
}

export interface SendInviteInput {
  phone: string;
  groupName: string;
  link: string;
  securityCode: string;
}

export interface SendInviteResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

function readConfig(): WhatsAppConfig | null {
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;

  if (!apiToken || !phoneNumberId || !templateName) {
    return null;
  }

  return {
    apiToken,
    phoneNumberId,
    templateName,
    templateLang: process.env.WHATSAPP_TEMPLATE_LANG || 'pt_BR',
    graphVersion: process.env.WHATSAPP_GRAPH_VERSION || 'v21.0',
  };
}

export function isWhatsAppConfigured(): boolean {
  return readConfig() !== null;
}

// Normaliza o telefone para o formato E.164 sem o "+", assumindo Brasil (55)
// quando o número não traz código de país.
function normalizePhone(raw: string): string {
  const digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('55')) {
    return digits;
  }
  return `55${digits}`;
}

export async function sendRsvpInvite(
  input: SendInviteInput,
): Promise<SendInviteResult> {
  const config = readConfig();
  if (!config) {
    return {
      success: false,
      error:
        'WhatsApp não configurado. Defina WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID e WHATSAPP_TEMPLATE_NAME.',
    };
  }

  const to = normalizePhone(input.phone);
  const url = `https://graph.facebook.com/${config.graphVersion}/${config.phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: config.templateName,
      language: { code: config.templateLang },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: input.groupName },
            { type: 'text', text: input.link },
            { type: 'text', text: input.securityCode },
          ],
        },
      ],
    },
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message =
        data?.error?.message || `Falha no envio (HTTP ${res.status}).`;
      return { success: false, error: message };
    }

    const messageId = data?.messages?.[0]?.id as string | undefined;
    return { success: true, messageId };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Erro de rede ao chamar a API do WhatsApp.',
    };
  }
}
