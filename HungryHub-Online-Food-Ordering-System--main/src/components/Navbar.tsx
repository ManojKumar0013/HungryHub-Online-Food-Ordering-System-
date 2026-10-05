import React, { useState } from 'react';
import { UserRole } from '../types';
import { ShoppingBag, Search, MapPin, Moon, Sun, User as UserIcon, Heart, LogOut, ChevronDown, Bell } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
  activeCustomerTab: string;
  setActiveCustomerTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  cartCount,
  onOpenCart,
  onOpenAuth,
  isDarkMode,
  onToggleDarkMode,
  searchQuery,
  onSearchChange,
  selectedLocation,
  onSelectLocation,
  user,
  onLogout,
  activeCustomerTab,
  setActiveCustomerTab,
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const locations = [
    'Hitech City, Hyderabad',
    'Banjara Hills, Hyderabad',
    'Koramangala, Bengaluru',
    'Indiranagar, Bengaluru',
    'Connaught Place, New Delhi',
    'Bandra West, Mumbai',
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-200/60 dark:border-zinc-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveCustomerTab('home')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-[#FF9233] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#FF6B00]/20 group-hover:scale-105 transition-transform">
                H
              </div>
              <div>
                <span className="font-display font-bold text-2xl tracking-tight">
                  <span className="text-zinc-900 dark:text-zinc-100 group-hover:text-[#FF6B00] transition-colors">
                    Hungry
                  </span>
                  <span className="text-[#FF6B00] group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                    Hub
                  </span>
                </span>
              </div>
            </button>

            {/* Navigation Links (Customer View) */}
            {currentRole === 'customer' && (
              <nav className="hidden md:flex items-center gap-1 font-medium text-sm">
                {[
                  { id: 'home', label: 'Browse' },
                  { id: 'restaurants', label: 'Restaurants' },
                  { id: 'offers', label: 'Offers & Coupons' },
                  { id: 'orders', label: 'My Orders' },
                ].map((item) => {
                  const isActive = activeCustomerTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveCustomerTab(item.id)}
                      className={`px-3.5 py-2 rounded-xl transition-all ${
                        isActive
                          ? 'text-[#FF6B00] font-bold bg-[#FF6B00]/10'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Location Picker & Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Location Pill */}
            {currentRole === 'customer' && (
              <button
                onClick={() => setShowLocationModal(true)}
                className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold transition-colors border border-zinc-200 dark:border-zinc-700"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
            </button>

            {/* Cart Button (Customer Role) */}
            {currentRole === 'customer' && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FF6B00] text-white font-semibold text-sm hover:bg-[#e05e00] active:scale-95 transition-all shadow-md shadow-[#FF6B00]/25"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-white text-[#FF6B00] text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile / Auth Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveCustomerTab('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-zinc-400" />
                      Profile & Wallet
                    </button>
                    <button
                      onClick={() => {
                        setActiveCustomerTab('favorites');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      Favorite Food & Places
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2.5 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Location Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Select Delivery Location</h3>
            <p className="text-xs text-zinc-500 mb-4">Choose your neighborhood for accurate delivery times</p>
            <div className="space-y-2 mb-6">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    onSelectLocation(loc);
                    setShowLocationModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-2xl text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedLocation === loc
                      ? 'bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/30 font-bold'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF6B00]" />
                    <span>{loc}</span>
                  </div>
                  {selectedLocation === loc && <span className="text-xs text-[#FF6B00]">Selected</span>}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
