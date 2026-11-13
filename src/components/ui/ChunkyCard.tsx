'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ChunkyCardProps extends HTMLMotionProps<'div'> {
  variant?: 'white' | 'gray' | 'green' | 'blue' | 'amber' | 'purple' | 'red';
  children: React.ReactNode;
  interactive?: boolean;
}

export const ChunkyCard: React.FC<ChunkyCardProps> = ({
  variant = 'white',
  children,
  interactive = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    white: 'bg-white border-2 border-slate-200 border-b-4 border-b-slate-300',
    gray: 'bg-slate-50 border-2 border-slate-200 border-b-4 border-b-slate-300',
    green: 'bg-duo-greenLight/30 border-2 border-duo-green/40 border-b-4 border-b-duo-greenDark/40',
    blue: 'bg-duo-blueLight/40 border-2 border-duo-blue/40 border-b-4 border-b-duo-blueDark/40',
    amber: 'bg-duo-amberLight/40 border-2 border-duo-amber/40 border-b-4 border-b-duo-amberDark/40',
    purple: 'bg-duo-purpleLight/40 border-2 border-duo-purple/40 border-b-4 border-b-duo-purpleDark/40',
    red: 'bg-duo-red/10 border-2 border-duo-red/30 border-b-4 border-b-duo-redDark/30',
  };

  return (
    <motion.div
      whileHover={interactive ? { y: -2 } : {}}
      className={`rounded-3xl p-5 md:p-6 transition-all ${variantStyles[variant]} ${
        interactive ? 'cursor-pointer hover:border-duo-blue hover:border-b-duo-blueDark' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
