'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Shirt,
  ShoppingBag,
  Trophy,
  Play,
  CheckCircle2,
  ArrowRight,
  Zap,
  Flame,
  Target,
  Coins,
} from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { ChibiAvatar } from '@/components/avatar/ChibiAvatar';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function HomePage() {
  const profile = useGameStore((s) => s.profile);
  const equipment = useGameStore((s) => s.equipment);
  const coins = useGameStore((s) => s.coins);
  const quizHistory = useGameStore((s) => s.quizHistory);
  const inventory = useGameStore((s) => s.inventory);

  const totalQuizzesDone = quizHistory.length;
  const totalCorrectAnswers = quizHistory.reduce((acc, q) => acc + q.correct_answers, 0);
  const totalCoinsWon = quizHistory.reduce((acc, q) => acc + q.coins_earned, 0);
  const playerLevel = Math.floor(totalQuizzesDone / 2) + 1;
  const levelProgress = ((totalQuizzesDone % 2) / 2) * 100;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* HERO SECTION: DUOLINGO STYLE GAMIFIED BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-duo-green to-[#46A302] border-b-6 border-b-[#357c01] p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* LEFT: GREETING & CALL TO ACTION */}
          <div className="space-y-4 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 backdrop-blur-md text-duo-amber font-black text-xs uppercase tracking-wider border border-white/20">
              <Flame className="w-4 h-4 fill-duo-amber" />
              Tingkat Petualang: Level {playerLevel}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ayo Lanjut Belajar, <br />
              <span className="text-duo-amber drop-shadow-sm">{profile.full_name}</span>!
            </h1>

            <p className="text-white/90 text-sm sm:text-base font-bold leading-relaxed">
              Jawab kuis matematika hari ini, kumpulkan koin reward, dan dandani karakter chibi kesayanganmu!
            </p>

            {/* LEVEL PROGRESS */}
            <div className="bg-black/20 p-3.5 rounded-2xl border border-white/10 max-w-sm space-y-1.5">
              <div className="flex justify-between text-xs font-black uppercase text-white/90">
                <span>Progress Level {playerLevel}</span>
                <span>{totalQuizzesDone % 2}/2 Kuis</span>
              </div>
              <ProgressBar progress={levelProgress || 20} color="amber" height="sm" />
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              <Link href="/quiz">
                <ChunkyButton variant="amber" size="lg" icon={<Play className="w-5 h-5 fill-amber-950" />}>
                  Mulai Kuis Seru
                </ChunkyButton>
              </Link>
              <Link href="/character">
                <ChunkyButton variant="white" size="lg" icon={<Shirt className="w-5 h-5 text-duo-purple" />}>
                  Kamar Ganti
                </ChunkyButton>
              </Link>
            </div>
          </div>

          {/* RIGHT: CHIBI SHOWCASE CARD */}
          <motion.div
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            className="w-64 sm:w-72 bg-white/20 backdrop-blur-md rounded-3xl p-5 border-2 border-white/30 border-b-6 border-b-black/20 shadow-2xl flex flex-col items-center justify-between"
          >
            <div className="w-full flex justify-between items-center text-xs font-black text-white uppercase tracking-wider">
              <span className="bg-black/30 px-3 py-1 rounded-full">Avatar Utama</span>
              <span className="flex items-center gap-1 text-duo-amber">
                ⭐ Lv. {playerLevel}
              </span>
            </div>

            <div className="my-2">
              <ChibiAvatar equipment={equipment} expression="happy" size="md" />
            </div>

            <div className="w-full flex justify-between items-center bg-black/30 px-3 py-2 rounded-2xl text-xs font-black">
              <span className="text-white/90">{inventory.length} Item Koleksi</span>
              <Link href="/shop" className="text-duo-amber hover:underline flex items-center gap-1">
                Buka Toko <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4 PILLARS CARDS (TACTILE 3D) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/quiz">
          <ChunkyCard
            variant="blue"
            interactive
            className="flex flex-col items-center text-center space-y-2"
          >
            <div className="w-14 h-14 rounded-2xl bg-duo-blue text-white flex items-center justify-center shadow-3d-blue border-b-4 border-duo-blueDark">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="text-xs font-black uppercase text-duo-blueDark tracking-wider">1. Belajar</div>
            <div className="text-base font-black text-slate-800">Kuis Pilihan Ganda</div>
            <div className="text-[11px] font-bold text-slate-500">Materi SD & SMP terarah</div>
          </ChunkyCard>
        </Link>

        <Link href="/quiz">
          <ChunkyCard
            variant="green"
            interactive
            className="flex flex-col items-center text-center space-y-2"
          >
            <div className="w-14 h-14 rounded-2xl bg-duo-green text-white flex items-center justify-center shadow-3d-green border-b-4 border-duo-greenDark">
              <Trophy className="w-7 h-7" />
            </div>
            <div className="text-xs font-black uppercase text-duo-greenDark tracking-wider">2. Bermain</div>
            <div className="text-base font-black text-slate-800">Soal Berjenjang</div>
            <div className="text-[11px] font-bold text-slate-500">Tingkat mudah hingga sulit</div>
          </ChunkyCard>
        </Link>

        <Link href="/shop">
          <ChunkyCard
            variant="amber"
            interactive
            className="flex flex-col items-center text-center space-y-2"
          >
            <div className="w-14 h-14 rounded-2xl bg-duo-amber text-amber-950 flex items-center justify-center shadow-3d-amber border-b-4 border-duo-amberDark">
              <Zap className="w-7 h-7 fill-amber-300" />
            </div>
            <div className="text-xs font-black uppercase text-duo-amberDark tracking-wider">3. Menghasilkan</div>
            <div className="text-base font-black text-slate-800">Reward Koin</div>
            <div className="text-[11px] font-bold text-slate-500">Koin tiap jawaban benar</div>
          </ChunkyCard>
        </Link>

        <Link href="/character">
          <ChunkyCard
            variant="purple"
            interactive
            className="flex flex-col items-center text-center space-y-2"
          >
            <div className="w-14 h-14 rounded-2xl bg-duo-purple text-white flex items-center justify-center shadow-3d-purple border-b-4 border-duo-purpleDark">
              <Shirt className="w-7 h-7" />
            </div>
            <div className="text-xs font-black uppercase text-duo-purpleDark tracking-wider">4. Kustomisasi</div>
            <div className="text-base font-black text-slate-800">Avatar Chibi</div>
            <div className="text-[11px] font-bold text-slate-500">Baju, rambut, topi & sayap</div>
          </ChunkyCard>
        </Link>
      </div>

      {/* STATS & RECENT QUIZZES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* STATS WIDGET */}
        <ChunkyCard variant="white" className="space-y-4">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-duo-blue" />
            Statistik Belajarmu
          </h2>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-black uppercase text-slate-500">Sesi Kuis Selesai</span>
              <span className="text-base font-black text-slate-800">{totalQuizzesDone} Sesi</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-duo-greenLight/30 rounded-2xl border border-duo-green/30">
              <span className="text-xs font-black uppercase text-duo-greenDark">Jawaban Benar</span>
              <span className="text-base font-black text-duo-greenDark">{totalCorrectAnswers} Soal</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-duo-amberLight/40 rounded-2xl border border-duo-amber/40">
              <span className="text-xs font-black uppercase text-amber-800">Total Koin Diperoleh</span>
              <span className="text-base font-black text-amber-800 flex items-center gap-1">
                <Coins className="w-4 h-4 fill-amber-400" />
                +{totalCoinsWon}
              </span>
            </div>
          </div>

          <Link href="/shop" className="block pt-2">
            <ChunkyButton variant="amber" fullWidth icon={<ShoppingBag className="w-4 h-4" />}>
              Beli Item di Toko ({coins} Koin)
            </ChunkyButton>
          </Link>
        </ChunkyCard>

        {/* RECENT ACTIVITIES */}
        <ChunkyCard variant="white" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-duo-green" />
              Aktivitas Kuis Terakhir
            </h2>
            <Link href="/history" className="text-xs font-black uppercase text-duo-blue hover:underline">
              Lihat Semua
            </Link>
          </div>

          {quizHistory.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-duo-blueLight text-duo-blue flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-black text-slate-700">Belum ada riwayat kuis</h3>
              <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto">
                Yuk mulai petualanganmu di materi Pecahan Matematika dan dapatkan koin pertamamu!
              </p>
              <Link href="/quiz">
                <ChunkyButton variant="green" size="md">
                  Pilih Kuis Sekarang
                </ChunkyButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {quizHistory.slice(0, 4).map((hist, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/80 hover:bg-duo-blueLight/30 hover:border-duo-blue/30 transition-all"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-black text-slate-800">
                      Kuis #{quizHistory.length - idx}
                    </div>
                    <div className="text-xs font-bold text-slate-500">
                      Nilai:{' '}
                      <span className="font-black text-duo-greenDark">{hist.score_percentage}%</span>{' '}
                      ({hist.correct_answers}/{hist.total_questions} benar)
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 font-black text-amber-900 bg-duo-amber px-3 py-1.5 rounded-xl text-xs border-b-2 border-duo-amberDark">
                      <Coins className="w-3.5 h-3.5 fill-amber-300" />
                      +{hist.coins_earned} Koin
                    </span>

                    <Link href={`/quiz/result/${hist.attempt_id}`}>
                      <ChunkyButton variant="white" size="sm">
                        Detail
                      </ChunkyButton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChunkyCard>
      </div>
    </div>
  );
}
