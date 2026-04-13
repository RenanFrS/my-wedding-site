import type { CollectionConfig } from 'payload';

export const BackgroundMedia: CollectionConfig = {
  slug: 'background-media',
  admin: {
    useAsTitle: 'location',
    defaultColumns: ['location', 'media', 'active'],
    description: 'Imagens de fundo para seções do site (Hero, meio, etc.).',
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
      name: 'location',
      type: 'select',
      label: 'Localização',
      required: true,
      options: [
        { label: 'Hero (Topo)', value: 'hero' },
        { label: 'Meio do Site', value: 'middle' },
        { label: 'Seção 1', value: 'section1' },
        { label: 'Seção 2', value: 'section2' },
        { label: 'Seção 3', value: 'section3' },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Ativo',
      defaultValue: true,
    },
  ],
};
