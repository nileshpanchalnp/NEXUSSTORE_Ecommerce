import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Products } from '../pages/Products';
import { ProductDetails } from '../pages/ProductDetails';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { OrderComplete } from '../pages/OrderComplete';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Contact } from '../pages/Contact';
import { Blog } from '../pages/Blog';
import { AboutUs } from '../pages/AboutUs';
import { TrackOrder } from '../pages/TrackOrder';
import { LegalPage } from '../pages/LegalPage';
import { Categories } from '../pages/Categories';
import { AccountPage } from '../pages/AccountPage';
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success/:orderId" element={<OrderComplete />} />
      <Route path="/login" element={<Login />} />
      <Route path="/account" element={<AccountPage/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/track-order" element={<TrackOrder />} />
      <Route path="/privacy-policy" element={<LegalPage title="Privacy Policy" />} />
      <Route path="/terms" element={<LegalPage title="Terms & Conditions" />} />
    </Routes>
  );
};