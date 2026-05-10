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
  titleColor: string;
  subtitleColor: string;
  backgroundColor: string;
  buttonColor: string;
  textColor: string;
}): Record<string, string> {
  return {
    '--color-title': colors.titleColor,
    '--color-subtitle': colors.subtitleColor,
    '--color-background': colors.backgroundColor,
    '--color-button': colors.buttonColor,
    '--color-text': colors.textColor,
  };
}
