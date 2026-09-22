import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { WishlistItem, Product } from '../types';
import { getWishlist, toggleWishlist, addToCart } from '../services/storeService';

interface WishlistPageProps {
  onNavigate: (view: string) => void;
  onProductClick: (product: Product) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onNavigate,
  onProductClick,
  onShowToast
}) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const refreshWishlist = () => {
    setWishlist(getWishlist());
  };

  const handleRemove = (product: Product) => {
    toggleWishlist(product);
    refreshWishlist();
    onShowToast(`Removed ${product.name} from wishlist`, 'info');
  };

  const handleMoveToCart = (product: Product) => {
    const res = addToCart(product, 1);
    if (res.success) {
      toggleWishlist(product);
      refreshWishlist();
      onShowToast(`✓ Moved ${product.name} to your shopping cart!`, 'success');
    } else {
      onShowToast(res.message, 'error');
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F5F1EB] text-stone-400 flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-serif-luxury font-bold text-stone-900">
          Your Wishlist is Empty
        </h2>
        <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          Save your favorite botanical treatments and clinical serums by tapping the heart icon on any product card.
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="px-8 py-3.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-xl text-xs uppercase font-bold tracking-widest transition-colors shadow-md"
        >
          Explore Formulations
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#EAE4DC] pb-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Saved Favorites</span>
        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1C1917] mt-1">
          My Wishlist ({wishlist.length} items)
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map(item => (
          <div
            key={item.productId}
            className="bg-white rounded-2xl p-4 border border-[#EAE4DC] hover:border-[#C5A880] hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div 
                className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 cursor-pointer mb-3"
                onClick={() => onProductClick(item.product)}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.product);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white text-stone-600 hover:text-red-500 rounded-full shadow-xs transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E7D58]">
                {item.product.category}
              </span>
              <h3 
                className="text-base font-serif-luxury font-bold text-stone-900 hover:text-[#9E7D58] cursor-pointer transition-colors"
                onClick={() => onProductClick(item.product)}
              >
                {item.product.name}
              </h3>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-base font-bold text-stone-900">
                  ₹{item.product.discountPrice.toLocaleString('en-IN')}
                </span>
                {item.product.originalPrice > item.product.discountPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    ₹{item.product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100">
              <button
                type="button"
                disabled={item.product.stock <= 0}
                onClick={() => handleMoveToCart(item.product)}
                className="w-full py-2.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition-colors disabled:bg-stone-200 disabled:text-stone-400"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Bag</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
