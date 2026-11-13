'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { useGameStore } from '@/stores/useGameStore';

export type ChunkyButtonVariant =
  | 'green'
  | 'blue'
  | 'amber'
  | 'purple'
  | 'red'
  | 'white'
  | 'outline';

export type ChunkyButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ChunkyButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ChunkyButtonVariant;
  size?: ChunkyButtonSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const ChunkyButton: React.FC<ChunkyButtonProps> = ({
  variant = 'green',
  size = 'md',
  icon,
  children,
  onClick,
  disabled,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && soundEnabled) {
      sounds.playClick();
    }
    if (onClick) onClick(e);
  };

  const variantStyles: Record<ChunkyButtonVariant, string> = {
    green:
      'bg-duo-green hover:bg-[#52be02] text-white shadow-3d-green border-b-4 border-duo-greenDark active:border-b-0 active:translate-y-1',
    blue:
      'bg-duo-blue hover:bg-[#16a1e3] text-white shadow-3d-blue border-b-4 border-duo-blueDark active:border-b-0 active:translate-y-1',
    amber:
      'bg-duo-amber hover:bg-[#f2be00] text-amber-950 shadow-3d-amber border-b-4 border-duo-amberDark active:border-b-0 active:translate-y-1',
    purple:
      'bg-duo-purple hover:bg-[#c472f8] text-white shadow-3d-purple border-b-4 border-duo-purpleDark active:border-b-0 active:translate-y-1',
    red:
      'bg-duo-red hover:bg-[#f04040] text-white shadow-3d-red border-b-4 border-duo-redDark active:border-b-0 active:translate-y-1',
    white:
      'bg-white hover:bg-slate-50 text-slate-700 shadow-3d-white border-2 border-slate-200 border-b-4 border-b-slate-300 active:border-b-2 active:translate-y-1',
    outline:
      'bg-transparent hover:bg-slate-100 text-slate-600 border-2 border-dashed border-slate-300 active:translate-y-0.5',
  };

  const sizeStyles: Record<ChunkyButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs font-black rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm md:text-base font-black rounded-2xl gap-2 tracking-wide uppercase',
    lg: 'px-7 py-3.5 text-base md:text-lg font-black rounded-2xl gap-2.5 tracking-wider uppercase',
    xl: 'px-8 py-4 text-lg md:text-xl font-black rounded-3xl gap-3 tracking-wider uppercase',
  };

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center select-none font-sans font-black transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:border-b-4 ${
        fullWidth ? 'w-full' : ''
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center flex-shrink-0">{icon}</span>}
      <span className="leading-none">{children}</span>
    </motion.button>
  );
};

