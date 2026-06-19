import type { CollectionConfig } from 'payload';

// Mesas do salão. A planta visual fica em /admin/mesas (view customizada); esta
// collection guarda cada mesa e a posição dela na planta. A alocação dos grupos é
// gravada no campo `assignedTable` da collection `rsvps` (fonte única).
export const Tables: CollectionConfig = {
  slug: 'tables',
  labels: {
    singular: 'Mesa',
    plural: 'Mesas',
  },
  admin: {
    group: 'Convidados & Presentes',
    useAsTitle: 'number',
    defaultColumns: ['number', 'shape', 'capacity'],
    description:
      'Mesas do salão. Use a tela "Mesas" para montar a planta e distribuir os grupos visualmente.',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'number',
      type: 'number',
      label: 'Número da Mesa',
      required: true,
    },
    {
      name: 'shape',
      type: 'select',
      label: 'Formato',
      defaultValue: 'round',
      required: true,
      options: [
        { label: 'Redonda', value: 'round' },
        { label: 'Quadrada', value: 'square' },
        { label: 'Retangular', value: 'rectangle' },
      ],
    },
    {
      name: 'capacity',
      type: 'number',
      label: 'Lugares',
      defaultValue: 10,
      required: true,
      min: 1,
    },
    // Posição na planta, em porcentagem (0–100) do canvas — independente da
    // resolução da tela.
    {
      name: 'posX',
      type: 'number',
      label: 'Posição X (%)',
      defaultValue: 50,
    },
    {
      name: 'posY',
      type: 'number',
      label: 'Posição Y (%)',
      defaultValue: 50,
    },
  ],
};
