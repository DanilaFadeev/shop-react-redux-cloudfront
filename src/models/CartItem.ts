import { Product } from 'models/Product';
import { Stock } from 'models/Stock';

export type CartItem = {
  product: Product & Stock,
  count: number,
};