import type { CollectionConfig } from 'payload';

export const GiftList: CollectionConfig = {
  slug: 'gift-list',
  admin: {
    group: 'Convidados & Presentes',
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'active'],
    description: 'Lista de presentes do casamento.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtítulo',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      label: 'Preço (R$)',
      required: true,
      min: 0,
    },
    {
      name: 'paymentLink',
      type: 'text',
      label: 'Link de Pagamento',
      admin: {
        description: 'Se vazio, será usado o link padrão das configurações do site.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Ativo',
      defaultValue: true,
    },
  ],
};
