import React, { useState } from 'react';
import { Order } from '../../types';
import { PackageCheck, Clock, MapPin, Truck, RotateCcw, ChevronRight, Phone, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  selectedLocation: string;
  onOpenOrderTracking: (order: Order) => void;
  onReorder: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  selectedLocation,
  onOpenOrderTracking,
  onReorder,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const activeOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const pastOrders = orders.filter((o) => o.status === 'Delivered' || o.status === 'Cancelled');

  const displayOrders = filter === 'active' ? activeOrders : filter === 'completed' ? pastOrders : orders;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] font-bold text-xs border border-[#FF6B00]/30 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Delivering to: {selectedLocation}</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl">My Food Orders</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Track active live deliveries in real-time or reorder your favorite meals in 1-click.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
          <div className="p-2.5 rounded-xl bg-[#FF6B00] text-white">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-300 block">Total Orders</span>
            <span className="font-display font-bold text-lg text-white">{orders.length} Placed</span>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        {[
          { id: 'all', label: `All Orders (${orders.length})` },
          { id: 'active', label: `Active Deliveries (${activeOrders.length})` },
          { id: 'completed', label: `Completed (${pastOrders.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              filter === tab.id
                ? 'bg-[#FF6B00] text-white shadow-md'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {displayOrders.length > 0 ? (
        <div className="space-y-6">
          {displayOrders.map((ord) => {
            const isActive = ord.status !== 'Delivered' && ord.status !== 'Cancelled';

            return (
              <div
                key={ord.id}
                className={`p-6 rounded-3xl bg-white dark:bg-black border transition-all shadow-md ${
                  isActive
                    ? 'border-[#FF6B00] ring-2 ring-[#FF6B00]/20'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] font-black text-sm">
                      {ord.restaurantName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
                        {ord.restaurantName}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Order #{ord.id} • {ord.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {ord.status}
                    </span>

                    <span className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
                      ₹{ord.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items & Delivery Address */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
                  {/* Items List */}
                  <div className="lg:col-span-2 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Ordered Items
                    </span>
                    <div className="space-y-1.5">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold flex items-center justify-center text-[10px]">
                              {item.quantity}x
                            </span>
                            <span>{item.food.name}</span>
                            {item.selectedVariant && (
                              <span className="text-[10px] text-zinc-400">({item.selectedVariant.name})</span>
                            )}
                          </span>
                          <span className="font-bold">₹{item.itemTotal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address & Agent */}
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF6B00]" /> Delivery Address
                      </span>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                        {ord.deliveryAddress.addressLine}, {selectedLocation}
                      </p>
                    </div>

                    {isActive && (
                      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase">Delivery OTP</span>
                          <p className="text-sm font-mono font-bold text-[#FF6B00]">{ord.otp || '4829'}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase">Agent</span>
                          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{ord.driverName || 'Alex Rivera'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action buttons */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span>Estimated time: {ord.estimatedDeliveryTime || '25 mins'}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {isActive ? (
                      <button
                        onClick={() => onOpenOrderTracking(ord)}
                        className="px-5 py-2.5 rounded-2xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Live GPS Order Map</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onReorder(ord)}
                        className="px-5 py-2.5 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold text-xs shadow-md flex items-center gap-2 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder Same Meal</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <p className="text-zinc-500 text-sm font-medium">No orders found for this filter in {selectedLocation}.</p>
        </div>
      )}
    </div>
  );
};
