import React from 'react';
import { Leaf, ShieldCheck, Sparkles, Heart, Recycle, Award, CheckCircle } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="pb-20 space-y-20">
      
      {/* Hero Header */}
      <section className="bg-[#F5F1EB] py-16 sm:py-20 border-b border-[#EAE4DC] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#9E7D58]">
            About LUMÉRA SKIN
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif-luxury font-bold text-[#1C1917] mt-2">
            Pure Care. Visible Glow.
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            Rooted in thoughtful botanical botany and validated by dermatological science. We engineer skincare rituals that elevate everyday well-being.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-[#EAE4DC] bg-white">
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80"
                alt="LUMÉRA laboratory and botanical skincare"
                className="w-full h-[450px] object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-[#9E7D58]">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1C1917]">
              Born From a Desire for Honest, Non-Toxic Radiance
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              LUMÉRA SKIN was founded on a simple truth: skincare should never be a trade-off between clinical potency and clean safety. Tired of 12-step routines loaded with sensitizing fragrances and fillers, our cosmetic chemists set out to curate a focused capsule collection of high-impact essentials.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              Every formula at LUMÉRA starts with biocompatible plant extracts, fortified with gold-standard actives like multi-molecular Hyaluronic Acid, stable Vitamin C, bio-identical Ceramides, and broad-spectrum UV shields. The result is pure care you can feel, and a visible glow you can trust.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => onNavigate('products')}
                className="px-6 py-3 bg-[#1C1917] text-white hover:bg-[#9E7D58] rounded-xl text-xs uppercase font-bold tracking-widest transition-colors"
              >
                Discover Our Formulations
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy (4 Pillars) */}
      <section className="bg-[#FAF8F5] py-16 border-y border-[#EAE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-[#9E7D58]">Guiding Principles</span>
            <h2 className="text-3xl font-serif-luxury font-bold text-[#1C1917] mt-1">
              Our Formulation Philosophy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#EAE4DC] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F5F1EB] text-[#9E7D58] flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900 mb-2">Clean Skincare</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Zero harmful chemicals. We exclude over 1,500 questionable ingredients, adhering strictly to global EU clean cosmetic safety benchmarks.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EAE4DC] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F5F1EB] text-[#9E7D58] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900 mb-2">Simple Routines</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Intentional minimalism. Replace 10 complicated jars with 3 synergistic steps: Cleanse gently, Nourish deeply, and Shield completely.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EAE4DC] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F5F1EB] text-[#9E7D58] flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900 mb-2">Quality Ingredients</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sourced from ethical cultivators and clinical labs with certificates of analysis, ensuring maximum active purity and freshness.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EAE4DC] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F5F1EB] text-[#9E7D58] flex items-center justify-center mb-4">
                <Recycle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900 mb-2">Sustainable Packaging</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Amber glass droppers, recyclable pumps, soy-based inks, and FSC-certified cartons that minimize ecological footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Why LUMÉRA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-[#9E7D58]">Our Mission</span>
            <h2 className="text-3xl font-serif-luxury font-bold text-[#1C1917]">
              Democratizing Premium, Evidence-Based Skincare
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Our mission is to empower individuals to feel confident and comfortable in their own natural skin. We believe radiant skin is not about masking flaws or chasing impossible ideals, but nurturing a healthy, hydrated, and resilient barrier that lasts a lifetime.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#9E7D58] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Radical Transparency</h4>
                  <p className="text-xs text-stone-500">Every active concentration and ingredient is clearly disclosed on our packaging.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#9E7D58] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Skin Barrier First</h4>
                  <p className="text-xs text-stone-500">All products are formulated at optimal pH levels (5.0 - 5.8) to protect microbiome health.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#9E7D58] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">100% Satisfaction Guarantee</h4>
                  <p className="text-xs text-stone-500">30-day glow guarantee with responsive concierge support on all orders.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-[#EAE4DC]">
              <img
                src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80"
                alt="Skincare Texture and Cream"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
