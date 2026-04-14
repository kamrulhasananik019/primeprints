export function getPrimaryImage(product: { images?: { url: string }[]; imageUrl?: string[] }): string {
  if (Array.isArray(product.images) && product.images[0]?.url) {
    return product.images[0].url;
  }
  return product.imageUrl?.[0] ?? '';
}
