import type { CollectionConfig } from 'payload';

export const CoupleMessages: CollectionConfig = {
  slug: 'couple-messages',
  admin: {
    useAsTitle: 'senderName',
    defaultColumns: ['senderName', 'senderEmail', 'published', 'createdAt'],
    description:
      'Mensagens públicas enviadas para os noivos. Qualquer visitante pode enviar.',
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;

      return {
        published: {
          equals: true,
        },
      };
    },
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'senderName',
      type: 'text',
      required: true,
      maxLength: 80,
      label: 'Nome de quem enviou',
    },
    {
      name: 'senderEmail',
      type: 'email',
      required: true,
      label: 'Email de quem enviou',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 280,
      label: 'Mensagem para os noivos',
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Exibir publicamente',
      defaultValue: true,
    },
  ],
};
