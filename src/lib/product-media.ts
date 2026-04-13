export function getPrimaryImage(product: { imageUrl: string[] }): string {
  return product.imageUrl[0] ?? '';
}