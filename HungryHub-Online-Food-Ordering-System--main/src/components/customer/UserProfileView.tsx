import React, { useState } from 'react';
import { UserProfile, Order, Address } from '../../types';
import { User, Wallet, MapPin, CreditCard, History, Heart, ShieldCheck, Plus, Trash2, Clock, CheckCircle, ArrowRight, RotateCcw, ShoppingBag, PackageCheck } from 'lucide-react';

interface UserProfileViewProps {
  user: UserProfile;
  orders: Order[];
  onOpenOrderTracking: (order: Order) => void;
  favoritesList: string[];
  onReorder?: (order: Order) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  orders,
  onOpenOrderTracking,
  favoritesList,
  onReorder,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'past' | 'wallet' | 'addresses'>('past');
  const [walletAmount, setWalletAmount] = useState(user.walletBalance);
  const [addMoneyInput, setAddMoneyInput] = useState('250');

  const activeOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const pastOrders = orders.filter((o) => o.status === 'Delivered' || o.status === 'Cancelled');

  const handleAddWalletMoney = () => {
    const val = parseFloat(addMoneyInput);
    if (!isNaN(val) && val > 0) {
      setWalletAmount((prev) => prev + val);
      setAddMoneyInput('250');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Card Header */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-amber-500 text-white font-black text-2xl flex items-center justify-center border-2 border-white/20 shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-2xl">{user.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase">
                Pro Member
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">{user.email} • {user.phone}</p>
          </div>
        </div>

        {/* Wallet Pill */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 shrink-0">
          <div className="p-2.5 rounded-xl bg-[#FF6B00] text-white">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider">HungryWallet</span>
            <p className="font-display font-bold text-xl text-white">₹{walletAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-6 text-sm font-bold overflow-x-auto hide-scrollbar">
        {[
          { id: 'past', label: `Past Orders (${pastOrders.length})`, icon: <PackageCheck className="w-4 h-4 text-[#FF6B00]" /> },
          { id: 'active', label: `Active Orders (${activeOrders.length})`, icon: <History className="w-4 h-4" /> },
          { id: 'wallet', label: 'Wallet & Cashbacks', icon: <Wallet className="w-4 h-4" /> },
          { id: 'addresses', label: 'Saved Addresses', icon: <MapPin className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3.5 border-b-2 flex items-center gap-2 transition-all shrink-0 ${
              activeTab === tab.id
                ? 'border-[#FF6B00] text-[#FF6B00]'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Past Orders */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">Past & Completed Orders</h3>
              <p className="text-xs text-zinc-500">Reorder your favorite meals with 1-click or download receipts</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              {pastOrders.length} Completed
            </span>
          </div>

          {pastOrders.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <PackageCheck className="w-12 h-12 mx-auto stroke-1 mb-2 text-zinc-400" />
              <p className="font-bold text-sm">No past orders found</p>
              <p className="text-xs text-zinc-500 mt-1">Place an order to see it in your completed order history.</p>
            </div>
          ) : (
            pastOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 soft-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs text-[#FF6B00] bg-[#FF6B00]/10 px-2.5 py-0.5 rounded-md">
                      {ord.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {ord.status}
                    </span>
                    <span className="text-[11px] text-zinc-400">• {ord.createdAt}</span>
                  </div>

                  <h4 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    {ord.restaurantName}
                  </h4>

                  {/* Items summary pill */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {ord.items.map((item) => (
                      <span
                        key={item.id}
                        className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1 rounded-xl font-medium flex items-center gap-1"
                      >
                        <span className="font-bold text-[#FF6B00]">{item.quantity}x</span>
                        <span>{item.food.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-zinc-100 dark:border-zinc-800">
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Total Paid</p>
                    <p className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">₹{ord.total.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenOrderTracking(ord)}
                      className="px-3.5 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs transition-colors"
                    >
                      Receipt
                    </button>

                    {onReorder && (
                      <button
                        onClick={() => onReorder(ord)}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#e05e00] text-white font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#FF6B00]/25 flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Active Orders */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeOrders.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <History className="w-12 h-12 mx-auto stroke-1 mb-2" />
              <p className="font-bold text-sm">No active orders right now</p>
            </div>
          ) : (
            activeOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 soft-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#FF6B00]">{ord.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase">
                      {ord.status}
                    </span>
                    <span className="text-[11px] text-zinc-400">• {ord.createdAt}</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100">
                    {ord.restaurantName}
                  </h4>
                  <p className="text-xs text-zinc-500">
                    {ord.items.map((i) => `${i.quantity}x ${i.food.name}`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">Total Paid</p>
                    <p className="font-display font-bold text-base text-[#FF6B00]">₹{ord.total.toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => onOpenOrderTracking(ord)}
                    className="px-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-[#FF6B00] hover:text-white text-zinc-800 dark:text-zinc-200 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Wallet */}
      {activeTab === 'wallet' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-6 max-w-md">
          <div>
            <h4 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">Recharge HungryWallet</h4>
            <p className="text-xs text-zinc-500">Get instant 1-click checkout with zero payment failures</p>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={addMoneyInput}
              onChange={(e) => setAddMoneyInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-sm font-bold border-none focus:ring-2 focus:ring-[#FF6B00]"
              placeholder="Enter amount (₹)"
            />
            <button
              onClick={handleAddWalletMoney}
              className="px-6 py-3 rounded-2xl bg-[#FF6B00] text-white font-bold text-xs hover:bg-[#e05e00]"
            >
              Add Money
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            💡 Pro Tip: Recharge ₹500 or more and get 10% instant cashback added to your wallet!
          </div>
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{addr.title}</span>
                {addr.isDefault && (
                  <span className="text-[10px] font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">{addr.addressLine}</p>
              <p className="text-xs text-zinc-400">{addr.city}, {addr.zipCode}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
