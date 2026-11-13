'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  ArrowLeft,
  Coins,
  Layers,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import {
  INITIAL_CATEGORIES,
  INITIAL_QUIZ_SETTINGS,
  INITIAL_QUESTIONS,
} from '@/lib/mockData';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';
import { QuizSettings } from '@/types';

export default function AdminQuizSettingsPage() {
  const [settingsMap, setSettingsMap] = useState<Record<string, QuizSettings>>(INITIAL_QUIZ_SETTINGS);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  const handleUpdate = (catId: string, field: keyof QuizSettings, value: number) => {
    const current = settingsMap[catId] || {
      id: 'qs-' + catId,
      category_id: catId,
      total_questions: 10,
      easy_count: 4,
      medium_count: 4,
      hard_count: 2,
      reward_per_correct: 10,
      is_active: true,
    };

    setSettingsMap({
      ...settingsMap,
      [catId]: {
        ...current,
        [field]: value,
      },
    });
  };

  const handleSave = (catId: string) => {
    const setting = settingsMap[catId];
    if (setting.easy_count + setting.medium_count + setting.hard_count !== setting.total_questions) {
      alert('Total komposisi (Mudah + Sedang + Sulit) harus sama dengan Total Soal!');
      return;
    }

    setSavedSuccessId(catId);
    setTimeout(() => {
      setSavedSuccessId(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-4xl mx-auto">
      {/* HEADER */}
      <div>
        <Link
          href="/admin"
          className="text-xs font-black uppercase text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Dashboard
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <Settings className="w-8 h-8 text-duo-amber" />
          Aturan & Komposisi Kuis
        </h1>
        <p className="text-slate-500 font-bold text-xs sm:text-sm">
          Atur jumlah soal, komposisi tingkat kesulitan, dan reward koin per materi.
        </p>
      </div>

      {/* SETTINGS CARDS */}
      <div className="space-y-6">
        {INITIAL_CATEGORIES.map((cat) => {
          const setting = settingsMap[cat.id] || {
            id: 'qs-' + cat.id,
            category_id: cat.id,
            total_questions: 10,
            easy_count: 4,
            medium_count: 4,
            hard_count: 2,
            reward_per_correct: 10,
            is_active: true,
          };

          const publishedEasy = INITIAL_QUESTIONS.filter(
            (q) => q.category_id === cat.id && q.difficulty === 'easy' && q.status === 'published'
          ).length;
          const publishedMed = INITIAL_QUESTIONS.filter(
            (q) => q.category_id === cat.id && q.difficulty === 'medium' && q.status === 'published'
          ).length;
          const publishedHard = INITIAL_QUESTIONS.filter(
            (q) => q.category_id === cat.id && q.difficulty === 'hard' && q.status === 'published'
          ).length;

          const hasEnoughEasy = publishedEasy >= setting.easy_count;
          const hasEnoughMed = publishedMed >= setting.medium_count;
          const hasEnoughHard = publishedHard >= setting.hard_count;

          const isCompositionValid =
            setting.easy_count + setting.medium_count + setting.hard_count ===
            setting.total_questions;

          return (
            <ChunkyCard
              key={cat.id}
              variant="white"
              className="p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-slate-100 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-duo-amberLight text-amber-800 flex items-center justify-center font-bold">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800">{cat.name}</h2>
                    <p className="text-xs font-bold text-slate-400">{cat.description}</p>
                  </div>
                </div>

                {savedSuccessId === cat.id && (
                  <span className="text-xs font-black uppercase text-duo-greenDark bg-duo-greenLight px-3 py-1.5 rounded-xl border border-duo-green/40 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Tersimpan!
                  </span>
                )}
              </div>

              {/* INPUT FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                      Total Soal Diberikan per Sesi
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={setting.total_questions}
                      onChange={(e) =>
                        handleUpdate(cat.id, 'total_questions', parseInt(e.target.value) || 0)
                      }
                      className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-sm font-black focus:outline-none focus:border-duo-amber"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                      Reward Koin per Jawaban Benar
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={setting.reward_per_correct}
                        onChange={(e) =>
                          handleUpdate(
                            cat.id,
                            'reward_per_correct',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-sm font-black focus:outline-none focus:border-duo-amber"
                      />
                      <Coins className="w-5 h-5 fill-duo-amber text-amber-900 absolute right-3.5 top-3.5" />
                    </div>
                  </div>
                </div>

                {/* COMPOSITION */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                    <Layers className="w-4 h-4 text-duo-purple" />
                    Komposisi (Total: {setting.easy_count + setting.medium_count + setting.hard_count}/{setting.total_questions})
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-black text-duo-greenDark block mb-1">
                        Mudah
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={setting.easy_count}
                        onChange={(e) =>
                          handleUpdate(cat.id, 'easy_count', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1.5 rounded-xl border-2 border-duo-green/40 text-xs font-black text-duo-greenDark"
                      />
                      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                        Tersedia: {publishedEasy}
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-black text-amber-800 block mb-1">
                        Sedang
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={setting.medium_count}
                        onChange={(e) =>
                          handleUpdate(cat.id, 'medium_count', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1.5 rounded-xl border-2 border-duo-amber/40 text-xs font-black text-amber-800"
                      />
                      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                        Tersedia: {publishedMed}
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-black text-duo-red block mb-1">
                        Sulit
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={setting.hard_count}
                        onChange={(e) =>
                          handleUpdate(cat.id, 'hard_count', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1.5 rounded-xl border-2 border-duo-red/40 text-xs font-black text-duo-red"
                      />
                      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                        Tersedia: {publishedHard}
                      </span>
                    </div>
                  </div>

                  {(!hasEnoughEasy || !hasEnoughMed || !hasEnoughHard) && (
                    <div className="text-[11px] font-bold text-duo-red bg-duo-red/10 p-2 rounded-xl flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Stok bank soal belum cukup untuk komposisi ini!</span>
                    </div>
                  )}

                  {!isCompositionValid && (
                    <div className="text-[11px] font-bold text-amber-800 bg-duo-amberLight p-2 rounded-xl">
                      * Jumlah Mudah ({setting.easy_count}) + Sedang ({setting.medium_count}) + Sulit ({setting.hard_count}) harus pas {setting.total_questions}!
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <ChunkyButton
                  variant="amber"
                  onClick={() => handleSave(cat.id)}
                  disabled={!isCompositionValid}
                >
                  Simpan Aturan Kuis
                </ChunkyButton>
              </div>
            </ChunkyCard>
          );
        })}
      </div>
    </div>
  );
}
