import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { getProducts } from '../services/storeService';
import { ProductCard } from '../components/ProductCard';

interface ProductsPageProps {
  initialCategory?: string;
  onQuickView: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  initialCategory,
  onQuickView,
  onProductClick,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const categories = ['All', 'Serum', 'Cleanser', 'Moisturizer', 'Sun Care', 'Face Care'];

  const allProducts = getProducts();

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      // Status check
      if (p.status !== 1) return false;

      // Category check
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Search check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.ingredients.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Price check
      if (p.discountPrice > maxPrice) {
        return false;
      }

      // Stock check
      if (onlyInStock && p.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'price-asc') {
        return a.discountPrice - b.discountPrice;
      }
      if (sortBy === 'price-desc') {
        return b.discountPrice - a.discountPrice;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // 'featured' default: featured products first, then new launches, then by id
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return b.id - a.id;
    });
  }, [allProducts, selectedCategory, searchQuery, maxPrice, sortBy, onlyInStock]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(1200);
    setSortBy('featured');
    setOnlyInStock(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="bg-[#F5F1EB] rounded-3xl p-8 sm:p-12 border border-[#EAE4DC] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">
            The Botanical Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1C1917] mt-1">
            All Skincare Formulations
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl">
            Explore clinically backed, biocompatible skincare essentials crafted to purify, nourish, and visibly illuminate.
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="text-3xl font-serif-luxury font-bold text-stone-900">
            {filteredProducts.length}
          </span>
          <span className="block text-xs uppercase tracking-wider text-stone-500">
            Products Found
          </span>
        </div>
      </div>

      {/* Control Bar: Search & Category Chips */}
      <div className="space-y-4">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs uppercase font-bold tracking-wider whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#1C1917] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                }`}
              >
                {cat === 'All' ? 'All Formulations' : cat}
              </button>
            );
          })}
        </div>

        {/* Search, Price & Sort Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EAE4DC] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, ingredient, SKU..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-[#9E7D58] focus:bg-white transition-all text-stone-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Price Range Slider */}
          <div className="md:col-span-4 px-2">
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
              <span>Max Price:</span>
              <span className="font-bold text-stone-900">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="400"
              max="1200"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#9E7D58] cursor-pointer"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2">
            <div className="flex-1 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 outline-none focus:border-[#9E7D58] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {(selectedCategory !== 'All' || searchQuery || maxPrice < 1200 || sortBy !== 'featured') && (
              <button
                onClick={resetFilters}
                className="p-2.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Products Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#EAE4DC] p-8">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] text-stone-400 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif-luxury font-bold text-stone-800">
            No Skincare Formulations Found
          </h3>
          <p className="text-xs text-stone-500 mt-2 max-w-md mx-auto">
            We couldn't find any products matching your selected search criteria. Try adjusting your filters or price slider.
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 px-6 py-2.5 bg-[#1C1917] text-white rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-[#9E7D58] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onProductClick={onProductClick}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      )}

    </div>
  );
};
