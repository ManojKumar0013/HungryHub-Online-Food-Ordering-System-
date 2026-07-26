import React from 'react';
import { Database, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white font-black flex items-center justify-center text-base">
                H
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-zinc-900 dark:text-zinc-100">
                Hungry<span className="text-[#FF6B00]">Hub</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
              Full-Stack Online Food Ordering System connecting food lovers with India's most iconic Biryani hubs & top restaurants with live tracking.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              Explore Platform
            </h5>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Popular Restaurants</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Special Coupons</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Luxe Members</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition-colors">Catering Services</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              System Modules
            </h5>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li><span className="font-semibold text-zinc-700 dark:text-zinc-300">Customer Module</span> (Order & Track)</li>
              <li><span className="font-semibold text-zinc-700 dark:text-zinc-300">Staff Module</span> (Kitchen KDS)</li>
              <li><span className="font-semibold text-zinc-700 dark:text-zinc-300">Delivery Partner</span> (Navigation)</li>
              <li><span className="font-semibold text-zinc-700 dark:text-zinc-300">Administrator</span> (DBMS Analytics)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-400 gap-4">
          <p>© 2026 HungryHub Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
