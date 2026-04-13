/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next';

import config from '@payload-config';
import { RootLayout } from '@payloadcms/next/layouts';
import { serverFunction } from './actions';
import React from 'react';
import { importMap } from './admin/importMap.js';
import '@payloadcms/next/css';

type Args = {
  children: React.ReactNode;
};

export default function Layout({ children }: Args) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}

export const metadata: Metadata = {
  title: 'Painel Administrativo',
};
