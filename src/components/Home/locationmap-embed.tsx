import { siteGoogleMapsEmbedUrl } from '@/lib/site';

export default function LocationMapEmbed() {
  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg bg-stone-200 shadow-lg" aria-label="Interactive map of 14 Bygrove Street, London E14 6DN">
      <iframe
        src={siteGoogleMapsEmbedUrl}
        width="100%"
        height="100%"
        className="absolute inset-0 h-full w-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="14 Bygrove Street Location Map"
      />

    </div>
  );
}
