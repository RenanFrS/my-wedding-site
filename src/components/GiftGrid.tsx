'use client';

import React from 'react';
import type { GiftItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import PayloadMediaRenderer from '@/components/PayloadMediaRenderer';

interface GiftGridProps {
  gifts: GiftItem[];
  defaultPaymentLink: string;
}

export default function GiftGrid({ gifts, defaultPaymentLink }: GiftGridProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {gifts.map((gift) => (
        <GiftCard
          key={gift.id}
          item={gift}
          defaultPaymentLink={defaultPaymentLink}
        />
      ))}
    </div>
  );
}

interface GiftCardProps {
  item: GiftItem;
  defaultPaymentLink: string;
}

function GiftCard({ item, defaultPaymentLink }: GiftCardProps): React.JSX.Element {
  const paymentUrl = item.paymentLink || defaultPaymentLink;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden">
        <PayloadMediaRenderer
          media={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-base text-[var(--color-text-primary)] leading-tight">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="text-xs text-[var(--color-text-primary)]/70 line-clamp-2">
            {item.subtitle}
          </p>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-[var(--color-text-secondary)]">
            {formatPrice(item.price)}
          </span>
          {paymentUrl ? (
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2 rounded-full bg-[var(--color-primary)] text-white text-xs font-medium tracking-wide hover:brightness-110 transition-all"
            >
              Presentear
            </a>
          ) : (
            <span className="text-xs text-[var(--color-text-primary)]/50 italic">
              Em breve
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
