'use client';

import React from 'react';
import { PlayerEquipment } from '@/types';
import { INITIAL_ITEMS } from '@/lib/mockData';

interface ChibiAvatarProps {
  equipment?: Partial<PlayerEquipment>;
  skinTone?: string;
  expression?: 'happy' | 'excited' | 'wink' | 'focused';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export const ChibiAvatar: React.FC<ChibiAvatarProps> = ({
  equipment,
  skinTone = '#FFDFC4',
  expression = 'happy',
  size = 'md',
  animated = true,
  className = '',
}) => {
  // Resolve equipped item asset ids
  const getItemAsset = (itemId?: string | null) => {
    if (!itemId) return null;
    const item = INITIAL_ITEMS.find((i) => i.id === itemId);
    return item ? item.asset_id : null;
  };

  const hairAsset = getItemAsset(equipment?.hair_item_id) || 'hair-short-brown';
  const outfitAsset = getItemAsset(equipment?.outfit_item_id) || 'outfit-blue-tee';
  const bottomAsset = getItemAsset(equipment?.bottom_item_id) || 'bottom-denim-jeans';
  const shoesAsset = getItemAsset(equipment?.shoes_item_id) || 'shoes-red-sneakers';
  const headAcc = getItemAsset(equipment?.head_accessory_id);
  const faceAcc = getItemAsset(equipment?.face_accessory_id);
  const backAcc = getItemAsset(equipment?.back_accessory_id);

  const sizeClasses = {
    sm: 'w-24 h-32',
    md: 'w-44 h-56',
    lg: 'w-64 h-80',
    xl: 'w-80 h-96',
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${
        animated ? 'animate-bounce-subtle' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 240 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <radialGradient id="shadowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="blushGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF708F" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FF708F" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. GROUND SHADOW */}
        <ellipse cx="120" cy="300" rx="75" ry="14" fill="url(#shadowGradient)" />

        {/* 2. LAYER: BACK ACCESSORY */}
        {backAcc === 'acc-fairy-wings' && (
          <g id="fairy-wings" className="transition-transform duration-300">
            {/* Left Wing */}
            <path
              d="M100 160 C40 100 20 120 40 180 C50 210 90 200 105 180 Z"
              fill="#A78BFA"
              fillOpacity="0.75"
              stroke="#8B5CF6"
              strokeWidth="3"
            />
            {/* Right Wing */}
            <path
              d="M140 160 C200 100 220 120 200 180 C190 210 150 200 135 180 Z"
              fill="#A78BFA"
              fillOpacity="0.75"
              stroke="#8B5CF6"
              strokeWidth="3"
            />
            <circle cx="50" cy="140" r="4" fill="#FDE047" />
            <circle cx="190" cy="140" r="4" fill="#FDE047" />
          </g>
        )}

        {backAcc === 'acc-explorer-bag' && (
          <g id="explorer-bag">
            <rect x="75" y="165" width="90" height="70" rx="18" fill="#B45309" stroke="#78350F" strokeWidth="4" />
            <rect x="85" y="180" width="70" height="35" rx="8" fill="#D97706" />
            <circle cx="120" cy="195" r="5" fill="#FEF08A" />
            <line x1="88" y1="160" x2="88" y2="230" stroke="#78350F" strokeWidth="4" />
            <line x1="152" y1="160" x2="152" y2="230" stroke="#78350F" strokeWidth="4" />
          </g>
        )}

        {/* 3. LAYER: BODY & LIMBS (Skin base) */}
        {/* Legs */}
        <rect x="94" y="210" width="20" height="60" rx="10" fill={skinTone} stroke="#374151" strokeWidth="3" />
        <rect x="126" y="210" width="20" height="60" rx="10" fill={skinTone} stroke="#374151" strokeWidth="3" />

        {/* Torso Base */}
        <rect x="88" y="152" width="64" height="65" rx="18" fill={skinTone} stroke="#374151" strokeWidth="3" />

        {/* Arms */}
        {/* Left Arm */}
        <path d="M78 165 C65 185 68 215 80 225" stroke="#374151" strokeWidth="18" strokeLinecap="round" />
        <path d="M78 165 C65 185 68 215 80 225" stroke={skinTone} strokeWidth="12" strokeLinecap="round" />
        {/* Right Arm */}
        <path d="M162 165 C175 185 172 215 160 225" stroke="#374151" strokeWidth="18" strokeLinecap="round" />
        <path d="M162 165 C175 185 172 215 160 225" stroke={skinTone} strokeWidth="12" strokeLinecap="round" />

        {/* 4. LAYER: BOTTOMS */}
        {bottomAsset === 'bottom-denim-jeans' && (
          <g id="bottom-denim">
            <path
              d="M88 200 L152 200 L148 245 L126 245 L120 215 L114 245 L92 245 Z"
              fill="#2563EB"
              stroke="#1E3A8A"
              strokeWidth="3.5"
            />
            {/* Belt */}
            <rect x="88" y="198" width="64" height="8" rx="2" fill="#854D0E" />
            <rect x="115" y="197" width="10" height="10" rx="1" fill="#FACC15" />
          </g>
        )}

        {bottomAsset === 'bottom-cargo-khaki' && (
          <g id="bottom-cargo">
            <path
              d="M87 200 L153 200 L149 248 L126 248 L120 215 L114 248 L91 248 Z"
              fill="#A16207"
              stroke="#713F12"
              strokeWidth="3.5"
            />
            {/* Pockets */}
            <rect x="89" y="215" width="12" height="14" rx="2" fill="#854D0E" />
            <rect x="139" y="215" width="12" height="14" rx="2" fill="#854D0E" />
          </g>
        )}

        {bottomAsset === 'bottom-pleated-skirt' && (
          <g id="bottom-skirt">
            <path
              d="M92 200 L148 200 L160 236 L80 236 Z"
              fill="#BE123C"
              stroke="#881337"
              strokeWidth="3.5"
            />
            <line x1="100" y1="202" x2="94" y2="235" stroke="#FFE4E6" strokeWidth="2" />
            <line x1="113" y1="202" x2="111" y2="235" stroke="#FFE4E6" strokeWidth="2" />
            <line x1="127" y1="202" x2="129" y2="235" stroke="#FFE4E6" strokeWidth="2" />
            <line x1="140" y1="202" x2="146" y2="235" stroke="#FFE4E6" strokeWidth="2" />
          </g>
        )}

        {/* 5. LAYER: SHOES */}
        {shoesAsset === 'shoes-red-sneakers' && (
          <g id="shoes-sneakers">
            {/* Left Shoe */}
            <rect x="88" y="258" width="28" height="18" rx="8" fill="#EF4444" stroke="#991B1B" strokeWidth="3" />
            <rect x="86" y="271" width="32" height="6" rx="3" fill="#FFFFFF" stroke="#991B1B" strokeWidth="2" />
            {/* Right Shoe */}
            <rect x="124" y="258" width="28" height="18" rx="8" fill="#EF4444" stroke="#991B1B" strokeWidth="3" />
            <rect x="122" y="271" width="32" height="6" rx="3" fill="#FFFFFF" stroke="#991B1B" strokeWidth="2" />
          </g>
        )}

        {shoesAsset === 'shoes-brown-loafers' && (
          <g id="shoes-loafers">
            <rect x="88" y="260" width="28" height="16" rx="6" fill="#78350F" stroke="#451A03" strokeWidth="3" />
            <rect x="87" y="272" width="30" height="5" rx="2" fill="#451A03" />
            <rect x="124" y="260" width="28" height="16" rx="6" fill="#78350F" stroke="#451A03" strokeWidth="3" />
            <rect x="123" y="272" width="30" height="5" rx="2" fill="#451A03" />
          </g>
        )}

        {shoesAsset === 'shoes-boots-yellow' && (
          <g id="shoes-boots">
            <rect x="88" y="248" width="28" height="28" rx="6" fill="#EAB308" stroke="#A16207" strokeWidth="3" />
            <rect x="86" y="271" width="32" height="6" rx="2" fill="#451A03" />
            <rect x="124" y="248" width="28" height="28" rx="6" fill="#EAB308" stroke="#A16207" strokeWidth="3" />
            <rect x="122" y="271" width="32" height="6" rx="2" fill="#451A03" />
          </g>
        )}

        {/* 6. LAYER: OUTFIT (Tops) */}
        {outfitAsset === 'outfit-blue-tee' && (
          <g id="outfit-tee">
            <path
              d="M86 155 Q120 162 154 155 L156 205 Q120 208 84 205 Z"
              fill="#0284C7"
              stroke="#0369A1"
              strokeWidth="3.5"
            />
            {/* Sleeves */}
            <path d="M86 156 L68 180 L80 188 L92 168 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="3" />
            <path d="M154 156 L172 180 L160 188 L148 168 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="3" />
            {/* Logo Star */}
            <polygon points="120,172 123,180 131,180 125,185 127,193 120,188 113,193 115,185 109,180 117,180" fill="#FACC15" />
          </g>
        )}

        {outfitAsset === 'outfit-red-flannel' && (
          <g id="outfit-flannel">
            <rect x="85" y="154" width="70" height="52" rx="6" fill="#DC2626" stroke="#991B1B" strokeWidth="3.5" />
            {/* Flannel check pattern */}
            <line x1="102" y1="154" x2="102" y2="206" stroke="#450A0A" strokeWidth="3" />
            <line x1="138" y1="154" x2="138" y2="206" stroke="#450A0A" strokeWidth="3" />
            <line x1="85" y1="180" x2="155" y2="180" stroke="#450A0A" strokeWidth="3" />
            {/* Collar & Buttons */}
            <polygon points="110,154 120,166 130,154" fill="#FFFFFF" />
            <circle cx="120" cy="174" r="2" fill="#FFFFFF" />
            <circle cx="120" cy="188" r="2" fill="#FFFFFF" />
            <circle cx="120" cy="200" r="2" fill="#FFFFFF" />
          </g>
        )}

        {outfitAsset === 'outfit-purple-hoodie' && (
          <g id="outfit-hoodie">
            <rect x="82" y="152" width="76" height="56" rx="10" fill="#7C3AED" stroke="#5B21B6" strokeWidth="3.5" />
            {/* Kangaroo pocket */}
            <path d="M96 186 Q120 182 144 186 L140 205 L100 205 Z" fill="#6D28D9" stroke="#5B21B6" strokeWidth="2" />
            {/* Drawstrings */}
            <line x1="112" y1="158" x2="112" y2="178" stroke="#EDE9FE" strokeWidth="3" strokeLinecap="round" />
            <line x1="128" y1="158" x2="128" y2="178" stroke="#EDE9FE" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {outfitAsset === 'outfit-lab-coat' && (
          <g id="outfit-lab">
            <rect x="84" y="152" width="72" height="58" rx="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="3.5" />
            {/* Inner tie/shirt */}
            <polygon points="112,152 120,172 128,152" fill="#3B82F6" />
            <polygon points="118,172 122,172 124,194 120,198 116,194" fill="#EF4444" />
            {/* Pen in pocket */}
            <rect x="92" y="174" width="16" height="18" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
            <line x1="96" y1="170" x2="96" y2="178" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* 7. LAYER: CHIBI HEAD BASE */}
        <circle cx="120" cy="95" r="54" fill={skinTone} stroke="#374151" strokeWidth="3.5" />
        {/* Ears */}
        <circle cx="66" cy="98" r="10" fill={skinTone} stroke="#374151" strokeWidth="3" />
        <circle cx="174" cy="98" r="10" fill={skinTone} stroke="#374151" strokeWidth="3" />

        {/* Cheeks Blush */}
        <ellipse cx="88" cy="108" rx="12" ry="7" fill="url(#blushGradient)" />
        <ellipse cx="152" cy="108" rx="12" ry="7" fill="url(#blushGradient)" />

        {/* 8. LAYER: CHIBI FACE EXPRESSIONS */}
        {expression === 'happy' && (
          <g id="face-happy">
            {/* Big Shiny Chibi Eyes */}
            <circle cx="95" cy="92" r="11" fill="#1F2937" />
            <circle cx="92" cy="88" r="4.5" fill="#FFFFFF" />
            <circle cx="98" cy="96" r="2" fill="#FFFFFF" />

            <circle cx="145" cy="92" r="11" fill="#1F2937" />
            <circle cx="142" cy="88" r="4.5" fill="#FFFFFF" />
            <circle cx="148" cy="96" r="2" fill="#FFFFFF" />

            {/* Cute Smile */}
            <path d="M112 110 Q120 120 128 110" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" fill="#F43F5E" />
          </g>
        )}

        {expression === 'wink' && (
          <g id="face-wink">
            {/* Left Eye Open */}
            <circle cx="95" cy="92" r="11" fill="#1F2937" />
            <circle cx="92" cy="88" r="4.5" fill="#FFFFFF" />
            <circle cx="98" cy="96" r="2" fill="#FFFFFF" />

            {/* Right Eye Winking */}
            <path d="M136 94 Q146 84 156 94" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Mischievous smile */}
            <path d="M112 110 Q122 122 130 112" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" fill="#F43F5E" />
          </g>
        )}

        {expression === 'excited' && (
          <g id="face-excited">
            {/* Starry Eyes */}
            <polygon points="95,80 98,88 106,91 99,96 101,104 95,99 89,104 91,96 84,91 92,88" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <polygon points="145,80 148,88 156,91 149,96 151,104 145,99 139,104 141,96 134,91 142,88" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            {/* Open mouth laughing */}
            <path d="M110 108 Q120 126 130 108 Z" fill="#F43F5E" stroke="#374151" strokeWidth="3" />
          </g>
        )}

        {expression === 'focused' && (
          <g id="face-focused">
            {/* Determined eyebrows */}
            <line x1="86" y1="78" x2="104" y2="84" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="154" y1="78" x2="136" y2="84" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="95" cy="92" r="9" fill="#1F2937" />
            <circle cx="93" cy="89" r="3.5" fill="#FFFFFF" />
            <circle cx="145" cy="92" r="9" fill="#1F2937" />
            <circle cx="143" cy="89" r="3.5" fill="#FFFFFF" />
            <line x1="114" y1="112" x2="126" y2="112" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* 9. LAYER: FACE ACCESSORY (Glasses) */}
        {faceAcc === 'acc-smart-glasses' && (
          <g id="smart-glasses">
            <circle cx="95" cy="92" r="17" fill="#E0F2FE" fillOpacity="0.3" stroke="#0284C7" strokeWidth="3.5" />
            <circle cx="145" cy="92" r="17" fill="#E0F2FE" fillOpacity="0.3" stroke="#0284C7" strokeWidth="3.5" />
            <line x1="112" y1="92" x2="128" y2="92" stroke="#0284C7" strokeWidth="3.5" />
            <line x1="78" y1="92" x2="68" y2="90" stroke="#0284C7" strokeWidth="3.5" />
            <line x1="162" y1="92" x2="172" y2="90" stroke="#0284C7" strokeWidth="3.5" />
          </g>
        )}

        {/* 10. LAYER: HAIR */}
        {hairAsset === 'hair-short-brown' && (
          <g id="hair-short">
            <path
              d="M66 85 C66 45 174 45 174 85 C174 95 168 112 165 110 C160 90 150 72 135 70 C125 78 110 74 100 70 C85 75 75 92 72 110 C70 105 66 95 66 85 Z"
              fill="#78350F"
              stroke="#451A03"
              strokeWidth="3.5"
            />
          </g>
        )}

        {hairAsset === 'hair-long-black' && (
          <g id="hair-long">
            {/* Long strands behind */}
            <path d="M64 90 C50 140 54 200 68 220" stroke="#18181B" strokeWidth="20" strokeLinecap="round" />
            <path d="M176 90 C190 140 186 200 172 220" stroke="#18181B" strokeWidth="20" strokeLinecap="round" />
            {/* Bangs */}
            <path
              d="M66 85 C66 45 174 45 174 85 C174 105 162 108 152 75 C138 78 130 72 120 72 C110 72 102 78 88 75 C78 108 66 105 66 85 Z"
              fill="#18181B"
              stroke="#09090B"
              strokeWidth="3.5"
            />
          </g>
        )}

        {hairAsset === 'hair-curly-blonde' && (
          <g id="hair-curly">
            <circle cx="75" cy="55" r="22" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
            <circle cx="110" cy="45" r="24" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
            <circle cx="145" cy="45" r="24" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
            <circle cx="165" cy="60" r="20" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
            <circle cx="65" cy="85" r="18" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
            <circle cx="175" cy="85" r="18" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
            <path d="M85 70 Q120 80 155 70" stroke="#D97706" strokeWidth="4" fill="none" />
          </g>
        )}

        {hairAsset === 'hair-spiky-blue' && (
          <g id="hair-spiky">
            <path
              d="M60 85 L70 45 L95 62 L120 30 L145 62 L170 45 L180 85 C180 85 155 68 120 70 C85 68 60 85 60 85 Z"
              fill="#06B6D4"
              stroke="#0891B2"
              strokeWidth="3.5"
            />
          </g>
        )}

        {/* 11. LAYER: HEAD ACCESSORY (Cap / Crown) */}
        {headAcc === 'acc-yellow-cap' && (
          <g id="yellow-cap">
            {/* Dome */}
            <path d="M70 65 Q120 28 170 65 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="3.5" />
            {/* Visor */}
            <ellipse cx="145" cy="62" rx="42" ry="10" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
            <circle cx="120" cy="42" r="5" fill="#D97706" />
          </g>
        )}

        {headAcc === 'acc-gold-crown' && (
          <g id="gold-crown">
            <polygon
              points="82,58 92,28 108,46 120,20 132,46 148,28 158,58"
              fill="#FACC15"
              stroke="#CA8A04"
              strokeWidth="3.5"
            />
            {/* Jewels */}
            <circle cx="92" cy="36" r="3.5" fill="#EF4444" />
            <circle cx="120" cy="28" r="4.5" fill="#3B82F6" />
            <circle cx="148" cy="36" r="3.5" fill="#10B981" />
          </g>
        )}
      </svg>
    </div>
  );
};

