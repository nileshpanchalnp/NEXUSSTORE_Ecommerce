import api from '../api/config';

export const cartService = {
  // Add item to DB cart
  addToCart: async (userId: string, itemData: any) => {
    // Matches your API endpoint structure
    const response = await api.post('api/cart/add', { 
      userId, 
      ...itemData 
    });
    return response.data;
  },

  // Update item quantity in DB
  updateCartItem: async (userId: string, productId: string, quantity: number) => {
    const response = await api.put('api/cart/update', { 
      userId, 
      productId, 
      quantity 
    });
    return response.data;
  },

  // Remove item from DB
  removeFromCart: async ( productId: string) => {
    const response = await api.delete(`api/cart/remove/${productId}`);
    return response.data;
  },

    clearFullCart: async () => {
    const response = await api.delete(`api/cart/clearcart`);
    return response.data;
  },

  // Get full cart for a user (useful on login)
  getUserCart: async () => {
    const response = await api.get(`api/cart/get`);
    return response.data;
  },


};