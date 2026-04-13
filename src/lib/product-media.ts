export function getPrimaryImage(product: { images: Array<{ url: string; isPrimary?: boolean }> }): string {
  const primary = product.images.find((img) => img.isPrimary);
  return primary?.url ?? product.images[0]?.url ?? '';
}