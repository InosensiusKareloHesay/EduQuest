'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  BookOpen,
  FileQuestion,
  Settings,
  Award,
  BarChart3,
  ArrowRight,
  Sparkles,
  PlusCircle,
} from 'lucide-react';
import {
  INITIAL_SUBJECTS,
  INITIAL_CATEGORIES,
  INITIAL_QUESTIONS,
} from '@/lib/mockData';
import { useGameStore } from '@/stores/useGameStore';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';

export default function AdminDashboardPage() {
  const quizHistory = useGameStore((s) => s.quizHistory);

  const totalSubjects = INITIAL_SUBJECTS.length;
  const totalCategories = INITIAL_CATEGORIES.length;
  const totalQuestions = INITIAL_QUESTIONS.length;
  const publishedQuestions = INITIAL_QUESTIONS.filter((q) => q.status === 'published').length;
  const draftQuestions = totalQuestions - publishedQuestions;
  const totalAttempts = quizHistory.length;

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-6xl mx-auto">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-br from-duo-purple to-purple-800 border-b-6 border-b-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-duo-green" />
            Panel Pengelolaan Guru & Admin
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Dashboard Guru EduQuest</h1>
          <p className="text-purple-100 font-bold text-xs sm:text-sm max-w-xl">
            Kelola kurikulum mata pelajaran, buat kategori materi, susun bank soal berjenjang, dan sesuaikan aturan kuis siswa.
          </p>
        </div>

        <Link href="/admin/questions">
          <ChunkyButton variant="amber" icon={<PlusCircle className="w-4 h-4" />}>
            Buat Soal Baru
          </ChunkyButton>
        </Link>
      </div>

      {/* METRIC STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ChunkyCard variant="white" className="space-y-1 p-5">
          <div className="w-10 h-10 rounded-2xl bg-duo-blueLight text-duo-blue flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-800 pt-2">{totalSubjects}</div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">Mapel Aktif</div>
        </ChunkyCard>

        <ChunkyCard variant="white" className="space-y-1 p-5">
          <div className="w-10 h-10 rounded-2xl bg-duo-purpleLight text-duo-purple flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-800 pt-2">{totalCategories}</div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">Total Kategori</div>
        </ChunkyCard>

        <ChunkyCard variant="white" className="space-y-1 p-5">
          <div className="w-10 h-10 rounded-2xl bg-duo-greenLight text-duo-greenDark flex items-center justify-center font-bold">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-800 pt-2">{publishedQuestions}</div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">
            Soal Ready ({draftQuestions} Draft)
          </div>
        </ChunkyCard>

        <ChunkyCard variant="white" className="space-y-1 p-5">
          <div className="w-10 h-10 rounded-2xl bg-duo-amberLight text-amber-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-800 pt-2">{totalAttempts}</div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">Kuis Dikerjakan</div>
        </ChunkyCard>
      </div>

      {/* QUICK ADMIN NAVIGATION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/subjects">
          <ChunkyCard variant="blue" interactive className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-duo-blue text-white flex items-center justify-center shadow-3d-blue border-b-4 border-duo-blueDark">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-slate-800">Mapel & Kategori</h3>
            <p className="text-xs font-bold text-slate-500">
              Tambah dan ubah kurikulum mata pelajaran serta sub-kategori.
            </p>
            <div className="text-xs font-black uppercase text-duo-blue flex items-center gap-1 pt-1">
              Buka Mapel <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </ChunkyCard>
        </Link>

        <Link href="/admin/questions">
          <ChunkyCard variant="purple" interactive className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-duo-purple text-white flex items-center justify-center shadow-3d-purple border-b-4 border-duo-purpleDark">
              <FileQuestion className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-slate-800">Bank Soal Kuis</h3>
            <p className="text-xs font-bold text-slate-500">
              Kelola soal, opsi A/B/C/D, kunci jawaban, dan tingkat kesulitan.
            </p>
            <div className="text-xs font-black uppercase text-duo-purple flex items-center gap-1 pt-1">
              Buka Soal <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </ChunkyCard>
        </Link>

        <Link href="/admin/quiz-settings">
          <ChunkyCard variant="amber" interactive className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-duo-amber text-amber-950 flex items-center justify-center shadow-3d-amber border-b-4 border-duo-amberDark">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-slate-800">Aturan Kuis</h3>
            <p className="text-xs font-bold text-slate-500">
              Atur komposisi mudah/sedang/sulit dan reward koin per kategori.
            </p>
            <div className="text-xs font-black uppercase text-amber-800 flex items-center gap-1 pt-1">
              Atur Aturan <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </ChunkyCard>
        </Link>

        <Link href="/admin/results">
          <ChunkyCard variant="green" interactive className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-duo-green text-white flex items-center justify-center shadow-3d-green border-b-4 border-duo-greenDark">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-slate-800">Hasil & Rekap Siswa</h3>
            <p className="text-xs font-bold text-slate-500">
              Pantau laporan nilai kuis, akurasi jawaban, dan keaktifan murid.
            </p>
            <div className="text-xs font-black uppercase text-duo-greenDark flex items-center gap-1 pt-1">
              Lihat Rekap <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </ChunkyCard>
        </Link>
      </div>
    </div>
  );
}
