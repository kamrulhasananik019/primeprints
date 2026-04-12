import type { Product } from '../categories';
import { bindingAccessories } from './binding-accessories';
import { customProductPrinting } from './custom-product-printing';
import { exhibitionPrinting } from './exhibition-printing';
import { garmentPrinting } from './garment-printing';
import { largeFormatPrinting } from './large-format-printing';
import { paperProducts } from './paper-products';
import { personalisedGifts } from './personalised-gifts';

export type { Product } from '../categories';

export const allProducts: Product[] = [
  ...paperProducts,
  ...bindingAccessories,
  ...largeFormatPrinting,
  ...customProductPrinting,
  ...garmentPrinting,
  ...exhibitionPrinting,
  ...personalisedGifts,
];

export const productsBySlug = new Map(allProducts.map((product) => [product.slug, product]));
