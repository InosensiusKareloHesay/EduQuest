'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Coins,
  RotateCcw,
  ShoppingBag,
  Shirt,
  HelpCircle,
  Award,
} from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';
import { ChibiAvatar } from '@/components/avatar/ChibiAvatar';

export default function QuizResultPage() {
  const params = useParams();
  const attemptId = params.attemptId as string;

  const quizHistory = useGameStore((s) => s.quizHistory);
  const result = quizHistory.find((r) => r.attempt_id === attemptId);

  useEffect(() => {
    if (result && result.score_percentage >= 60) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [result]);

  if (!result) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Hasil Kuis Tidak Ditemukan</h2>
        <p className="text-xs font-bold text-slate-400">
          Riwayat kuis ini mungkin belum selesai atau sudah terhapus.
        </p>
        <Link href="/quiz">
          <ChunkyButton variant="blue">Kembali ke Arena Kuis</ChunkyButton>
        </Link>
      </div>
    );
  }

  const isPassed = result.score_percentage >= 70;
  const isPerfect = result.score_percentage === 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* RESULT HERO CARD */}
      <div
        className={`relative overflow-hidden rounded-3xl p-8 sm:p-10 text-white text-center border-b-6 shadow-xl ${
          isPassed
            ? 'bg-gradient-to-br from-duo-green to-[#46A302] border-b-[#357c01]'
            : 'bg-gradient-to-br from-duo-amber to-[#CC7800] border-b-[#995a00]'
        }`}
      >
        <div className="space-y-4 max-w-lg mx-auto">
          {/* CELEBRATION MASCOT */}
          <motion.div
            initial={{ scale: 0.8, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="w-24 h-24 mx-auto rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30 shadow-lg"
          >
            <Trophy className="w-12 h-12 text-duo-amber drop-shadow-md animate-bounce-subtle" />
          </motion.div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black">
              {isPerfect
                ? 'Sempurna! Nilai 100! 🎉'
                : isPassed
                ? 'Luar Biasa! Kamu Lulus! 🌟'
                : 'Bagus! Tetap Semangat Belajar! 💪'}
            </h1>
            <p className="text-white/90 text-sm font-bold">
              Kamu telah menyelesaikan seluruh pertanyaan kuis ini.
            </p>
          </div>

          {/* CHUNKY STAT BOXES */}
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto pt-2">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wider text-white/90">Skor Akhir</div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {result.score_percentage}%
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wider text-white/90">Koin Didapat</div>
              <div className="text-3xl sm:text-4xl font-black text-duo-amber flex items-center justify-center gap-1 drop-shadow-sm">
                <Coins className="w-7 h-7 fill-duo-amber" />
                +{result.coins_earned}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Link href="/quiz">
              <ChunkyButton variant="white" icon={<RotateCcw className="w-4 h-4 text-slate-700" />}>
                Main Kuis Lagi
              </ChunkyButton>
            </Link>
            <Link href="/shop">
              <ChunkyButton variant="amber" icon={<ShoppingBag className="w-4 h-4" />}>
                Buka Toko
              </ChunkyButton>
            </Link>
            <Link href="/character">
              <ChunkyButton variant="purple" icon={<Shirt className="w-4 h-4" />}>
                Karakter
              </ChunkyButton>
            </Link>
          </div>
        </div>
      </div>

      {/* SUMMARY 3D CARDS */}
      <div className="grid grid-cols-3 gap-4">
        <ChunkyCard variant="white" className="text-center p-4">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">Total Soal</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{result.total_questions}</div>
        </ChunkyCard>

        <ChunkyCard variant="green" className="text-center p-4">
          <div className="text-xs font-black uppercase tracking-wider text-duo-greenDark">Jawaban Benar</div>
          <div className="text-2xl font-black text-duo-greenDark mt-1">{result.correct_answers}</div>
        </ChunkyCard>

        <ChunkyCard variant="red" className="text-center p-4">
          <div className="text-xs font-black uppercase tracking-wider text-duo-redDark">Jawaban Salah</div>
          <div className="text-2xl font-black text-duo-red mt-1">{result.wrong_answers}</div>
        </ChunkyCard>
      </div>

      {/* QUESTION EXPLANATION REVIEW */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-duo-blue" />
          Pembahasan & Kunci Jawaban
        </h2>

        <div className="space-y-4">
          {result.breakdown.map((item, idx) => (
            <ChunkyCard
              key={idx}
              variant={item.is_correct ? 'white' : 'white'}
              className={`space-y-3 ${
                item.is_correct ? 'border-duo-green/40' : 'border-duo-red/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {item.is_correct ? (
                    <CheckCircle2 className="w-6 h-6 text-duo-green flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-duo-red flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="text-sm font-black text-slate-800">
                    Soal #{idx + 1}: {item.question_text}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-black">
                    <span
                      className={`px-3 py-1 rounded-xl uppercase tracking-wider ${
                        item.is_correct
                          ? 'bg-duo-greenLight text-duo-greenDark'
                          : 'bg-duo-red/10 text-duo-red'
                      }`}
                    >
                      {item.is_correct ? 'Jawabanmu Tepat ✓' : 'Kurang Tepat ✕'}
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl border border-slate-200">
                      Kunci: {item.correct_option.label} ({item.correct_option.text})
                    </span>
                  </div>

                  {item.explanation && (
                    <div className="bg-duo-blueLight/50 p-3.5 rounded-2xl border border-duo-blue/30 text-xs text-slate-700 leading-relaxed font-bold">
                      <span className="text-duo-blueDark font-black">💡 Pembahasan: </span>
                      {item.explanation}
                    </div>
                  )}
                </div>
              </div>
            </ChunkyCard>
          ))}
        </div>
      </div>
    </div>
  );
}
