import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Leaf, 
  Sparkles, 
  ArrowLeft, 
  Truck, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../types';
import { getProducts, isInWishlist, toggleWishlist, addToCart } from '../services/storeService';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onQuickView: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onBack,
  onQuickView,
  onProductClick,
  onShowToast
}) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'benefits' | 'howToUse' | 'description'>('description');

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = Math.round(
    ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
  );

  const images = [product.image, ...(product.additionalImages || [])];

  const handleAddToCart = () => {
    const res = addToCart(product, quantity);
    onShowToast(res.success ? `✓ Added ${quantity} item(s) to your cart` : res.message, res.success ? 'success' : 'error');
  };

  const handleWishlist = () => {
    const res = toggleWishlist(product);
    onShowToast(res.message, res.inWishlist ? 'success' : 'info');
  };

  // Related products from same category
  const allProducts = getProducts();
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.category === product.category && p.status === 1)
    .slice(0, 4);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <button
          onClick={onBack}
          className="flex items-center gap-1 hover:text-stone-900 transition-colors font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="text-stone-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Main Product Hero Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F5F1EB] border border-[#EAE4DC] shadow-sm">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.newLaunch && (
              <span className="absolute top-4 left-4 bg-[#1C1917] text-white text-xs uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-lg shadow-sm">
                New Launch
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img ? 'border-[#9E7D58] shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="uppercase tracking-widest font-bold text-[#9E7D58]">
                {product.category} • SKU: {product.sku}
              </span>
              {isOutOfStock ? (
                <span className="bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-md text-xs">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-md text-xs">
                  Low Stock: Only {product.stock} units left!
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-md text-xs">
                  ✓ In Stock ({product.stock} available)
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1C1917]">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-stone-800">{product.rating}</span>
              <span className="text-xs text-stone-400">({product.reviewsCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4DC] flex items-baseline gap-4">
            <span className="text-3xl font-bold text-[#1C1917]">
              ₹{product.discountPrice.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.discountPrice && (
              <>
                <span className="text-base text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs bg-[#EFE9DF] text-[#9E7D58] font-bold px-2.5 py-1 rounded-md">
                  {discountPercent}% OFF (Save ₹{product.originalPrice - product.discountPrice})
                </span>
              </>
            )}
            <span className="text-[11px] text-stone-400 ml-auto">Inclusive of all taxes</span>
          </div>

          {/* Short description */}
          <p className="text-sm text-stone-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Quantity & Buy Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              
              {/* Quantity Counter */}
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                >
                  -
                </button>
                <span className="px-5 py-3 text-sm font-bold text-stone-900">{quantity}</span>
                <button
                  type="button"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-[#1C1917] hover:bg-[#9E7D58] text-[#FAF8F5] rounded-xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 shadow-md transition-all disabled:bg-stone-300 disabled:text-stone-500"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleWishlist}
                className="p-3.5 border border-stone-300 hover:border-red-400 rounded-xl text-stone-700 hover:text-red-500 bg-white shadow-xs transition-colors"
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-stone-600 border-t border-stone-200">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#9E7D58]" />
              <span>Complimentary shipping over ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#9E7D58]" />
              <span>30-Day Radiant Skin Guarantee</span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section: Description, Ingredients, Benefits, How to Use */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EAE4DC] shadow-xs">
        <div className="flex border-b border-stone-200 gap-8 overflow-x-auto">
          {[
            { id: 'description', label: 'Full Description' },
            { id: 'ingredients', label: 'Ingredients & Actives' },
            { id: 'benefits', label: 'Key Skin Benefits' },
            { id: 'howToUse', label: 'How to Use' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors relative ${
                activeTab === tab.id ? 'text-[#1C1917]' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9E7D58] rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="pt-6 text-sm text-stone-700 leading-relaxed max-w-3xl">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              <p className="text-xs text-stone-500 italic">
                Formulated without parabens, mineral oils, formaldehydes, synthetic fragrances, or silicones. Non-comedogenic and pH balanced.
              </p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE4DC] font-mono text-xs text-stone-800 leading-loose">
                {product.ingredients}
              </div>
              <p className="text-xs text-stone-500">
                Full transparency disclosure. All ingredients are certified cosmetic-grade and dermatologically tested.
              </p>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-3">
              <p>{product.benefits}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="p-3 bg-stone-50 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-stone-800">Barrier restoration in 72 hours</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-stone-800">Soothes reactivity and redness</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'howToUse' && (
            <div className="space-y-4">
              <p>{product.howToUse}</p>
              <div className="p-4 bg-[#F5F1EB] rounded-xl text-xs text-[#9E7D58] font-medium">
                Pro Tip: For enhanced absorption, apply immediately after cleansing while skin is still slightly damp. Always pair daytime rituals with SPF 50+.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="border-b border-[#EAE4DC] pb-4">
            <span className="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Complete The Ritual</span>
            <h3 className="text-2xl font-serif-luxury font-bold text-[#1C1917] mt-1">
              Related Formulations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard
                key={rel.id}
                product={rel}
                onQuickView={onQuickView}
                onProductClick={onProductClick}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
