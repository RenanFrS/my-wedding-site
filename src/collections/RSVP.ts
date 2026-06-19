import type { CollectionConfig } from 'payload';
import crypto from 'crypto';

// Gera um token de URL único e seguro.
function generateToken(): string {
  return crypto.randomBytes(12).toString('hex');
}

// Gera um código numérico de 6 dígitos usando fonte criptográfica.
function generateSecurityCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

// Garante unicidade consultando a coleção antes de persistir.
async function generateUniqueValue(
  req: any,
  field: 'token' | 'securityCode',
  generator: () => string,
): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = generator();
    const { totalDocs } = await req.payload.find({
      collection: 'rsvps',
      where: { [field]: { equals: candidate } },
      limit: 0,
      depth: 0,
    });
    if (totalDocs === 0) {
      return candidate;
    }
  }
  // Fallback extremamente improvável: token longo o suficiente para não colidir.
  return field === 'token' ? generateToken() : generateSecurityCode();
}

export const RSVPs: CollectionConfig = {
  slug: 'rsvps',
  labels: {
    singular: 'Grupo de Convidados',
    plural: 'Convidados',
  },
  admin: {
    group: 'Convidados & Presentes',
    useAsTitle: 'groupName',
    defaultColumns: ['groupName', 'confirmationStatus', 'pendingCount', 'phone', 'whatsapp'],
    description:
      'Cadastro único de grupos/famílias: titular + agregados, código de segurança e disparo do convite por WhatsApp.',
    components: {
      // Botão de envio em lote no topo da lista de RSVPs.
      beforeListTable: ['@/components/payload/RsvpListActions#default'],
    },
  },
  access: {
    // Fechado ao público: tokens/códigos não podem vazar pela REST API.
    // As páginas públicas (/rsvp/[token] e /api/rsvp-confirm) usam a Local API,
    // que ignora o access control, então continuam funcionando.
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        if (operation === 'create') {
          if (!data.token) {
            data.token = await generateUniqueValue(req, 'token', generateToken);
          }
          if (!data.securityCode) {
            data.securityCode = await generateUniqueValue(
              req,
              'securityCode',
              generateSecurityCode,
            );
          }
        }

        const members = Array.isArray(data.members)
          ? data.members
          : Array.isArray(originalDoc?.members)
            ? originalDoc.members
            : [];

        const pending = members.filter((m: any) => m?.status === 'pending').length;
        const confirmed = members.filter((m: any) => m?.status === 'confirmed').length;
        const declined = members.filter((m: any) => m?.status === 'declined').length;

        data.pendingCount = pending;

        // Status agregado do grupo, para visualizar/filtrar na lista do admin.
        if (members.length === 0 || pending > 0) {
          data.confirmationStatus = 'pending';
        } else if (confirmed > 0 && declined === 0) {
          data.confirmationStatus = 'confirmed';
        } else if (declined > 0 && confirmed === 0) {
          data.confirmationStatus = 'declined';
        } else {
          data.confirmationStatus = 'partial';
        }

        return data;
      },
    ],
  },
  fields: [
    {
      name: 'groupName',
      type: 'text',
      label: 'Nome do Grupo (ex: Amábely e Família)',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefone (WhatsApp do Titular)',
      admin: {
        description: 'Opcional. Apenas números, com DDD. Ex: 11999998888',
      },
    },
    {
      name: 'confirmationStatus',
      type: 'select',
      label: 'Confirmação',
      defaultValue: 'pending',
      options: [
        { label: 'Pendente', value: 'pending' },
        { label: 'Confirmado', value: 'confirmed' },
        { label: 'Recusado', value: 'declined' },
        { label: 'Parcial', value: 'partial' },
      ],
      admin: {
        readOnly: true,
        description:
          'Status agregado do grupo (calculado a partir dos membros). Use o filtro da lista para ver quem confirmou, recusou ou está pendente.',
      },
    },
    {
      name: 'pendingCount',
      type: 'number',
      label: 'Convidados Pendentes',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Quantidade de convidados desse grupo que ainda não confirmaram.',
      },
    },
    {
      name: 'members',
      type: 'array',
      label: 'Membros do Grupo (Convidado + Agregados)',
      minRows: 1,
      labels: {
        singular: 'Membro',
        plural: 'Membros',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nome do Convidado',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          label: 'Papel',
          defaultValue: 'agregado',
          required: true,
          options: [
            { label: 'Titular', value: 'titular' },
            { label: 'Agregado', value: 'agregado' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          label: 'Status de Confirmação',
          defaultValue: 'pending',
          options: [
            { label: 'Pendente', value: 'pending' },
            { label: 'Comparecerá', value: 'confirmed' },
            { label: 'Não comparecerá', value: 'declined' },
          ],
        },
      ],
    },
    {
      name: 'token',
      type: 'text',
      label: 'Token Único (Gerado Automaticamente)',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'securityCode',
      type: 'text',
      label: 'Código de Segurança (Gerado Automaticamente)',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'whatsapp',
      type: 'group',
      label: 'WhatsApp',
      admin: {
        description: 'Controle do disparo automático do convite.',
      },
      fields: [
        {
          name: 'status',
          type: 'select',
          label: 'Status do Envio',
          defaultValue: 'not_sent',
          options: [
            { label: 'Não enviado', value: 'not_sent' },
            { label: 'Enviado', value: 'sent' },
            { label: 'Falhou', value: 'failed' },
          ],
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'sentAt',
          type: 'date',
          label: 'Enviado em',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'lastError',
          type: 'textarea',
          label: 'Último Erro',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'assignedTable',
      type: 'relationship',
      relationTo: 'tables',
      label: 'Mesa',
      admin: {
        description:
          'Mesa em que o grupo está alocado. Normalmente definido pela tela "Mesas".',
      },
    },
    {
      name: 'sendInvite',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/payload/SendInvite#default',
        },
      },
    },
  ],
};
