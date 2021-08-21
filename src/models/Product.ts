import * as Yup from 'yup';

export enum ProductType {
  Single = 'single',
  Album = 'album'
}

export type Product = {
  id: string;
  title: string;
  type: ProductType;
  artists: string[];
  coverUri: string;
  duration: number;
  price: number;
  discount: number;
  releaseDate: string;
  genre?: string;
  lyrics?: string;
};

export const ProductSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string(),
  price: Yup.number().required(),
});
