import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    group: 'Sistema',
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome',
    },
  ],
};
