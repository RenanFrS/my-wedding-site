import type { CollectionConfig } from 'payload';
import crypto from 'crypto';

export const RSVPs: CollectionConfig = {
  slug: 'rsvps',
  admin: {
    useAsTitle: 'groupName',
    defaultColumns: ['groupName', 'pendingCount', 'phone', 'token', 'securityCode'],
    description: 'Controle de confirmação por família/grupo e disparo de lembretes para quem ainda está pendente.',
  },
  access: {
    read: () => true, // Para o frontend consultar pelo token
    update: () => true, // Para o frontend atualizar o status via API
    create: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  hooks: {
    // Gerar automaticamente o Token da URL e o Código de Segurança ao criar o registro
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        if (operation === 'create') {
          if (!data.token) {
            data.token = crypto.randomBytes(12).toString('hex'); // ex: cmfzv2ytd...
          }
          if (!data.securityCode) {
            // Gera um código numérico de 6 dígitos aleatório
            data.securityCode = Math.floor(100000 + Math.random() * 900000).toString();
          }
        }

        const members = Array.isArray(data.members)
          ? data.members
          : Array.isArray(originalDoc?.members)
            ? originalDoc.members
            : [];

        data.pendingCount = members.filter((member: any) => member?.status === 'pending').length;

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
      required: true,
    },
    {
      name: 'pendingCount',
      type: 'number',
      label: 'Convidados Pendentes',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Quantidade de convidados desse grupo que ainda não confirmaram presença.',
      },
    },
    {
      name: 'members',
      type: 'array',
      label: 'Membros do Grupo (Convidados)',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nome do Convidado',
          required: true,
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
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'securityCode',
      type: 'text',
      label: 'Código de Segurança (Gerado Automaticamente)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'whatsappMessage',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/payload/WhatsAppMessage#default',
        },
      },
    },
  ],
};
