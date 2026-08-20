export const PACKAGE_NAME = 'com.connorkelly.footballlegacy';

export interface SupportTier {
  id: string;
  sku: string; // Configurable Google Play Product ID
  title: string;
  badge: string;
  price: string;
  priceAmountMicros: number;
  currency: string;
  icon: string;
  color: string;
  bgGradient: string;
  borderColor: string;
}

/**
 * Configurable Google Play Product IDs for Support Purchases.
 * You can edit these product IDs (SKUs) to match your Google Play Console setup.
 */
export const SUPPORT_TIERS: SupportTier[] = [
  {
    id: 'supporter_099',
    sku: 'fl_supporter_099',
    title: 'Supporter',
    badge: '❤️ Supporter',
    price: '€0.99',
    priceAmountMicros: 990000,
    currency: 'EUR',
    icon: '❤️',
    color: '#E74C3C',
    bgGradient: 'from-rose-500/10 to-red-500/5',
    borderColor: 'border-rose-500/30',
  },
  {
    id: 'bronze_299',
    sku: 'fl_bronze_299',
    title: 'Bronze Supporter',
    badge: '🥉 Bronze Supporter',
    price: '€2.99',
    priceAmountMicros: 2990000,
    currency: 'EUR',
    icon: '🥉',
    color: '#CD7F32',
    bgGradient: 'from-amber-700/10 to-amber-600/5',
    borderColor: 'border-amber-700/30',
  },
  {
    id: 'silver_499',
    sku: 'fl_silver_499',
    title: 'Silver Supporter',
    badge: '🥈 Silver Supporter',
    price: '€4.99',
    priceAmountMicros: 4990000,
    currency: 'EUR',
    icon: '🥈',
    color: '#C0C0C0',
    bgGradient: 'from-slate-300/10 to-slate-400/5',
    borderColor: 'border-slate-300/30',
  },
  {
    id: 'gold_999',
    sku: 'fl_gold_999',
    title: 'Gold Supporter',
    badge: '🥇 Gold Supporter',
    price: '€9.99',
    priceAmountMicros: 9900000,
    currency: 'EUR',
    icon: '🥇',
    color: '#F1C40F',
    bgGradient: 'from-yellow-500/10 to-amber-500/5',
    borderColor: 'border-amber-400/30',
  },
  {
    id: 'platinum_1999',
    sku: 'fl_platinum_1999',
    title: 'Platinum Supporter',
    badge: '💎 Platinum Supporter',
    price: '€19.99',
    priceAmountMicros: 19990000,
    currency: 'EUR',
    icon: '💎',
    color: '#3498DB',
    bgGradient: 'from-cyan-500/10 to-blue-500/5',
    borderColor: 'border-cyan-400/30',
  },
  {
    id: 'legend_4999',
    sku: 'fl_legend_4999',
    title: 'Legend Supporter',
    badge: '👑 Legend Supporter',
    price: '€49.99',
    priceAmountMicros: 49990000,
    currency: 'EUR',
    icon: '👑',
    color: '#9B59B6',
    bgGradient: 'from-purple-500/10 to-amber-500/10',
    borderColor: 'border-purple-400/40',
  },
];
