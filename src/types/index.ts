// ============================================
// Central type definitions for the wedding site
// ============================================

// ---- Payload Collection Types ----

/** Media object from Payload uploads */
export interface PayloadMedia {
  id: string;
  url?: string;
  cloudinaryPlayerURL?: string;
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
  location: 'hero' | 'section1' | 'section2' | 'section3';
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

/** Dress code section content */
export interface DressCodeContent {
  id: string | number;
  style: string;
  description: string;
  forHer: string;
  forHim: string;
  media: PayloadMedia | null;
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
  titleColor: string;
  subtitleColor: string;
  backgroundColor: string;
  buttonColor: string;
  textColor: string;
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

