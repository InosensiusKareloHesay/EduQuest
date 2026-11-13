'use client';

import React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  ArrowLeft,
  Coins,
  BookOpen,
} from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';

export default function AdminResultsPage() {
  const quizHistory = useGameStore((s) => s.quizHistory);
  const profile = useGameStore((s) => s.profile);

  const totalAttempts = quizHistory.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          quizHistory.reduce((acc, q) => acc + q.score_percentage, 0) / totalAttempts
        )
      : 0;

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-5xl mx-auto">
      {/* HEADER */}
      <div>
        <Link
          href="/admin"
          className="text-xs font-black uppercase text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Dashboard
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-duo-green" />
          Laporan Hasil & Aktivitas Siswa
        </h1>
        <p className="text-slate-500 font-bold text-xs sm:text-sm">
          Monitoring skor pengerjaan kuis, persentase nilai, dan keaktifan murid.
        </p>
      </div>

      {/* METRIC OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ChunkyCard variant="white" className="text-center p-5">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">Total Kuis Dikerjakan</div>
          <div className="text-3xl font-black text-slate-800 mt-1">{totalAttempts}</div>
        </ChunkyCard>

        <ChunkyCard variant="green" className="text-center p-5">
          <div className="text-xs font-black uppercase tracking-wider text-duo-greenDark">Rata-Rata Nilai</div>
          <div className="text-3xl font-black text-duo-greenDark mt-1">{avgScore}%</div>
        </ChunkyCard>

        <ChunkyCard variant="amber" className="text-center p-5">
          <div className="text-xs font-black uppercase tracking-wider text-amber-900">Total Koin Reward</div>
          <div className="text-3xl font-black text-amber-900 mt-1 flex items-center justify-center gap-1">
            <Coins className="w-7 h-7 fill-duo-amber" />
            {quizHistory.reduce((acc, q) => acc + q.coins_earned, 0)}
          </div>
        </ChunkyCard>
      </div>

      {/* DETAILED RESULTS TABLE */}
      <ChunkyCard variant="white" className="p-0 overflow-hidden">
        <div className="p-6 border-b-2 border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800">
            Riwayat Pengerjaan Kuis Siswa
          </h2>
          <span className="text-xs font-black uppercase text-slate-400">
            {quizHistory.length} Record
          </span>
        </div>

        {quizHistory.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-700">Belum ada aktivitas pengerjaan kuis</h3>
            <p className="text-xs font-bold text-slate-400">
              Hasil pengerjaan kuis oleh siswa akan langsung tercatat otomatis di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-wider border-b-2 border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4">Kuis</th>
                  <th className="py-3.5 px-4">Nilai & Akurasi</th>
                  <th className="py-3.5 px-4">Reward Koin</th>
                  <th className="py-3.5 px-4">Waktu Selesai</th>
                  <th className="py-3.5 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-extrabold text-slate-700">
                {quizHistory.map((item) => (
                  <tr key={item.attempt_id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-800">
                      {profile.full_name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-duo-blueLight text-duo-blueDark px-2.5 py-1 rounded-xl font-black">
                        Pecahan (Matematika)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black ${
                            item.score_percentage >= 70
                              ? 'text-duo-greenDark'
                              : 'text-amber-800'
                          }`}
                        >
                          {item.score_percentage}%
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          ({item.correct_answers}/{item.total_questions} benar)
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-amber-800 font-black flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 fill-duo-amber" />
                        +{item.coins_earned} Koin
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(item.completed_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/quiz/result/${item.attempt_id}`}
                        className="text-xs font-black text-duo-blue hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChunkyCard>
    </div>
  );
}
