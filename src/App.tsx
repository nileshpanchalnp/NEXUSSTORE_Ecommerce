import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Providers
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

// Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Routes
import { AppRoutes } from './routes/AppRoutes';
import { FilterProvider } from './contexts/FilterContext';
import { AuthProvider } from './contexts/AuthContext';

/**
 * App Component
 * * Hierarchy:
 * 1. WishlistProvider - Handles "Hearted" items across all pages
 * 2. CartProvider - Handles shopping cart items and subtotals
 * 3. Router - Handles browser navigation
 * 4. Header/Footer - Global layout elements
 * 5. AppRoutes - The core page-switching logic
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
    <WishlistProvider>
      <CartProvider>
        <FilterProvider>

          <Router>
            <div className="flex flex-col min-h-screen bg-white selection:bg-blue-100 selection:text-[#0d6efd]">
              {/* The Header contains SearchBar, Navbar, and Action Icons */}
              <Header />

              {/* Main Content Area - flex-grow ensures footer stays at bottom */}
              <main className="flex-grow">
                <AppRoutes />
              </main>

              {/* Global Footer with Newsletter and Links */}
              <Footer />

              {/* Scroll to Top helper could be added here */}
            </div>
          </Router>
        </FilterProvider>

      </CartProvider>
    </WishlistProvider>
    </AuthProvider>
  );
};

export default App;