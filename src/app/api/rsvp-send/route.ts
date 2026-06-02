import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { sendRsvpInvite, isWhatsAppConfigured } from '@/lib/whatsapp';

interface SendBody {
  id?: number | string;
  ids?: Array<number | string>;
  all?: boolean;
  force?: boolean;
}

function resolveBaseUrl(req: Request): string {
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, '');
  }
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  const payload = await getPayload({ config });

  // Apenas administradores autenticados podem disparar mensagens.
  const { user } = await payload.auth({ headers: req.headers });
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  if (!isWhatsAppConfigured()) {
    return NextResponse.json(
      {
        error:
          'WhatsApp não configurado no servidor (variáveis WHATSAPP_*).',
      },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as SendBody;
  const baseUrl = resolveBaseUrl(req);
  const force = body.force === true;

  // Monta a lista de RSVPs alvo.
  let targets: any[] = [];
  if (body.all) {
    const { docs } = await payload.find({
      collection: 'rsvps',
      limit: 1000,
      depth: 0,
    });
    targets = docs;
  } else {
    const ids = body.ids ?? (body.id != null ? [body.id] : []);
    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'Informe "id", "ids" ou "all".' },
        { status: 400 },
      );
    }
    const { docs } = await payload.find({
      collection: 'rsvps',
      where: { id: { in: ids } },
      limit: 1000,
      depth: 0,
    });
    targets = docs;
  }

  const results: Array<{
    id: number | string;
    groupName: string;
    status: 'sent' | 'skipped' | 'failed';
    error?: string;
  }> = [];

  for (const rsvp of targets) {
    // Trava anti-reenvio: só pula em envio em lote/automático; o reenvio
    // explícito (force) ignora a trava.
    if (rsvp.whatsapp?.status === 'sent' && !force) {
      results.push({
        id: rsvp.id,
        groupName: rsvp.groupName,
        status: 'skipped',
      });
      continue;
    }

    const link = `${baseUrl}/rsvp/${rsvp.token}`;
    const result = await sendRsvpInvite({
      phone: rsvp.phone,
      groupName: rsvp.groupName,
      link,
      securityCode: rsvp.securityCode,
    });

    await payload.update({
      collection: 'rsvps',
      id: rsvp.id,
      data: {
        whatsapp: {
          status: result.success ? 'sent' : 'failed',
          sentAt: result.success ? new Date().toISOString() : rsvp.whatsapp?.sentAt,
          lastError: result.success ? null : result.error,
        },
      },
    });

    results.push({
      id: rsvp.id,
      groupName: rsvp.groupName,
      status: result.success ? 'sent' : 'failed',
      error: result.error,
    });
  }

  const sent = results.filter((r) => r.status === 'sent').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;

  return NextResponse.json({
    success: failed === 0,
    summary: { sent, failed, skipped, total: results.length },
    results,
  });
}
