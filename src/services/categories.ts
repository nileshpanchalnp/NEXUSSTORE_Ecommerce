import api from '../api/config';
import { Category } from '../types';

export const CategoriesService = {
  // Get all products (Website & Admin)
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get('api/public/categories');
    return response.data.data;
  },

  // Get single product (Details Page)
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await api.get(`api/public/categories/${id}`);
    return response.data;
  },

};