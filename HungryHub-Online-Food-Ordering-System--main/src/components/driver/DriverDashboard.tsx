import React, { useState } from 'react';
import { Order } from '../../types';
import { Bike, Navigation, MapPin, Phone, MessageSquare, CheckCircle, ShieldCheck, DollarSign, Award, Power } from 'lucide-react';

interface DriverDashboardProps {
  orders: Order[];
  onCompleteDeliveryWithOtp: (orderId: string, otp: string) => boolean;
  onOpenChat: (order: Order) => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  orders,
  onCompleteDeliveryWithOtp,
  onOpenChat,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeOrder, setActiveOrder] = useState<Order | null>(
    orders.find((o) => o.status === 'Out for Delivery') || orders[0] || null
  );
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  const completedCount = orders.filter((o) => o.status === 'Delivered').length;
  const todayEarnings = completedCount * 85.0 + 240.0; // Base rate + tips

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (!activeOrder) return;

    const success = onCompleteDeliveryWithOtp(activeOrder.id, otpInput);
    if (success) {
      setActiveOrder(null);
      setOtpInput('');
    } else {
      setOtpError('Invalid OTP! Please ask customer for correct 4-digit code.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Driver Header Banner */}
      <div className="p-6 rounded-[32px] bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <Bike className="w-8 h-8 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl">Delivery Partner App</h1>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isOnline
                    ? 'bg-emerald-400 text-slate-950 shadow-md'
                    : 'bg-rose-500/30 text-rose-200 border border-rose-400/30'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </button>
            </div>
            <p className="text-xs text-emerald-100 mt-1">
              Rider ID: DRV-8821 • Kommineni Yashwanth • Honda Activa EV
            </p>
          </div>
        </div>

        {/* Driver Daily Earnings Metrics */}
        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] font-bold uppercase text-emerald-200">Today's Earnings</span>
            <p className="font-display font-bold text-2xl text-white">₹{todayEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] font-bold uppercase text-emerald-200">Completed</span>
            <p className="font-display font-bold text-2xl text-white">{completedCount}</p>
          </div>
        </div>
      </div>

      {!isOnline ? (
        <div className="py-20 text-center text-zinc-400 space-y-3">
          <Power className="w-16 h-16 mx-auto stroke-1 text-zinc-500" />
          <h3 className="font-display font-bold text-xl text-zinc-700 dark:text-zinc-300">
            You are currently Offline
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Switch your status to ONLINE to start receiving nearby restaurant order delivery assignments.
          </p>
          <button
            onClick={() => setIsOnline(true)}
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-lg"
          >
            Go Online Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Active Delivery Route & Navigation */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100">
                Active Order Navigation
              </h3>
              {activeOrder && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                  Estimated Payout: ₹{(activeOrder.total * 0.15 + 40).toFixed(2)}
                </span>
              )}
            </div>

            {activeOrder ? (
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
                {/* Simulated Rider GPS Map Canvas */}
                <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between">
                  <div className="relative z-10 flex items-center justify-between bg-slate-800/90 text-white p-3 rounded-xl border border-slate-700 text-xs">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>Turn Right in 200m onto Broadway St.</span>
                    </div>
                    <span className="font-bold text-emerald-400">1.2 miles away</span>
                  </div>

                  {/* Visual simulated route canvas */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 200">
                    <path d="M 30,170 C 120,40 280,180 370,30" stroke="#10B981" strokeWidth="8" fill="none" strokeDasharray="10 5" />
                  </svg>

                  <div className="relative z-10 flex items-center justify-between text-white text-xs">
                    <div className="bg-slate-800/90 p-2 rounded-xl border border-slate-700">
                      <p className="text-[10px] text-zinc-400">Pickup:</p>
                      <p className="font-bold">{activeOrder.restaurantName}</p>
                    </div>
                    <div className="bg-slate-800/90 p-2 rounded-xl border border-slate-700 text-right">
                      <p className="text-[10px] text-zinc-400">Dropoff:</p>
                      <p className="font-bold">{activeOrder.customerName}</p>
                    </div>
                  </div>
                </div>

                {/* Pickup & Drop addresses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-[10px] font-bold uppercase text-amber-600">Step 1: Restaurant Pickup</span>
                    <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">{activeOrder.restaurantName}</h5>
                    <p className="text-zinc-500 mt-0.5">RTC X Roads & Hitech City Main Rd, Hyderabad</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-[10px] font-bold uppercase text-emerald-600">Step 2: Customer Dropoff</span>
                    <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">{activeOrder.customerName}</h5>
                    <p className="text-zinc-500 mt-0.5">{activeOrder.deliveryAddress.addressLine}, {activeOrder.deliveryAddress.city}</p>
                  </div>
                </div>

                {/* Customer Contact Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <a
                      href={`tel:${activeOrder.customerPhone}`}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Customer</span>
                    </a>
                    <button
                      onClick={() => onOpenChat(activeOrder)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs hover:bg-zinc-200"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Support Chat</span>
                    </button>
                  </div>
                </div>

                {/* OTP Verification Form for Order Completion */}
                <form onSubmit={handleVerifyOtp} className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                      Verify Delivery OTP with Customer
                    </span>
                    <span className="text-[11px] text-zinc-500">OTP required to mark completed</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 text-center font-mono font-bold text-lg border border-zinc-300 dark:border-zinc-700"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                    >
                      Verify & Deliver
                    </button>
                  </div>

                  {otpError && <p className="text-xs text-rose-600 font-bold">{otpError}</p>}
                </form>
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-zinc-400">
                <Bike className="w-12 h-12 mx-auto stroke-1 mb-2 text-zinc-400" />
                <p className="font-bold text-sm text-zinc-700 dark:text-zinc-300">No active delivery in progress</p>
                <p className="text-xs text-zinc-500">Select an available order request from the list on the right.</p>
              </div>
            )}
          </div>

          {/* Right Column: Available Delivery Requests Queue */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100">
              Available Orders ({orders.filter((o) => o.status !== 'Delivered').length})
            </h3>

            <div className="space-y-4">
              {orders
                .filter((o) => o.status !== 'Delivered')
                .map((ord) => (
                  <div
                    key={ord.id}
                    className={`p-5 rounded-3xl bg-white dark:bg-zinc-900 border transition-all space-y-3 ${
                      activeOrder?.id === ord.id
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-bold text-xs text-[#FF6B00]">{ord.id}</span>
                        <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{ord.restaurantName}</h5>
                      </div>
                      <span className="font-display font-bold text-sm text-emerald-600">
                        +₹{(ord.total * 0.15 + 40).toFixed(2)}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-500 space-y-1">
                      <p>📍 Dropoff: {ord.deliveryAddress.addressLine}</p>
                      <p>📦 {ord.items.length} items (₹{ord.total.toFixed(2)})</p>
                    </div>

                    <button
                      onClick={() => setActiveOrder(ord)}
                      className="w-full py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-600 hover:text-white font-bold text-xs text-zinc-800 dark:text-zinc-200 transition-colors"
                    >
                      {activeOrder?.id === ord.id ? 'Currently Navigating' : 'Accept Delivery Request'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
