'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Coins,
  Check,
  Eye,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { INITIAL_ITEMS } from '@/lib/mockData';
import { ChibiAvatar } from '@/components/avatar/ChibiAvatar';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';
import { Item } from '@/types';
import { sounds } from '@/lib/sounds';

export default function ShopPage() {
  const coins = useGameStore((s) => s.coins);
  const inventory = useGameStore((s) => s.inventory);
  const equipment = useGameStore((s) => s.equipment);
  const buyItem = useGameStore((s) => s.buyItem);
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewItem, setPreviewItem] = useState<Item | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const categories = [
    { label: 'Semua Item', id: 'all' },
    { label: 'Rambut', id: 'hair' },
    { label: 'Atasan', id: 'outfit' },
    { label: 'Bawahan', id: 'bottom' },
    { label: 'Sepatu', id: 'shoes' },
    { label: 'Topi/Kepala', id: 'head_accessory' },
    { label: 'Kacamata', id: 'face_accessory' },
    { label: 'Sayap & Tas', id: 'back_accessory' },
  ];

  const filteredItems = INITIAL_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleBuy = (item: Item) => {
    const res = buyItem(item);
    if (res.success) {
      if (soundEnabled) {
        sounds.playCoin();
        sounds.playFanfare();
      }
      setToastMessage({ text: res.message, error: false });
      setPreviewItem(null);
    } else {
      if (soundEnabled) sounds.playWrong();
      setToastMessage({ text: res.message, error: true });
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const getPreviewEquipment = () => {
    if (!previewItem) return equipment;
    const nextEquip = { ...equipment };
    switch (previewItem.category) {
      case 'hair':
        nextEquip.hair_item_id = previewItem.id;
        break;
      case 'outfit':
        nextEquip.outfit_item_id = previewItem.id;
        break;
      case 'bottom':
        nextEquip.bottom_item_id = previewItem.id;
        break;
      case 'shoes':
        nextEquip.shoes_item_id = previewItem.id;
        break;
      case 'head_accessory':
        nextEquip.head_accessory_id = previewItem.id;
        break;
      case 'face_accessory':
        nextEquip.face_accessory_id = previewItem.id;
        break;
      case 'back_accessory':
        nextEquip.back_accessory_id = previewItem.id;
        break;
    }
    return nextEquip;
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-6xl mx-auto">
      {/* TOAST POPUP */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-6 z-50 p-4 rounded-3xl shadow-xl flex items-center gap-3 text-sm font-black border-b-4 ${
              toastMessage.error
                ? 'bg-duo-red text-white border-b-duo-redDark shadow-3d-red'
                : 'bg-duo-green text-white border-b-duo-greenDark shadow-3d-green'
            }`}
          >
            {toastMessage.error ? <AlertCircle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-br from-duo-amber to-[#CC7800] border-b-6 border-b-[#995a00] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <ShoppingBag className="w-4 h-4" />
            Toko Resmi EduQuest
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Katalog Aksesoris & Outfit</h1>
          <p className="text-amber-100 font-bold text-xs sm:text-sm max-w-lg">
            Gunakan koin hasil kuis belajarmu untuk mengoleksi item kosmetik eksklusif!
          </p>
        </div>

        {/* COIN STATUS */}
        <div className="bg-black/20 backdrop-blur-md p-5 rounded-3xl border-2 border-white/30 text-center flex-shrink-0">
          <div className="text-xs font-black uppercase tracking-wider text-amber-200">Saldo Koinmu</div>
          <div className="text-3xl sm:text-4xl font-black text-white flex items-center justify-center gap-2 mt-1">
            <Coins className="w-8 h-8 fill-amber-300 text-amber-900" />
            <span>{coins}</span>
          </div>
          <Link href="/quiz" className="text-xs font-black text-amber-300 hover:underline mt-2 block">
            + Cari koin di Arena Kuis
          </Link>
        </div>
      </div>

      {/* CATEGORY FILTER BUTTONS */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeCategory === c.id
                ? 'bg-duo-amber text-amber-950 shadow-3d-amber border-b-4 border-duo-amberDark'
                : 'bg-white text-slate-600 hover:bg-slate-100 border-2 border-slate-200 border-b-4 border-b-slate-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ITEMS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const isOwned = inventory.includes(item.id);
          const canAfford = coins >= item.price;

          return (
            <ChunkyCard
              key={item.id}
              variant="white"
              className="flex flex-col justify-between space-y-4 hover:border-duo-amber transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      item.rarity === 'legendary'
                        ? 'bg-amber-100 text-amber-900'
                        : item.rarity === 'epic'
                        ? 'bg-purple-100 text-purple-900'
                        : item.rarity === 'rare'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.rarity || 'common'}
                  </span>

                  {isOwned && (
                    <span className="text-xs font-black uppercase text-duo-greenDark bg-duo-greenLight px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Dimiliki
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-black text-base text-slate-800">{item.name}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t-2 border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-400">Harga</span>
                  <div className="flex items-center gap-1 font-black text-amber-700 text-base">
                    <Coins className="w-4 h-4 fill-amber-400 text-amber-700" />
                    <span>{item.price === 0 ? 'Gratis' : `${item.price} Koin`}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <ChunkyButton
                    variant="white"
                    size="sm"
                    onClick={() => setPreviewItem(item)}
                    icon={<Eye className="w-4 h-4" />}
                  >
                    Coba
                  </ChunkyButton>

                  {!isOwned ? (
                    <ChunkyButton
                      variant="amber"
                      size="sm"
                      disabled={!canAfford}
                      onClick={() => handleBuy(item)}
                    >
                      Beli
                    </ChunkyButton>
                  ) : (
                    <Link href="/character" className="w-full">
                      <ChunkyButton variant="purple" size="sm" fullWidth>
                        Pakai
                      </ChunkyButton>
                    </Link>
                  )}
                </div>
              </div>
            </ChunkyCard>
          );
        })}
      </div>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 relative border-4 border-duo-amber shadow-2xl"
            >
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>

              <div className="text-center space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-duo-amberDark bg-duo-amberLight px-3 py-1 rounded-full">
                  Pratinjau Item
                </span>
                <h2 className="text-2xl font-black text-slate-800">{previewItem.name}</h2>
                <p className="text-xs font-bold text-slate-400">{previewItem.description}</p>
              </div>

              <div className="bg-gradient-to-b from-duo-blue to-indigo-600 rounded-2xl p-4 flex justify-center shadow-inner">
                <ChibiAvatar equipment={getPreviewEquipment()} expression="excited" size="md" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm font-black text-slate-600 uppercase">Harga</span>
                  <span className="text-xl font-black text-amber-700 flex items-center gap-1">
                    <Coins className="w-5 h-5 fill-amber-400 text-amber-700" />
                    {previewItem.price} Koin
                  </span>
                </div>

                {!inventory.includes(previewItem.id) ? (
                  <ChunkyButton
                    variant="amber"
                    size="lg"
                    fullWidth
                    disabled={coins < previewItem.price}
                    onClick={() => handleBuy(previewItem)}
                    icon={<ShoppingBag className="w-5 h-5" />}
                  >
                    {coins < previewItem.price ? 'Koin Tidak Cukup' : 'Beli Sekarang!'}
                  </ChunkyButton>
                ) : (
                  <div className="p-3 bg-duo-greenLight text-duo-greenDark rounded-2xl text-center font-black text-sm uppercase">
                    Item ini sudah ada di koleksimu!
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
