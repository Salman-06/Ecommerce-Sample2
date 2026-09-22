import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { getProducts } from '../services/storeService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setResults(getProducts().slice(0, 4));
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleSearch = (text: string) => {
    setQuery(text);
    const all = getProducts();
    if (!text.trim()) {
      setResults(all.slice(0, 4));
      return;
    }
    const filtered = all.filter(p => 
      p.name.toLowerCase().includes(text.toLowerCase()) ||
      p.category.toLowerCase().includes(text.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(text.toLowerCase())
    );
    setResults(filtered);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search serums, cleansers, moisturizers, SPF..."
            className="w-full text-base sm:text-lg outline-none bg-transparent placeholder-stone-400 text-stone-800"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Skincare Essentials'}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-sm">
              No products found matching "{query}". Try searching for "Serum", "Cleanser", or "Hydration".
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="py-3 flex items-center justify-between hover:bg-[#FAF8F5] px-3 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-stone-100"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">{product.name}</h4>
                      <p className="text-xs text-stone-500">{product.category} • ₹{product.discountPrice}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
