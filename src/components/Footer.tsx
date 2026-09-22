import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Heart, Leaf, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, data?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1C1917] text-[#FAF8F5] pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#292524] flex items-center justify-center text-[#C5A880]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#FAF8F5]">Dermatologist Tested</h4>
              <p className="text-[11px] text-stone-400">Hypoallergenic & barrier safe</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#292524] flex items-center justify-center text-[#C5A880]">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#FAF8F5]">Clean Formulations</h4>
              <p className="text-[11px] text-stone-400">Zero parabens & phthalates</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#292524] flex items-center justify-center text-[#C5A880]">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#FAF8F5]">100% Cruelty Free</h4>
              <p className="text-[11px] text-stone-400">Never tested on animals</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#292524] flex items-center justify-center text-[#C5A880]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#FAF8F5]">Visible Glow</h4>
              <p className="text-[11px] text-stone-400">Clinically active ingredients</p>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-stone-800">
          
          {/* Col 1 & 2: Brand Story */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-2xl font-serif-luxury font-bold tracking-[0.2em] text-[#FAF8F5] uppercase">
              LUMÉRA SKIN
            </span>
            <p className="text-xs text-[#C5A880] uppercase tracking-[0.25em] font-semibold">
              Pure Care. Visible Glow.
            </p>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Formulated at the intersection of conscious botanical botanicals and proven dermatological actives. Designed to nurture skin resilience, enhance hydration, and unlock lasting radiance.
            </p>
            <div className="pt-2 text-xs text-stone-400">
              <p>Customer Care: <span className="text-stone-300">+91 1800-419-LUMERA</span></p>
              <p>Direct Inquiries: <span className="text-stone-300">care@lumeraskin.com</span></p>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#C5A880] mb-4">
              Explore Store
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Our Story & Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cart')} className="hover:text-white transition-colors">
                  Shopping Cart
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-white transition-colors">
                  My Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Categories */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#C5A880] mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('products', { category: 'Serum' })} className="hover:text-white transition-colors">
                  Active Serums
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'Cleanser' })} className="hover:text-white transition-colors">
                  Gentle Cleansers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'Moisturizer' })} className="hover:text-white transition-colors">
                  Barrier Moisturizers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'Sun Care' })} className="hover:text-white transition-colors">
                  SPF 50+ Sun Care
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', { category: 'Face Care' })} className="hover:text-white transition-colors">
                  Face Care Essentials
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#C5A880] mb-4">
              Join The Glow Circle
            </h4>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Subscribe to receive private sale access, skincare routine guides, and <strong>10% OFF</strong> your first order.
            </p>

            {subscribed ? (
              <div className="p-3 bg-stone-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>You're on the list! Use code <strong>LUMERA10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#292524] border border-stone-700 text-xs text-stone-200 placeholder-stone-500 rounded-xl outline-none focus:border-[#C5A880]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#C5A880] hover:bg-[#d6be9a] text-[#1C1917] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin Portal Shortcut */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} LUMÉRA SKIN. All rights reserved. Registered Trademark.</p>
          
          <div className="flex items-center gap-6">
            <span className="text-stone-400">256-Bit SSL Encrypted Checkout</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-[#C5A880] hover:underline font-medium flex items-center gap-1 text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
