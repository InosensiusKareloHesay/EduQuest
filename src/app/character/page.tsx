'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shirt,
  ShoppingBag,
  Check,
  Undo2,
  Sparkles,
} from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { INITIAL_ITEMS } from '@/lib/mockData';
import { ChibiAvatar } from '@/components/avatar/ChibiAvatar';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';
import { Item, ItemCategory, PlayerEquipment } from '@/types';
import { sounds } from '@/lib/sounds';

export default function CharacterPage() {
  const profile = useGameStore((s) => s.profile);
  const equipment = useGameStore((s) => s.equipment);
  const inventory = useGameStore((s) => s.inventory);
  const equipItem = useGameStore((s) => s.equipItem);
  const unequipCategory = useGameStore((s) => s.unequipCategory);
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  const [activeTab, setActiveTab] = useState<ItemCategory>('hair');
  const [expression, setExpression] = useState<'happy' | 'excited' | 'wink' | 'focused'>('happy');

  const tabs: { label: string; category: ItemCategory }[] = [
    { label: 'Rambut', category: 'hair' },
    { label: 'Atasan', category: 'outfit' },
    { label: 'Bawahan', category: 'bottom' },
    { label: 'Sepatu', category: 'shoes' },
    { label: 'Topi/Kepala', category: 'head_accessory' },
    { label: 'Kacamata', category: 'face_accessory' },
    { label: 'Sayap & Tas', category: 'back_accessory' },
  ];

  const categoryItems = INITIAL_ITEMS.filter((i) => i.category === activeTab);

  const isEquipped = (item: Item) => {
    switch (item.category) {
      case 'hair':
        return equipment.hair_item_id === item.id;
      case 'outfit':
        return equipment.outfit_item_id === item.id;
      case 'bottom':
        return equipment.bottom_item_id === item.id;
      case 'shoes':
        return equipment.shoes_item_id === item.id;
      case 'head_accessory':
        return equipment.head_accessory_id === item.id;
      case 'face_accessory':
        return equipment.face_accessory_id === item.id;
      case 'back_accessory':
        return equipment.back_accessory_id === item.id;
    }
  };

  const handleEquip = (item: Item) => {
    equipItem(item);
    if (soundEnabled) sounds.playClick();
  };

  const handleUnequip = (category: ItemCategory) => {
    const map: Record<ItemCategory, keyof PlayerEquipment> = {
      hair: 'hair_item_id',
      outfit: 'outfit_item_id',
      bottom: 'bottom_item_id',
      shoes: 'shoes_item_id',
      head_accessory: 'head_accessory_id',
      face_accessory: 'face_accessory_id',
      back_accessory: 'back_accessory_id',
    };
    unequipCategory(map[category]);
    if (soundEnabled) sounds.playClick();
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Kamar Ganti <span className="text-duo-purple">Avatar Chibi</span>
          </h1>
          <p className="text-slate-500 font-bold text-xs sm:text-sm">
            Kombinasikan pakaian, rambut, dan aksesoris yang sudah kamu koleksi.
          </p>
        </div>

        <Link href="/shop">
          <ChunkyButton variant="amber" icon={<ShoppingBag className="w-4 h-4" />}>
            Beli Aksesoris Baru
          </ChunkyButton>
        </Link>
      </div>

      {/* STAGE & CLOTHES RACK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: CHIBI STAGE (5 COLS) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-duo-purple to-purple-800 border-b-6 border-b-purple-950 rounded-3xl p-6 text-white shadow-xl flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden">
          <div className="w-full flex justify-between items-center relative z-10">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md">
              Pratinjau
            </span>

            {/* EXPRESSION TOGGLES */}
            <div className="flex gap-1 bg-black/30 p-1 rounded-xl backdrop-blur-md">
              {(['happy', 'excited', 'wink', 'focused'] as const).map((expr) => (
                <button
                  key={expr}
                  onClick={() => setExpression(expr)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-black uppercase transition-all ${
                    expression === expr
                      ? 'bg-duo-amber text-amber-950 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {expr}
                </button>
              ))}
            </div>
          </div>

          <div className="my-auto py-4 relative z-10">
            <ChibiAvatar
              equipment={equipment}
              expression={expression}
              size="lg"
              animated={true}
            />
          </div>

          <div className="w-full bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center relative z-10">
            <div className="text-xs font-black text-duo-amber">
              {profile.full_name}
            </div>
            <div className="text-[11px] font-bold text-purple-200">
              Aksesoris hanya sebagai kosmetik visual tanpa memengaruhi nilai kuis.
            </div>
          </div>
        </div>

        {/* RIGHT: CLOSET INVENTORY (7 COLS) */}
        <ChunkyCard variant="white" className="lg:col-span-7 space-y-6">
          {/* CATEGORY SCROLLER */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b-2 border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab.category}
                onClick={() => setActiveTab(tab.category)}
                className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeTab === tab.category
                    ? 'bg-duo-purple text-white shadow-3d-purple border-b-4 border-duo-purpleDark'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ITEM LIST */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Pilih Item untuk Dipakai
              </span>

              {['head_accessory', 'face_accessory', 'back_accessory'].includes(activeTab) && (
                <button
                  onClick={() => handleUnequip(activeTab)}
                  className="text-xs font-black uppercase text-duo-red hover:underline flex items-center gap-1"
                >
                  <Undo2 className="w-3.5 h-3.5" /> Lepas Aksesoris
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categoryItems.map((item) => {
                const isOwned = inventory.includes(item.id);
                const equipped = isEquipped(item);

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                      equipped
                        ? 'border-duo-purple bg-duo-purpleLight/30 border-b-6 border-b-duo-purpleDark shadow-sm'
                        : isOwned
                        ? 'border-slate-200 bg-white border-b-4 border-b-slate-300 hover:border-duo-purple/40'
                        : 'border-dashed border-slate-200 bg-slate-50/60 opacity-60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-800">{item.name}</span>
                        {item.rarity && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {item.rarity}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-400">{item.description}</p>
                    </div>

                    <div>
                      {isOwned ? (
                        equipped ? (
                          <div className="text-xs font-black text-duo-purpleDark flex items-center gap-1">
                            <Check className="w-4 h-4 stroke-[3]" /> Sedang Dipakai
                          </div>
                        ) : (
                          <ChunkyButton
                            variant="purple"
                            size="sm"
                            fullWidth
                            onClick={() => handleEquip(item)}
                          >
                            Pakai Item Ini
                          </ChunkyButton>
                        )
                      ) : (
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-bold text-slate-400">Belum ada</span>
                          <Link href="/shop" className="text-xs font-black text-amber-700 hover:underline">
                            Beli ({item.price} Koin)
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ChunkyCard>
      </div>
    </div>
  );
}
