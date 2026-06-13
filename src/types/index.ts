export interface Product {
  discountPrice: any;
  isActive: any;
  _id: number;
  id: number;
  productName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  description: string;
  colors: string[];
  sizes: string[];
  stock: number;
  variants: Variant[];
  selectedVariant?: Variant;
  selectedSize?: string;
}
export interface Variant {
  images: any;
  color: string;
  colorCode?: string;
  image: {
    publicId: string;
    url: string;
  };
  size: Array<{
    size: string;
    name: string;
    stock: number;
    _id: string;
  }>;
}
export interface CartItem extends Product {
  Coupon: any;
  color: any;
  selectedColor: any;
  quantity: number;
  size?: string;
}
export interface Category {
  _id: string;
  id: string;
  name: string;
  productCount?: number;
  image: {
    url: string;
  };
  count: number;
}