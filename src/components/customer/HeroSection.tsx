import React from 'react';
import { Search, MapPin, Sparkles, Mic, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLocation: string;
  onFindFood: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedLocation,
  onFindFood,
}) => {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-6">
      <div className="relative h-[480px] sm:h-[520px] rounded-[32px] overflow-hidden shadow-2xl border border-white/20">
        {/* Background Food Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-semibold mb-4 border border-white/20 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Authentic Biryani & Express 30-Min Delivery</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.15] mb-4">
            India's Favorite <br />
            <span className="text-[#FF6B00] drop-shadow-md">Hyderabadi Biryani.</span>
          </h1>

          <p className="text-zinc-200 text-base sm:text-lg mb-8 max-w-xl font-normal leading-relaxed">
            Experience India's most loved Dum Biryanis from iconic restaurants like Bawarchi, Paradise, Meghana & Pista House delivered fresh to your doorstep.
          </p>

          {/* Search Bar Bar Container */}
          <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-2 rounded-2xl sm:rounded-full shadow-2xl border border-white/30 flex flex-col sm:flex-row items-center gap-2 max-w-2xl">
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 w-full">
              <Search className="w-5 h-5 text-[#FF6B00] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search for Biryani, Butter Chicken, Tandoori, Kebabs..."
                className="w-full bg-transparent border-none focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => onSearchChange('Truffle')}
                title="Voice Search Simulation"
                className="p-1.5 text-zinc-400 hover:text-[#FF6B00] transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 border-l border-zinc-200 dark:border-zinc-700 min-w-[170px] text-zinc-600 dark:text-zinc-300 text-xs font-semibold">
              <MapPin className="w-4 h-4 text-[#FF6B00] shrink-0" />
              <span className="truncate">{selectedLocation}</span>
            </div>

            <button
              onClick={onFindFood}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl sm:rounded-full bg-[#FF6B00] hover:bg-[#e05e00] text-white font-semibold text-sm shadow-lg shadow-[#FF6B00]/30 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <span>Explore Food</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-zinc-300 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>35+ Partner Kitchens</span>
            </div>
            <div>•</div>
            <div>25 Min Avg Delivery</div>
            <div>•</div>
            <div>4.9★ Customer Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};
