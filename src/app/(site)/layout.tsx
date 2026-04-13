import '../globals.css';
import type { Metadata } from 'next';
import SmoothScroll from '@/components/SmoothScroll';
import { getSiteSettings } from '@/lib/api';
import { buildCSSVariables } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const { seo } = settings;
  const ogImageURL = seo.ogImage?.url || seo.ogImage?.cloudinary?.secure_url;

  return {
    title: seo.siteTitle || 'Nosso Casamento',
    description: seo.siteDescription || 'Site oficial do nosso casamento',
    openGraph: {
      title: seo.siteTitle || 'Nosso Casamento',
      description: seo.siteDescription || 'Site oficial do nosso casamento',
      images: ogImageURL ? [{ url: ogImageURL }] : [],
      type: 'website',
    },
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const settings = await getSiteSettings();
  const cssVars = buildCSSVariables(settings.colors);
  const customFontURL =
    settings.fonts.customFontUpload?.url ||
    settings.fonts.customFontUpload?.cloudinary?.secure_url;

  // Dynamic Google Font import
  const googleFontUrl =
    settings.fonts.fontType === 'google' && settings.fonts.googleFontName
      ? `https://fonts.googleapis.com/css2?family=${encodeURIComponent(settings.fonts.googleFontName)}&display=swap`
      : null;

  return (
    <html lang="pt-br" style={cssVars as React.CSSProperties}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/logo/favicon.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Cinzel&family=Quicksand&display=swap"
          rel="stylesheet"
        />
        {googleFontUrl && <link href={googleFontUrl} rel="stylesheet" />}
        {settings.fonts.fontType === 'custom' && customFontURL && (
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @font-face {
                  font-family: 'PayloadCustomFont';
                  src: url('${customFontURL}') format('woff2');
                  font-weight: 400;
                  font-style: normal;
                  font-display: swap;
                }
              `,
            }}
          />
        )}
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}