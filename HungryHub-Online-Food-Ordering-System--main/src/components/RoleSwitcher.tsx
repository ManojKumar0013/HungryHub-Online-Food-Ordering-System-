import React from 'react';
import { UserRole } from '../types';
import { ShoppingBag, ChefHat, Bike, ShieldCheck, Database } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'customer',
      label: 'Customer App',
      icon: <ShoppingBag className="w-4 h-4" />,
      color: 'bg-[#FF6B00] text-white',
    },
    {
      role: 'staff',
      label: 'Kitchen & Staff',
      icon: <ChefHat className="w-4 h-4" />,
      color: 'bg-amber-500 text-white',
    },
    {
      role: 'driver',
      label: 'Delivery Partner',
      icon: <Bike className="w-4 h-4" />,
      color: 'bg-emerald-500 text-white',
    },
    {
      role: 'admin',
      label: 'Admin Dashboard',
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'bg-indigo-600 text-white',
    },
  ];

  return (
    <div className="bg-zinc-900 text-white border-b border-zinc-800 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Module Switcher Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 hide-scrollbar">
          <span className="text-zinc-400 font-semibold mr-1 shrink-0 uppercase tracking-wider text-[10px]">
            Active Portal UI:
          </span>
          {roles.map((r) => {
            const isActive = currentRole === r.role;
            return (
              <button
                key={r.role}
                onClick={() => onRoleChange(r.role)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? `${r.color} shadow-md scale-105 font-bold`
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
