export const DONATION_CONFIG = {
  /**
   * Configurable donation URL (e.g., PayPal, Ko-fi, Buy Me a Coffee, Patreon).
   * You can change this URL directly or set the VITE_DONATION_URL environment variable.
   */
  donationUrl: ((import.meta as any).env?.VITE_DONATION_URL as string) || 'https://ko-fi.com',
};
