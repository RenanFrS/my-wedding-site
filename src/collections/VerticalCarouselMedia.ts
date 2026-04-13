import type { CollectionConfig } from 'payload';

export const VerticalCarouselMedia: CollectionConfig = {
  slug: 'vertical-carousel-media',
  admin: {
    useAsTitle: 'order',
    defaultColumns: ['media', 'order', 'active'],
    description: 'Imagens do carrossel vertical (galeria parallax / Skiper30).',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Mídia',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordem',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Ativo',
      defaultValue: true,
    },
  ],
};
