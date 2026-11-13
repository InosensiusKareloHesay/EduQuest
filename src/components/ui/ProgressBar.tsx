'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: 'green' | 'blue' | 'amber' | 'purple';
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'green',
  height = 'md',
  showLabel = false,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const heightStyles = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-6',
  };

  const colorGradients = {
    green: 'bg-gradient-to-r from-[#58CC02] to-[#6EE700]',
    blue: 'bg-gradient-to-r from-[#1CB0F6] to-[#43C8FF]',
    amber: 'bg-gradient-to-r from-[#FFC800] to-[#FFD84D]',
    purple: 'bg-gradient-to-r from-[#CE82FF] to-[#DF9BFF]',
  };

  return (
    <div className={`w-full flex items-center gap-3 ${className}`}>
      <div
        className={`w-full bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300/80 shadow-inner ${heightStyles[height]}`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          className={`h-full rounded-full glossy-bar relative ${colorGradients[color]}`}
        >
          {/* Subtle shine highlight */}
          <div className="absolute top-1 left-2 right-2 h-1/3 bg-white/40 rounded-full" />
        </motion.div>
      </div>
      {showLabel && (
        <span className="text-xs font-black text-slate-600 flex-shrink-0">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
};

