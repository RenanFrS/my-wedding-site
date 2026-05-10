import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export function buildCSSVariables(colors: {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  backgroundColor: string;
}): Record<string, string> {
  return {
    '--color-primary': colors.primaryColor,
    '--color-secondary': colors.secondaryColor,
    '--color-accent': colors.accentColor,
    '--color-text-primary': colors.textPrimaryColor,
    '--color-text-secondary': colors.textSecondaryColor,
    '--color-background': colors.backgroundColor,
  };
}
