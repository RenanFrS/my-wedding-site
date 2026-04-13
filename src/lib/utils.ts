import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CountdownValues } from '@/types';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Calculate countdown values from a target date string.
 */
export function getCountdownValues(targetDate: string): CountdownValues {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;

  return {
    days: Math.floor(diff / day),
    hours: Math.floor((diff % day) / hour),
    minutes: Math.floor((diff % hour) / minute),
    seconds: Math.floor((diff % minute) / second),
    isExpired: diff <= 0,
  };
}

/**
 * Calculate remaining days until the target date.
 */
export function getDaysRemaining(targetDate: string): number {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
}

/**
 * Format a price as Brazilian Real currency.
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

/**
 * Build CSS variables object from site colors.
 */
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
