import type { CollectionConfig } from 'payload';

export const DressCode: CollectionConfig = {
  slug: 'dress-code',
  labels: {
    singular: 'Dress Code',
    plural: 'Dress Code',
  },
  admin: {
    group: 'Conteúdo do Site',
    useAsTitle: 'style',
    defaultColumns: ['style', 'active', 'updatedAt'],
    description: 'Conteúdo da seção de vestimenta (Dress Code).',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'style',
      type: 'text',
      label: 'Estilo de vestimenta',
      required: true,
      defaultValue: 'Esporte Fino',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrição',
      required: true,
    },
    {
      name: 'forHer',
      type: 'textarea',
      label: 'Para elas',
      required: true,
    },
    {
      name: 'forHim',
      type: 'textarea',
      label: 'Para eles',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem de referência',
      required: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Ativo',
      defaultValue: true,
    },
  ],
};
