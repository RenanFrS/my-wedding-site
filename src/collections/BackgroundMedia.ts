import type { CollectionConfig } from 'payload';

export const BackgroundMedia: CollectionConfig = {
  slug: 'background-media',
  labels: {
    singular: 'Foto de Fundo',
    plural: 'Fotos de Fundo',
  },
  admin: {
    group: 'Conteúdo do Site',
    useAsTitle: 'location',
    defaultColumns: ['location', 'media', 'active'],
    description:
      'Fotos de fundo de cada parte do site. Escolha em "Onde aparece" o local da foto.',
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
      label: 'Onde aparece',
      required: true,
      options: [
        { label: 'Foto principal (topo do site)', value: 'hero' },
        { label: 'Fundo da seção da cerimônia', value: 'section1' },
        { label: 'Fundo da seção de presentes', value: 'section2' },
        { label: 'Fundo da página Lista de Presentes', value: 'section3' },
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
