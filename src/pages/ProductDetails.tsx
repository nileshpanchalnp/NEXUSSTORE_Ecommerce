import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { couponService, Coupon } from '../services/couponService'; // Added Coupon service
import { useCart } from '../contexts/CartContext';
import { ProductGallery } from '../components/product/ProductGallery';
import { RatingStars } from '../components/common/RatingStars';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext'; // <--- Add this
import {
  Truck,
  RefreshCw,
  ShieldCheck,
  Loader2,
  Check,
  Ticket,
  Tag,
  X,
  Copy,
  Info
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart: updateLocalCart } = useCart();
  const { isAuthenticated } = useAuth(); // <--- Add this line
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // UI States
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);

  // DYNAMIC COUPONS STATE
  const [availableOffers, setAvailableOffers] = useState<Coupon[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);

  // Fetch Product Data
  useEffect(() => {
    const fetchProductAndOffers = async () => {
      try {
        setLoading(true);
        if (id) {
          const response: any = await productService.getProductById(id);
          const data = response.data[0] || response.data;
          setProduct(data);

          if (data.variants?.length > 0) {
            setSelectedVariantIndex(0);
            setSelectedSize(data.variants[0].size[0]?.size || '');
          }

          // FETCH DYNAMIC OFFERS once product data is available
          fetchOffers(id, data.category);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndOffers();
  }, [id]);

  // Function to fetch offers
  const fetchOffers = async (productId: string, category: string) => {
    try {
      setLoadingOffers(true);
      const coupons = await couponService.getCouponsByProduct(productId, category);
      setAvailableOffers(coupons);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoadingOffers(false);
    }
  };

  const handleAddToCart = async () => {
    // 1. CHECK LOGIN STATUS FIRST
    if (!isAuthenticated) {
      alert("Please login first to add items to your cart.");
      // Optional: Redirect them to login page
      // navigate('/login'); 
      return;
    }
    if (!product || isAdding || !currentVariant) return;

    if (currentVariant.size?.length > 0 && !selectedSize) {
      alert("Please select a size first");
      return;
    }

    try {
      setIsAdding(true);
      await updateLocalCart({
        ...product,
        selectedVariant: currentVariant,
        selectedSize: selectedSize
      }, quantity);
      setTimeout(() => setIsAdding(false), 2000);
    } catch (error) {
      setIsAdding(false);
      console.error("Add to cart failed:", error);
      alert("Could not add item to cart.");
    }
  };

  const currentVariant = useMemo(() => {
    return product?.variants?.[selectedVariantIndex] || null;
  }, [product, selectedVariantIndex]);

  const galleryImages = useMemo(() => {
    if (!currentVariant?.images) return ['/placeholder.png'];
    return currentVariant.images.map((img: any) => img.url);
  }, [currentVariant]);

  const handleVariantChange = (index: number) => {
    setSelectedVariantIndex(index);
    const newVariant = product.variants[index];
    if (newVariant?.size?.length > 0) {
      setSelectedSize(newVariant.size[0].size);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Code ${code} copied!`);
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="animate-spin text-[#0d6efd]" size={48} />
    </div>
  );

  if (!product) return <div className="text-center py-20 font-bold">Product not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen relative">

      {/* OFFERS MODAL */}
      {showOffersModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Tag className="text-[#0d6efd]" size={20} />
                Available Offers
              </h3>
              <button
                onClick={() => setShowOffersModal(false)}
                className="p-2 hover:bg-white rounded-full transition-colors border shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* --- INSTRUCTION WARNING BOX --- */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start mb-2">
                <div className="bg-amber-500 text-white p-1 rounded-full mt-0.5">
                  <Info size={14} />
                </div>
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  <span className="font-bold">Instructions:</span> Copy the coupon code below and <strong>paste it during checkout</strong> to apply your discount.
                </p>
              </div>

              {loadingOffers ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" /></div>
              ) : availableOffers.length > 0 ? (
                availableOffers.map((offer) => (
                  <div key={offer._id} className="relative border-2 border-dashed border-blue-100 rounded-2xl p-5 bg-blue-50/30">
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-[#0d6efd] text-[10px] font-black rounded uppercase tracking-tighter">
                        {offer.couponType || 'Coupon'}
                      </span>
                      <button
                        onClick={() => copyToClipboard(offer.code)}
                        className="flex items-center gap-1 text-xs font-bold text-[#0d6efd] hover:text-blue-700 bg-white px-2 py-1 rounded-lg border border-blue-100 shadow-sm"
                      >
                        <Copy size={12} /> {offer.code}
                      </button>
                    </div>
                    <h4 className="font-bold text-gray-900">{offer.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{offer.description}</p>

                    {offer.minPurchase && (
                      <p className="text-[10px] text-blue-400 mt-2 font-bold italic">Min. Purchase: ${offer.minPurchase}</p>
                    )}

                    {/* OPTIONAL: MINI TEXT INSIDE CARD */}
                    <p className="text-[9px] text-gray-400 mt-3 uppercase tracking-wider font-bold">
                      Click code to copy & use at checkout
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 font-medium">No offers available for this product.</div>
              )}
            </div>

            <div className="p-4 bg-gray-50 text-center">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Terms & Conditions Apply</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* LEFT: IMAGE GALLERY */}
            <div className="space-y-4">
              <ProductGallery key={currentVariant?._id} images={galleryImages} />
            </div>

            {/* RIGHT: CONTENT */}
            <div className="flex flex-col">
              <div className="mb-6 border-b pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#0d6efd] font-bold text-xs uppercase tracking-widest mb-1">
                      {product.category}
                    </p>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                      {product.productName}
                    </h1>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {product.isActive ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <RatingStars rating={product.rating} reviews={product.reviews} />
                  <span className="text-gray-400 text-sm">|</span>
                  <span className="text-sm text-gray-500 font-medium">{product.reviews} Reviews</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-[#0d6efd]">${product.discountPrice || product.price}</span>
                    {product.discountPrice && (
                      <span className="text-xl text-gray-400 line-through">${product.price}</span>
                    )}
                  </div>

                  {/* DYNAMIC OFFER TRIGGER */}
                  <button
                    onClick={() => setShowOffersModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 hover:bg-orange-100 transition-all group"
                  >
                    <Ticket size={18} className="group-hover:rotate-12 transition-transform" />
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase leading-none">View Offers</p>
                      <p className="text-xs font-bold">{availableOffers.length > 0 ? `${availableOffers.length} Coupons Available` : 'Check Offers'}</p>
                    </div>
                  </button>
                </div>

                <p className="mt-4 text-gray-600 leading-relaxed text-sm md:text-base">
                  {product.description}
                </p>
              </div>

              {/* ... The rest of your component (Color, Size, Add to Cart) remains the same ... */}
              <div className="space-y-8 mb-8">
                {/* COLOR SELECTOR */}
                <div>
                  <div className="flex justify-between mb-3">
                    <h4 className="text-sm font-bold uppercase">Color</h4>
                    <span className="text-sm font-bold text-gray-900">{currentVariant?.color}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.variants?.map((variant: any, idx: number) => (
                      <button
                        key={variant._id || idx}
                        onClick={() => handleVariantChange(idx)}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all shadow-sm
                          ${selectedVariantIndex === idx ? 'border-[#0d6efd] ring-2 ring-blue-100 scale-110' : 'border-gray-200'}`}
                        style={{ backgroundColor: variant.colorCode }}
                        title={variant.color}
                      >
                        {selectedVariantIndex === idx && (
                          <Check size={14} className={variant.colorCode === '#ffffff' ? 'text-black mx-auto' : 'text-white mx-auto'} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SIZE SELECTOR */}
                <div>
                  <div className="flex justify-between mb-3">
                    <h4 className="text-sm font-bold uppercase">Size</h4>
                    <button className="text-xs font-bold text-[#0d6efd] underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentVariant?.size.map((s: any) => (
                      <button
                        key={s._id || s.size}
                        disabled={s.stock === 0}
                        onClick={() => setSelectedSize(s.size)}
                        className={`h-11 min-w-[3.5rem] px-4 rounded-xl border-2 font-bold text-sm transition-all
                          ${s.stock === 0 ? 'opacity-30 cursor-not-allowed bg-gray-100 border-gray-200' : ''}
                          ${selectedSize === s.size
                            ? 'border-[#0d6efd] text-[#0d6efd] bg-blue-50'
                            : 'border-gray-100 text-gray-600 hover:border-gray-300'}`}
                      >
                        {s.size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QUANTITY & ADD TO CART */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="flex items-center border-2 border-gray-100 rounded-2xl h-14 bg-gray-50 p-1">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-12 h-full flex items-center justify-center font-bold text-xl hover:bg-white rounded-xl transition-colors"
                    >-</button>
                    <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-12 h-full flex items-center justify-center font-bold text-xl hover:bg-white rounded-xl transition-colors"
                    >+</button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className={`flex-1 h-14 text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
    ${!isAuthenticated
                        ? 'bg-gray-800 hover:bg-black text-white' // Style for non-logged in
                        : isAdding
                          ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-200'
                          : 'bg-[#0d6efd] hover:bg-[#0b5ed7] text-white shadow-blue-200'
                      }`}
                    disabled={product.isActive === false || isAdding}
                  >
                    {/* Change text based on login status */}
                    {!isAuthenticated ? (
                      'LOGIN TO ADD TO CART'
                    ) : isAdding ? (
                      <>
                        <Check size={20} />
                        ADDED TO CART
                      </>
                    ) : (
                      'ADD TO CART'
                    )}
                  </Button>
                </div>
              </div>

              {/* Trust Badges section... */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0d6efd]"><Truck size={20} /></div>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">Free Shipping</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0d6efd]"><RefreshCw size={20} /></div>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">30 Day Returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0d6efd]"><ShieldCheck size={20} /></div>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">Safe Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};