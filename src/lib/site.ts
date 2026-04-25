/** Canonical site origin (no trailing slash). Override with NEXT_PUBLIC_SITE_URL in production. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primeprint.uk'
).replace(/\/$/, '');

export const siteAddress = {
  streetAddress: '14 Bygrove Street',
  addressLocality: 'London',
  postalCode: 'E14 6DN',
  addressCountry: 'GB',
} as const;

export const siteAddressLabel = '14 Bygrove Street, London E14 6DN';

export const siteAddressMapQuery = encodeURIComponent(siteAddressLabel);
