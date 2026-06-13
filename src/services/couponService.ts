// src/services/couponService.ts
import api from '../api/config';


export interface Coupon {
  _id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  expiryDate: string;
  couponType: 'Coupon' | 'Voucher' | 'Shipping';
}

export const couponService = {
  // Fetch all active coupons
  getAllCoupons: async (): Promise<Coupon[]> => {
    const response = await api.get(`/coupons/active`);
    return response.data;
  },

  // Fetch coupons applicable to a specific product or category
  getCouponsByProduct: async (productId: string, category: string): Promise<Coupon[]> => {
    const response = await api.get(`api/public/product-offers/${productId}`, {
      params: { category }
    });
    // console.log('Coupons for product:', response);
    return response.data.data;
  },

  applyCoupon: async (code: string  ): Promise<Coupon> => {
    const response = await api.post(`api/public/applyCoupon`, { code });
    return response.data;
  },
  
  removeCoupon: async () => {
    const response = await api.delete(`api/public/removeCoupon`);
    return response.data;
  }
};