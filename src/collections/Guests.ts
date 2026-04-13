import type { CollectionConfig } from 'payload';

export const Guests: CollectionConfig = {
  slug: 'guests',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'confirmed', 'email', 'phone'],
    description: 'Lista de convidados do casamento.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefone',
    },
    {
      name: 'confirmed',
      type: 'checkbox',
      label: 'Confirmado',
      defaultValue: false,
    },
    {
      name: 'dependents',
      type: 'array',
      label: 'Acompanhantes',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nome',
          required: true,
        },
        {
          name: 'age',
          type: 'number',
          label: 'Idade',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          label: 'Tipo',
          required: true,
          options: [
            { label: 'Cônjuge', value: 'spouse' },
            { label: 'Filho(a)', value: 'child' },
            { label: 'Outro', value: 'other' },
          ],
        },
      ],
    },
  ],
};
