import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  HeartHandshake, 
  CreditCard, 
  Star, 
  ChevronRight,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../types';
import { getNewlyLaunchedProducts, getProducts } from '../services/storeService';
import { ProductCard } from '../components/ProductCard';
import { INITIAL_REVIEWS } from '../data/initialData';

interface HomePageProps {
  onNavigate: (view: string, data?: any) => void;
  onQuickView: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onQuickView,
  onProductClick,
  onShowToast
}) => {
  const [newLaunches, setNewLaunches] = useState<Product[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Dynamic query from database/store where new_launch = 1 AND status = 1, sorted by createdAt DESC
    const launches = getNewlyLaunchedProducts();
    if (launches.length > 0) {
      setNewLaunches(launches);
    } else {
      // Fallback to latest active products if none flagged
      setNewLaunches(getProducts().filter(p => p.status === 1).slice(0, 3));
    }
  }, []);

  const categories = [
    {
      name: 'Serums',
      category: 'Serum',
      description: 'Potent active concentrates',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Cleansers',
      category: 'Cleanser',
      description: 'Pure, non-stripping washes',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Moisturizers',
      category: 'Moisturizer',
      description: 'Barrier-replenishing cushions',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Sun Care',
      category: 'Sun Care',
      description: 'Invisible SPF 50+ defense',
      image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Face Care',
      category: 'Face Care',
      description: 'Balancing daily rituals',
      image: 'https://images.unsplash.com/photo-1608248597359-00994f38a531?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      onShowToast('✓ Welcome to LUMÉRA Skin! Coupon LUMERA10 unlocked.', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F1EB] to-[#FAF8F5] py-16 sm:py-24 border-b border-[#EAE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFE9DF] border border-[#C5A880]/30 text-[#9E7D58] text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pure Care. Visible Glow.</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-[#1C1917] leading-[1.15]">
                Your Skin <br className="hidden sm:block" />
                <span className="italic font-normal text-[#9E7D58]">Deserves</span> Better.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover clean, effective skincare designed for healthy-looking, radiant skin. Dermatologist-tested formulas backed by botanical actives and clinical integrity.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => onNavigate('products')}
                  className="w-full sm:w-auto px-8 py-4 bg-[#1C1917] hover:bg-[#9E7D58] text-[#FAF8F5] rounded-xl text-xs font-bold uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('about')}
                  className="w-full sm:w-auto px-8 py-4 bg-white/80 hover:bg-white text-stone-800 border border-stone-300 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xs transition-colors"
                >
                  Explore Collection
                </button>
              </div>

              {/* Mini Social Proof */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-stone-500">
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Customer" />
                </div>
                <div>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-medium text-stone-700">4.9/5 from 1,200+ radiant customers</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative border backdrop */}
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#C5A880]/30 to-[#FAF8F5] transform rotate-1"></div>
                
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-[#EAE4DC]">
                  <img
                    src="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1000&q=80"
                    alt="LUMÉRA Pure Botanical Skincare Ritual"
                    className="w-full h-[460px] object-cover object-center"
                  />
                  
                  {/* Floating Highlight Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E7D58]">Clinical Highlight</span>
                      <h4 className="text-sm font-serif-luxury font-bold text-stone-900">Hydra Glow Face Serum</h4>
                      <p className="text-xs text-stone-500">Multi-molecular Hyaluronic + Niacinamide</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-stone-900">₹699</span>
                      <span className="block text-[10px] text-emerald-600 font-bold">New Launch</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. NEWLY LAUNCHED PRODUCTS (Mandatory dynamic query: new_launch = 1, status = 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#EAE4DC]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#9E7D58] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Formulations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1C1917]">
              Newly Launched Products
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Our newest clinical innovations, updated live from our laboratory database.
            </p>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-stone-900 hover:text-[#9E7D58] transition-colors group"
          >
            <span>View All Products ({getProducts().length})</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newLaunches.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onProductClick={onProductClick}
              onShowToast={onShowToast}
            />
          ))}
        </div>

        {/* View All button below grid */}
        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('products')}
            className="px-8 py-3.5 bg-white border border-[#C5A880] text-stone-900 hover:bg-[#1C1917] hover:text-white rounded-xl text-xs uppercase font-bold tracking-widest transition-all shadow-xs"
          >
            View All Products
          </button>
        </div>
      </section>

      {/* 3. WHY CHOOSE US (4 Feature Cards) */}
      <section className="bg-[#F5F1EB] py-16 border-y border-[#EAE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-[#9E7D58]">The LUMÉRA Standard</span>
            <h2 className="text-3xl font-serif-luxury font-bold text-[#1C1917] mt-1">
              Why Choose LUMÉRA SKIN
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Uncompromising formulation integrity crafted to honor your skin’s natural rhythm and barrier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAE4DC] flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F1EB] text-[#9E7D58] flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900 mb-2">
                Dermatologically Tested
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Rigorously patch-tested on sensitive skin types to ensure maximum safety, zero sensitization, and optimal bio-tolerance.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAE4DC] flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F1EB] text-[#9E7D58] flex items-center justify-center mb-4">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900 mb-2">
                Clean Ingredients
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                100% free from harsh sulfates, synthetic dyes, artificial fragrances, parabens, and micro-plastics.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAE4DC] flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F1EB] text-[#9E7D58] flex items-center justify-center mb-4">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900 mb-2">
                Cruelty Free
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Ethically produced and PETA certified. We believe true beauty never comes at the cost of innocent animal testing.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAE4DC] flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F1EB] text-[#9E7D58] flex items-center justify-center mb-4">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900 mb-2">
                Secure Payments
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                256-bit bank encrypted online checkout, UPI, Net Banking, plus safe Cash on Delivery available nationwide.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SKINCARE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-[#9E7D58]">Targeted Solutions</span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1C1917] mt-1">
            Shop By Skincare Category
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Build your personalized regimen tailored to your unique skin concerns.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('products', { category: cat.category })}
              className="group cursor-pointer bg-white rounded-2xl p-3 border border-[#EAE4DC] hover:border-[#C5A880] hover:shadow-lg transition-all text-center flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-[#F5F1EB]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-serif-luxury font-bold text-stone-900 group-hover:text-[#9E7D58] transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CUSTOMER REVIEWS */}
      <section className="bg-white py-16 border-y border-[#EAE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-[#9E7D58]">Real Skin Transformations</span>
            <h2 className="text-3xl font-serif-luxury font-bold text-[#1C1917] mt-1">
              Loved By Radiant Skin Seekers
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Discover authentic reviews from verified purchasers who made LUMÉRA their daily ritual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_REVIEWS.map(rev => (
              <div
                key={rev.id}
                className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#EAE4DC] flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                    "{rev.review}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-10 h-10 rounded-full object-cover border border-stone-300"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{rev.name}</h4>
                      <p className="text-[10px] text-emerald-700 font-semibold">Verified Buyer • {rev.date}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#EFE9DF] text-[#9E7D58] px-2 py-1 rounded font-medium">
                    {rev.productName.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER PROMO */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1917] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-stone-800">
          <div className="relative z-10 max-w-xl mx-auto text-center space-y-4">
            <span className="inline-block text-xs uppercase font-bold tracking-[0.25em] text-[#C5A880]">
              Exclusive Welcome Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold">
              Get 10% OFF Your First Order
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Subscribe to the LUMÉRA newsletter for VIP skincare drops, personalized routine tips, and your instant 10% welcome coupon.
            </p>

            {subscribed ? (
              <div className="p-4 bg-stone-800 rounded-2xl text-xs text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>You're subscribed! Use promo code <strong className="text-white text-sm tracking-wider">LUMERA10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-11 pr-4 py-3 bg-stone-800/80 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-400 outline-none focus:border-[#C5A880]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#C5A880] hover:bg-[#d6be9a] text-[#1C1917] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
                >
                  Claim 10% Off
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
