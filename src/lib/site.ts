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

export const siteAddressLabel = `${siteAddress.streetAddress}, ${siteAddress.addressLocality} ${siteAddress.postalCode}`;

export const siteGoogleMapsPlaceUrl =
  'https://www.google.com/maps/place/Prime+Print+LTD/@51.513401,-0.0208116,16.03z/data=!4m10!1m2!2m1!1sprimeprint!3m6!1s0x4876031e9264e35b:0xd96d0910abd83888!8m2!3d51.512527!4d-0.0181969!15sCgpwcmltZXByaW50kgEKcHJpbnRfc2hvcOABAA!16s%2Fg%2F11nhk37s19!5m1!1e4?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D';

const siteGoogleMapsEmbedQuery = encodeURIComponent('Prime Print LTD');
const siteGoogleMapsEmbedCoordinates = '51.512527,-0.0181969';

export const siteGoogleMapsEmbedUrl =
  `https://www.google.com/maps?q=${siteGoogleMapsEmbedQuery}&ll=${siteGoogleMapsEmbedCoordinates}&z=16&ie=UTF8&output=embed`;
