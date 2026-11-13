'use client';

import React from 'react';
import { sounds } from '@/lib/sounds';
import { useGameStore } from '@/stores/useGameStore';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'purple' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const GameButton: React.FC<GameButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && soundEnabled) {
      sounds.playClick();
    }
    if (onClick) onClick(e);
  };

  const variants = {
    primary:
      'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 shadow-game-blue',
    secondary:
      'bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-800 border-b-4 border-slate-400 active:border-b-0 active:translate-y-1',
    success:
      'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-game-emerald',
    danger:
      'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white border-b-4 border-rose-700 active:border-b-0 active:translate-y-1',
    purple:
      'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 shadow-game-purple',
    amber:
      'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 shadow-game-amber',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-bold rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm md:text-base font-extrabold rounded-2xl gap-2',
    lg: 'px-7 py-3.5 text-base md:text-lg font-black rounded-2xl gap-3',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all duration-75 select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:border-b-4 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

