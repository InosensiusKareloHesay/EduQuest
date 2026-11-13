'use client';

import React from 'react';
import Link from 'next/link';
import {
  History,
  Coins,
  ArrowRight,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';

export default function HistoryPage() {
  const quizHistory = useGameStore((s) => s.quizHistory);
  const coins = useGameStore((s) => s.coins);

  const avgScore =
    quizHistory.length > 0
      ? Math.round(
          quizHistory.reduce((acc, q) => acc + q.score_percentage, 0) /
            quizHistory.length
        )
      : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <History className="w-8 h-8 text-duo-blue" />
            Riwayat & Prestasi
          </h1>
          <p className="text-slate-500 font-bold text-xs sm:text-sm">
            Pantau seluruh sesi kuis yang telah kamu selesaikan.
          </p>
        </div>

        <Link href="/quiz">
          <ChunkyButton variant="green">Mulai Kuis Baru</ChunkyButton>
        </Link>
      </div>

      {/* SUMMARY 3D STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ChunkyCard variant="white" className="text-center p-5">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">Total Kuis Selesai</div>
          <div className="text-3xl font-black text-slate-800 mt-1">{quizHistory.length} Sesi</div>
        </ChunkyCard>

        <ChunkyCard variant="green" className="text-center p-5">
          <div className="text-xs font-black uppercase tracking-wider text-duo-greenDark">Rata-Rata Nilai</div>
          <div className="text-3xl font-black text-duo-greenDark mt-1">{avgScore}%</div>
        </ChunkyCard>

        <ChunkyCard variant="amber" className="text-center p-5">
          <div className="text-xs font-black uppercase tracking-wider text-amber-900">Total Koin Terkumpul</div>
          <div className="text-3xl font-black text-amber-900 mt-1 flex items-center justify-center gap-1">
            <Coins className="w-7 h-7 fill-duo-amber" />
            {quizHistory.reduce((acc, q) => acc + q.coins_earned, 0)}
          </div>
        </ChunkyCard>
      </div>

      {/* QUIZ ATTEMPTS LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-800">Daftar Hasil Sesi Kuis</h2>

        {quizHistory.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-duo-blueLight text-duo-blue flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="font-black text-slate-700">Belum ada aktivitas kuis</h3>
            <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto">
              Selesaikan kuis pertamamu untuk melihat evaluasi hasil belajar di halaman ini!
            </p>
            <Link href="/quiz">
              <ChunkyButton variant="green" size="md">
                Pilih Kuis Sekarang
              </ChunkyButton>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {quizHistory.map((item, idx) => (
              <ChunkyCard
                key={item.attempt_id}
                variant="white"
                className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 hover:border-duo-blue"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-base text-white flex-shrink-0 ${
                      item.score_percentage >= 80
                        ? 'bg-duo-green shadow-3d-green'
                        : item.score_percentage >= 60
                        ? 'bg-duo-blue shadow-3d-blue'
                        : 'bg-duo-red shadow-3d-red'
                    }`}
                  >
                    {item.score_percentage}%
                  </div>

                  <div>
                    <div className="text-base font-black text-slate-800">
                      Sesi Kuis #{quizHistory.length - idx}
                    </div>
                    <div className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{item.correct_answers} dari {item.total_questions} benar</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.completed_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <div className="font-black text-amber-900 bg-duo-amber px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 border-b-2 border-duo-amberDark shadow-sm">
                    <Coins className="w-4 h-4 fill-amber-300" />
                    +{item.coins_earned} Koin
                  </div>

                  <Link href={`/quiz/result/${item.attempt_id}`}>
                    <ChunkyButton variant="white" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                      Review
                    </ChunkyButton>
                  </Link>
                </div>
              </ChunkyCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
