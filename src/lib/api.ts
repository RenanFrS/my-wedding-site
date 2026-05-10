import type {
  SiteSettings,
  VerticalCarouselMedia,
  BackgroundMedia,
  DressCodeContent,
  GiftItem,
  PayloadListResponse,
} from '@/types';
import { headers } from 'next/headers';

async function getRuntimeServerURL(): Promise<string> {
  if (
    process.env.NEXT_PUBLIC_SERVER_URL &&
    process.env.NODE_ENV === 'production'
  ) {
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }

  const reqHeaders = await headers();
  const host = reqHeaders.get('x-forwarded-host') || reqHeaders.get('host');
  const proto = reqHeaders.get('x-forwarded-proto') || 'http';

  if (host) {
    return `${proto}://${host}`;
  }

  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }

  return `http://localhost:${process.env.PORT || 3000}`;
}

/**
 * Generic fetch wrapper for Payload REST API
 */
async function payloadFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const serverURL = await getRuntimeServerURL();
  const url = `${serverURL}/api${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  });

  if (!res.ok) {
    console.error(`Payload fetch error: ${res.status} ${res.statusText} - ${url}`);
    throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
  }

  return res.json();
}

// ── Site Settings (Global) ──

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await payloadFetch<SiteSettings>('/globals/site-settings');
  } catch {
    // Safe fallback with default values
    return {
      id: '',
      couple: {
        coupleName: '',
        groomFullName: '',
        brideFullName: '',
      },
      weddingDate: '2026-09-06T00:00:00.000Z',
      countdownEnabled: true,
      colors: {
        primaryColor: '#ac5b30',
        secondaryColor: '#6d4635',
        accentColor: '#fefaf6',
        textPrimaryColor: '#6d4635',
        textSecondaryColor: '#ac5b30',
        backgroundColor: '#fefaf6',
      },
      fonts: {
        fontType: 'custom',
      },
      payment: {
        paymentMethodName: 'Pix',
        defaultPaymentLink: '',
      },
      seo: {
        siteTitle: 'Nosso Casamento',
        siteDescription: 'Site oficial do nosso casamento',
      },
      updatedAt: '',
      createdAt: '',
    };
  }
}

// ── Carousel Media (Skiper30) ──

export async function getCarouselMedia(): Promise<VerticalCarouselMedia[]> {
  try {
    const data = await payloadFetch<PayloadListResponse<VerticalCarouselMedia>>(
      '/vertical-carousel-media?where[active][equals]=true&sort=order&limit=50&depth=1'
    );
    return data.docs;
  } catch {
    return [];
  }
}

// ── Background Media ──

export async function getBackgroundMedia(
  location?: string
): Promise<BackgroundMedia[]> {
  try {
    let endpoint = '/background-media?where[active][equals]=true&depth=1&limit=20';
    if (location) {
      endpoint += `&where[location][equals]=${location}`;
    }
    const data = await payloadFetch<PayloadListResponse<BackgroundMedia>>(endpoint);
    return data.docs;
  } catch {
    return [];
  }
}

// ── Dress Code ──

export async function getDressCode(): Promise<DressCodeContent | null> {
  try {
    const data = await payloadFetch<PayloadListResponse<DressCodeContent>>(
      '/dress-code?where[active][equals]=true&sort=-updatedAt&limit=1&depth=1'
    );

    return data.docs[0] || null;
  } catch {
    return null;
  }
}

// ── Gift List ──

export async function getGiftList(): Promise<GiftItem[]> {
  try {
    const data = await payloadFetch<PayloadListResponse<GiftItem>>(
      '/gift-list?where[active][equals]=true&sort=title&limit=100&depth=1'
    );
    return data.docs;
  } catch {
    return [];
  }
}

