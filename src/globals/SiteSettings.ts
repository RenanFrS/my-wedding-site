import type { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configurações do Site',
  admin: {
    description:
      'Configurações gerais do site em abas: casal, data, cores, fontes, pagamento e SEO.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Casal e Data',
          fields: [
            {
              name: 'couple',
              type: 'group',
              label: 'Informações do Casal',
              fields: [
                {
                  name: 'coupleName',
                  type: 'text',
                  label: 'Nome do Casal',
                  required: true,
                  defaultValue: 'Nome do Casal',
                },
                {
                  name: 'groomFullName',
                  type: 'text',
                  label: 'Nome completo do noivo',
                  required: true,
                  defaultValue: 'Nome completo do noivo',
                },
                {
                  name: 'brideFullName',
                  type: 'text',
                  label: 'Nome completo da noiva',
                  required: true,
                  defaultValue: 'Nome completo da noiva',
                },
              ],
            },
            {
              name: 'weddingDate',
              type: 'date',
              label: 'Data do Casamento',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'countdownEnabled',
              type: 'checkbox',
              label: 'Exibir Contagem Regressiva',
              defaultValue: true,
            },
          ],
        },
        {
          label: 'Cores',
          fields: [
            {
              name: 'colors',
              type: 'group',
              label: 'Cores do Site',
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  label: 'Cor Primária',
                  required: true,
                  defaultValue: '#ac5b30',
                  admin: {
                    description: 'Cor principal do site (ex: #ac5b30). Use o formato hexadecimal.',
                  },
                },
                {
                  name: 'secondaryColor',
                  type: 'text',
                  label: 'Cor Secundária',
                  required: true,
                  defaultValue: '#6d4635',
                },
                {
                  name: 'accentColor',
                  type: 'text',
                  label: 'Cor de Destaque',
                  required: true,
                  defaultValue: '#fefaf6',
                },
                {
                  name: 'textPrimaryColor',
                  type: 'text',
                  label: 'Cor do Texto Primário',
                  required: true,
                  defaultValue: '#6d4635',
                },
                {
                  name: 'textSecondaryColor',
                  type: 'text',
                  label: 'Cor do Texto Secundário',
                  required: true,
                  defaultValue: '#ac5b30',
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  label: 'Cor de Fundo',
                  required: true,
                  defaultValue: '#fefaf6',
                },
              ],
            },
          ],
        },
        {
          label: 'Fontes',
          fields: [
            {
              name: 'fonts',
              type: 'group',
              label: 'Fontes',
              fields: [
                {
                  name: 'fontType',
                  type: 'select',
                  label: 'Tipo de Fonte',
                  required: true,
                  defaultValue: 'custom',
                  options: [
                    { label: 'Google Fonts', value: 'google' },
                    { label: 'Fonte Customizada', value: 'custom' },
                  ],
                },
                {
                  name: 'googleFontName',
                  type: 'text',
                  label: 'Nome da Google Font',
                  admin: {
                    condition: (_, siblingData) => siblingData?.fontType === 'google',
                    description: 'Ex: Great Vibes, Cinzel, etc.',
                  },
                },
                {
                  name: 'customFontUpload',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Upload Fonte Customizada',
                  admin: {
                    condition: (_, siblingData) => siblingData?.fontType === 'custom',
                    description: 'Upload de arquivo .woff2, .woff ou .ttf',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Pagamento',
          fields: [
            {
              name: 'payment',
              type: 'group',
              label: 'Pagamento / Presentes',
              fields: [
                {
                  name: 'paymentMethodName',
                  type: 'text',
                  label: 'Nome do Método de Pagamento',
                  defaultValue: 'Pix',
                },
                {
                  name: 'defaultPaymentLink',
                  type: 'text',
                  label: 'Link de Pagamento Padrão',
                  admin: {
                    description: 'Usado quando o item da lista de presentes não tem link próprio.',
                  },
                },
                {
                  name: 'paymentInstructions',
                  type: 'richText',
                  label: 'Instruções de Pagamento',
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: 'SEO',
              fields: [
                {
                  name: 'siteTitle',
                  type: 'text',
                  label: 'Título do Site',
                  required: true,
                  defaultValue: 'Nosso Casamento',
                },
                {
                  name: 'siteDescription',
                  type: 'textarea',
                  label: 'Descrição do Site',
                  defaultValue: 'Site oficial do nosso casamento',
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Imagem Open Graph',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
