import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, ChefHat, Bike, ShoppingBag, Key, Building2, Smartphone } from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string }) => void;
  onRoleLoginSuccess?: (role: UserRole, user: { name: string; email: string }) => void;
  initialRole?: UserRole;
}

type AuthStep = 'login' | 'signup' | 'forgot' | 'otp';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRoleLoginSuccess,
  initialRole = 'customer',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [step, setStep] = useState<AuthStep>('login');
  
  // Dynamic form state per role
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [stationId, setStationId] = useState('STAFF-101 (Bawarchi Kitchen)');
  const [driverId, setDriverId] = useState('RIDER-404');
  const [vehicleType, setVehicleType] = useState('EV Scooter');
  const [securityToken, setSecurityToken] = useState('MASTER-KEY-882');
  const [otp, setOtp] = useState(['4', '8', '2', '9']);
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  // Configuration map for each role portal
  const rolePortals: Record<UserRole, {
    label: string;
    badge: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    badgeColor: string;
    bgAccent: string;
    defaultEmail: string;
    defaultName: string;
  }> = {
    customer: {
      label: 'Customer',
      badge: 'Customer Portal',
      title: 'Customer Food Ordering',
      subtitle: 'Order gourmet food, earn wallet cashbacks & track live deliveries.',
      icon: <ShoppingBag className="w-6 h-6 text-[#FF6B00]" />,
      color: '#FF6B00',
      badgeColor: 'bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30',
      bgAccent: 'from-[#FF6B00]/20 to-amber-500/10',
      defaultEmail: 'customer@hungryhub.in',
      defaultName: 'Bondada Manoj Kumar',
    },
    staff: {
      label: 'Staff & Kitchen',
      badge: 'Staff & Kitchen Portal',
      title: 'Kitchen & Restaurant Staff',
      subtitle: 'Manage live Kitchen Display System (KDS), orders & inventory.',
      icon: <ChefHat className="w-6 h-6 text-amber-500" />,
      color: '#F59E0B',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      bgAccent: 'from-amber-500/20 to-orange-500/10',
      defaultEmail: 'staff@pizzeria.in',
      defaultName: 'Chef Mario (Head Chef)',
    },
    driver: {
      label: 'Delivery Partner',
      badge: 'Delivery Agent Portal',
      title: 'Delivery Agent Navigation',
      subtitle: 'Accept dispatch orders, view live GPS route & verify customer OTPs.',
      icon: <Bike className="w-6 h-6 text-emerald-500" />,
      color: '#10B981',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      bgAccent: 'from-emerald-500/20 to-teal-500/10',
      defaultEmail: 'driver@hungryhub.in',
      defaultName: 'Alex Rivera (Express Agent)',
    },
    admin: {
      label: 'Administrator',
      badge: 'System Admin Portal',
      title: 'Administrator Core',
      subtitle: 'Access platform revenue analytics, user databases & financial logs.',
      icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
      color: '#6366F1',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      bgAccent: 'from-indigo-500/20 to-purple-500/10',
      defaultEmail: 'admin@hungryhub.in',
      defaultName: 'System Administrator (Root)',
    },
  };

  const portal = rolePortals[selectedRole];

  const handleCompleteLogin = (role: UserRole, userObj: { name: string; email: string }) => {
    if (onRoleLoginSuccess) {
      onRoleLoginSuccess(role, userObj);
    } else {
      onLoginSuccess(userObj);
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'login' || step === 'otp') {
      const userObj = {
        name: name || portal.defaultName,
        email: email || portal.defaultEmail,
      };
      handleCompleteLogin(selectedRole, userObj);
    } else if (step === 'signup' || step === 'forgot') {
      setStep('otp');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[32px] p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Portal Role Selection Header Tabs */}
          <div className="mb-6 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block text-center">
              Select Login Portal Type
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              {(['customer', 'staff', 'driver', 'admin'] as UserRole[]).map((r) => {
                const isSel = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r);
                      setStep('login');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                      isSel
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm scale-[1.02]'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    <span className="shrink-0">{rolePortals[r].icon}</span>
                    <span className="text-[11px] truncate">{rolePortals[r].label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Portal Header */}
          <div className={`p-4 rounded-2xl bg-gradient-to-r ${portal.bgAccent} border border-zinc-200/50 dark:border-zinc-800 mb-6 flex items-start gap-3`}>
            <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 shadow-md shrink-0">
              {portal.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-lg text-zinc-900 dark:text-zinc-100">
                  {portal.title}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${portal.badgeColor}`}>
                  {portal.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                {portal.subtitle}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={portal.defaultName}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-none focus:ring-2 focus:ring-[#FF6B00] text-sm"
                  />
                </div>
              </div>
            )}

            {/* Role-Specific Secondary Fields */}
            {selectedRole === 'staff' && step === 'login' && (
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Restaurant Station ID
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                  />
                </div>
              </div>
            )}

            {selectedRole === 'driver' && step === 'login' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Agent ID
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={driverId}
                      onChange={(e) => setDriverId(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold"
                  >
                    <option value="EV Scooter">EV Scooter</option>
                    <option value="Delivery Bike">Delivery Bike</option>
                    <option value="Mini Van">Mini Van</option>
                  </select>
                </div>
              </div>
            )}

            {selectedRole === 'admin' && step === 'login' && (
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Master Security Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={securityToken}
                    onChange={(e) => setSecurityToken(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                  />
                </div>
              </div>
            )}

            {(step === 'login' || step === 'signup' || step === 'forgot') && (
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  {selectedRole === 'customer' ? 'Email Address' : 'Account Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={portal.defaultEmail}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-none focus:ring-2 focus:ring-[#FF6B00] text-sm"
                  />
                </div>
              </div>
            )}

            {(step === 'login' || step === 'signup') && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                    Password
                  </label>
                  {step === 'login' && (
                    <button
                      type="button"
                      onClick={() => setStep('forgot')}
                      className="text-xs font-medium hover:underline text-[#FF6B00]"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-none focus:ring-2 focus:ring-[#FF6B00] text-sm"
                  />
                </div>
              </div>
            )}

            {step === 'otp' && (
              <div className="py-2">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newOtp = [...otp];
                        newOtp[idx] = e.target.value;
                        setOtp(newOtp);
                      }}
                      className="w-12 h-14 text-center font-bold text-xl rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-200 dark:border-zinc-700 focus:border-[#FF6B00]"
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 group"
              style={{ backgroundColor: portal.color }}
            >
              <span>
                {step === 'login' && `Login to ${portal.label} Portal`}
                {step === 'signup' && 'Create Account & Continue'}
                {step === 'forgot' && 'Send Reset Link'}
                {step === 'otp' && 'Verify & Launch Portal'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-2">
              Instant 1-Click Demo Login
            </p>
            <button
              type="button"
              onClick={() => {
                handleCompleteLogin(selectedRole, {
                  name: portal.defaultName,
                  email: portal.defaultEmail,
                });
              }}
              className="w-full py-2.5 px-4 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 bg-zinc-50 dark:bg-zinc-800/50"
            >
              <span>⚡ Enter {portal.label} Portal as {portal.defaultName}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
