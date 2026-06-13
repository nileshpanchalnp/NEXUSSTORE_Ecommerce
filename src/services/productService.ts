import api from '../api/config';
import { Product } from '../types';

export const productService = {
  // Get all products (Website & Admin)
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get('api/public/products');
    return response.data.data;
  },

  // Get single product (Details Page)
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`api/public/products/${id}`);
    return response.data;
  },

};