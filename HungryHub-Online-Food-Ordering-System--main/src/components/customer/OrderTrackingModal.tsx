import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { X, CheckCircle2, Clock, Phone, MessageSquare, MapPin, Bike, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenChat: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  onOpenChat,
}) => {
  if (!order) return null;

  const stages: OrderStatus[] = ['Placed', 'Preparing', 'Cooking', 'Packed', 'Out for Delivery', 'Delivered'];
  const currentStageIndex = stages.indexOf(order.status);

  // Simulated rider map progress
  const [riderProgress, setRiderProgress] = useState(65);

  useEffect(() => {
    if (order.status === 'Out for Delivery') {
      const interval = setInterval(() => {
        setRiderProgress((prev) => (prev >= 95 ? 20 : prev + 2));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [order.status]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6">
        {/* Top Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#FF6B00]">{order.id}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase">
                Live Tracking Active
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">Estimated Arrival: <strong className="text-zinc-800 dark:text-zinc-200">{order.estimatedDeliveryTime}</strong></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Simulated Map Canvas */}
          <div className="relative h-52 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner flex flex-col justify-between p-4">
            {/* Map Roads Vector background */}
            <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 400 200">
              <path d="M 10,100 Q 150,20 280,110 T 390,160" stroke="#FF6B00" strokeWidth="6" fill="none" strokeDasharray="8 4" />
              <path d="M 50,20 Q 120,180 350,80" stroke="#38BDF8" strokeWidth="4" fill="none" />
              <circle cx="50" cy="20" r="6" fill="#38BDF8" />
              <circle cx="350" cy="80" r="6" fill="#10B981" />
            </svg>

            {/* Restaurant Marker */}
            <div className="relative z-10 flex items-center gap-2 bg-slate-800/90 text-white px-3 py-1.5 rounded-xl border border-slate-700 w-fit text-xs font-semibold">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{order.restaurantName}</span>
            </div>

            {/* Simulated Animated Rider Pin */}
            <div
              className="absolute z-20 transition-all duration-1000 ease-out flex items-center gap-1.5 bg-[#FF6B00] text-white px-3 py-1.5 rounded-full shadow-lg border-2 border-white text-xs font-bold"
              style={{
                left: `${riderProgress}%`,
                top: `${40 + Math.sin(riderProgress / 10) * 15}%`,
              }}
            >
              <Bike className="w-4 h-4 animate-bounce" />
              <span>Rider En Route</span>
            </div>

            {/* Destination Customer Marker */}
            <div className="relative z-10 self-end flex items-center gap-2 bg-slate-800/90 text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{order.deliveryAddress.title} ({order.deliveryAddress.zipCode})</span>
            </div>
          </div>

          {/* Timeline Stages */}
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Order Progress Timeline</h4>
            <div className="relative flex items-center justify-between">
              {/* Connecting Bar */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-[#FF6B00] -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
              />

              {stages.map((stg, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div key={stg} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? 'bg-[#FF6B00] text-white ring-4 ring-[#FF6B00]/20'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                      } ${isCurrent ? 'scale-125' : ''}`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`mt-2 text-[10px] font-bold text-center max-w-[65px] ${
                        isPassed ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'
                      }`}
                    >
                      {stg}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Partner Details Card */}
          {order.driverName && (
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={order.driverAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'}
                  alt={order.driverName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-[#FF6B00]"
                />
                <div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{order.driverName}</h5>
                  <p className="text-xs text-zinc-500">Delivery Partner • Honda Activa EV</p>
                  <p className="text-[11px] font-mono text-[#FF6B00] font-bold mt-0.5">
                    Delivery OTP: <span className="bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400">{order.otp || '4829'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenChat(order)}
                  className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-[#FF6B00] hover:text-white transition-all shadow-sm"
                  title="Chat with rider"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <a
                  href={`tel:${order.driverPhone}`}
                  className="p-3 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20"
                  title="Call rider"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Order Details List */}
          <div className="space-y-2 text-xs">
            <h5 className="font-bold text-zinc-400 uppercase tracking-wider">Ordered Items</h5>
            <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-zinc-700 dark:text-zinc-300">
                  <span>{item.quantity}x {item.food.name}</span>
                  <span className="font-bold">₹{item.itemTotal.toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between font-bold text-sm text-zinc-900 dark:text-zinc-100">
                <span>Total Paid ({order.paymentMethod})</span>
                <span className="text-[#FF6B00]">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-center text-xs text-zinc-500">
          Need help with this order? <button onClick={() => onOpenChat(order)} className="text-[#FF6B00] font-bold hover:underline">Contact Support Chat</button>
        </div>
      </div>
    </div>
  );
};
