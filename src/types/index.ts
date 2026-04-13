// ============================================
// Central type definitions for the wedding site
// ============================================

// ---- Payload Collection Types ----

/** Dependent of a guest */
export interface Dependent {
  name: string;
  age: number;
  type: 'spouse' | 'child' | 'other';
}

/** Guest collection document */
export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  confirmed: boolean;
  dependents?: Dependent[];
  createdAt: string;
  updatedAt: string;
}

/** Media object from Payload uploads */
export interface PayloadMedia {
  id: string;
  url?: string;
  filename: string;
  mimeType?: string;
  width?: number;
  height?: number;
  alt?: string;
  cloudinary?: {
    public_id?: string;
    resource_type?: 'image' | 'video' | 'raw' | string;
    secure_url?: string;
    format?: string;
    bytes?: number;
    duration?: number;
    width?: number;
    height?: number;
  };
  createdAt: string;
  updatedAt: string;
}

/** Vertical carousel media (Skiper30) */
export interface VerticalCarouselMedia {
  id: string;
  media: PayloadMedia;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Background media for hero / site sections */
export interface BackgroundMedia {
  id: string;
  media: PayloadMedia;
  location: 'hero' | 'middle' | 'section1' | 'section2' | 'section3';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Gift list item */
export interface GiftItem {
  id: string;
  title: string;
  subtitle: string;
  image: PayloadMedia;
  price: number;
  paymentLink?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Global / SiteSettings ----

export interface SiteFont {
  fontType: 'google' | 'custom';
  googleFontName?: string;
  customFontUpload?: PayloadMedia;
}

export interface SitePayment {
  paymentMethodName: string;
  defaultPaymentLink: string;
  paymentInstructions?: any; // Lexical RichText
}

export interface SiteSEO {
  siteTitle: string;
  siteDescription: string;
  ogImage?: PayloadMedia;
}

export interface SiteCouple {
  coupleName?: string;
  groomFullName?: string;
  brideFullName?: string;
}

export interface SiteColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  backgroundColor: string;
}

export interface SiteSettings {
  id: string;
  couple?: SiteCouple;
  weddingDate: string;
  countdownEnabled: boolean;
  colors: SiteColors;
  fonts: SiteFont;
  payment: SitePayment;
  seo: SiteSEO;
  updatedAt: string;
  createdAt: string;
}

// ---- API Response wrappers ----

export interface PayloadListResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// ---- Component Prop Types ----

export interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: number[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: string;
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
}

export interface GiftCardProps {
  item: GiftItem;
  defaultPaymentLink?: string;
}

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}
