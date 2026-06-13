/**
 * Mock Data for E-commerce Categories
 * These images are sourced from Unsplash for a high-end look.
 */

export interface Category {
  id: string | number;
  name: string;
  image: string;
  count: number;
  description?: string;
}

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
    count: 124,
    description: "Laptops, Smartphones, and High-Tech Gadgets"
  },
  {
    id: "cat-2",
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    count: 450,
    description: "Trending Apparel and Designer Wear"
  },
  {
    id: "cat-3",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    count: 85,
    description: "Watches, Bags, and Premium Essentials"
  },
  {
    id: "cat-4",
    name: "Home Decor",
    image: "https://images.unsplash.com/photo-1513507766391-aa3a70359f4a?w=800&q=80",
    count: 210,
    description: "Modern Furniture and Interior Styling"
  },
  {
    id: "cat-5",
    name: "Gadgets",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80",
    count: 95,
    description: "Smart Home Devices and Wearables"
  },
  {
    id: "cat-6",
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    count: 150,
    description: "Skincare, Makeup, and Self-Care"
  }
];