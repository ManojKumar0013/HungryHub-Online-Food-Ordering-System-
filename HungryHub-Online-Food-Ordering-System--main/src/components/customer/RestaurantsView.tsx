import React, { useState } from 'react';
import { Restaurant } from '../../types';
import { RestaurantCard } from './RestaurantCard';
import { MapPin, Search, Sparkles, Filter, Flame, Star, Truck } from 'lucide-react';

interface RestaurantsViewProps {
  restaurants: Restaurant[];
  selectedLocation: string;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const RestaurantsView: React.FC<RestaurantsViewProps> = ({
  restaurants,
  selectedLocation,
  onSelectRestaurant,
  favorites,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'top' | 'free' | 'biryani'>('all');

  const filtered = restaurants.filter((r) => {
    const matchesQuery =
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.cuisine.some((c) => c.toLowerCase().includes(query.toLowerCase())) ||
      r.address.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;

    if (filterType === 'top') return r.rating >= 4.8;
    if (filterType === 'free') return r.isFreeDelivery;
    if (filterType === 'biryani') return r.cuisine.some((c) => c.toLowerCase().includes('biryani'));
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-zinc-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] font-bold text-xs border border-[#FF6B00]/30">
            <MapPin className="w-3.5 h-3.5" />
            <span>Active Area: {selectedLocation}</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            Top Restaurants in <span className="text-[#FF6B00]">{selectedLocation.split(',')[0]}</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Discover iconic Biryani hubs, tandoori grills, and local food places delivering hot & fresh in your neighborhood.
          </p>
        </div>

        {/* Quick Search */}
        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search restaurants in ${selectedLocation.split(',')[0]}...`}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-800/90 text-white placeholder-zinc-400 text-xs font-medium border border-zinc-700 focus:outline-none focus:border-[#FF6B00]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
          {[
            { id: 'all', label: 'All Places', icon: <Filter className="w-3.5 h-3.5" /> },
            { id: 'biryani', label: 'Biryani Specials', icon: <Flame className="w-3.5 h-3.5 text-amber-500" /> },
            { id: 'top', label: 'Top Rated 4.8+ ★', icon: <Star className="w-3.5 h-3.5 text-amber-400" /> },
            { id: 'free', label: 'Free Delivery', icon: <Truck className="w-3.5 h-3.5 text-emerald-500" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                filterType === tab.id
                  ? 'bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/25'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <span className="text-xs text-zinc-500 font-medium">
          Showing <strong className="text-zinc-900 dark:text-zinc-100">{filtered.length}</strong> restaurants nearby
        </span>
      </div>

      {/* Restaurant Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((rest) => (
            <RestaurantCard
              key={rest.id}
              restaurant={rest}
              onClick={() => onSelectRestaurant(rest)}
              isFavorite={favorites.includes(rest.id)}
              onToggleFavorite={(e) => {
                e.stopPropagation();
                onToggleFavorite(rest.id);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-black rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <p className="text-zinc-500 text-sm font-medium">
            No restaurants found matching "{query}" in {selectedLocation}.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setFilterType('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#FF6B00] text-white font-bold text-xs"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
