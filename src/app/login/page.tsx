'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';
import { ChibiAvatar } from '@/components/avatar/ChibiAvatar';
import { UserRole } from '@/types';

export default function LoginPage() {
  const { login, loginAsDemoStudent, loginAsDemoTeacher, loading, error, isSupabaseActive } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await login(email, password, role);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 animate-fadeIn">
      <div className="max-w-md w-full space-y-6">
        {/* BRAND & MASCOT */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="relative"
            >
              <ChibiAvatar size="sm" expression="wink" animated={true} />
            </motion.div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Masuk ke <span className="text-duo-green">Edu</span><span className="text-duo-amber">Quest</span>!
          </h1>
          <p className="text-slate-500 font-bold text-xs sm:text-sm">
            Kumpulkan koin, asah kecerdasanmu, dan kustomisasi avatarmu!
          </p>
        </div>

        {/* ROLE SELECTOR CHUNKY TABS */}
        <div className="grid grid-cols-2 gap-2 bg-slate-200/80 p-1.5 rounded-2xl border-2 border-slate-300">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2 px-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
              role === 'student'
                ? 'bg-white text-duo-greenDark shadow-3d-white border-b-2 border-b-slate-300'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-duo-green" />
            Sebagai Siswa
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`py-2 px-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
              role === 'teacher'
                ? 'bg-white text-duo-purpleDark shadow-3d-white border-b-2 border-b-slate-300'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-duo-purple" />
            Sebagai Guru
          </button>
        </div>

        {/* MAIN LOGIN CARD */}
        <ChunkyCard variant="white" className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-duo-red/10 border-2 border-duo-red/30 text-duo-red font-black text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                Email / Nama Akun
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={role === 'student' ? 'siswa@eduquest.id' : 'guru@eduquest.id'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-300 text-sm font-extrabold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-duo-blue focus:ring-2 focus:ring-duo-blueLight bg-slate-50"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-300 text-sm font-extrabold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-duo-blue focus:ring-2 focus:ring-duo-blueLight bg-slate-50"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <ChunkyButton
              type="submit"
              variant={role === 'student' ? 'green' : 'purple'}
              size="lg"
              fullWidth
              disabled={loading}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              {loading ? 'Memproses...' : 'Masuk Sekarang'}
            </ChunkyButton>
          </form>

          {/* DIVIDER */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase font-black">
              <span className="bg-white px-3 text-slate-400">Atau Uji Coba Cepat</span>
            </div>
          </div>

          {/* QUICK DEMO LOGIN BUTTONS */}
          <div className="grid grid-cols-2 gap-2">
            <ChunkyButton
              variant="amber"
              size="sm"
              onClick={loginAsDemoStudent}
              icon={<Zap className="w-3.5 h-3.5 fill-amber-300" />}
            >
              Demo Siswa
            </ChunkyButton>
            <ChunkyButton
              variant="purple"
              size="sm"
              onClick={loginAsDemoTeacher}
              icon={<ShieldCheck className="w-3.5 h-3.5" />}
            >
              Demo Guru
            </ChunkyButton>
          </div>
        </ChunkyCard>

        {/* REGISTER FOOTER LINK */}
        <div className="text-center font-bold text-xs text-slate-500">
          Belum punya akun?{' '}
          <Link href="/register" className="font-black text-duo-blue hover:underline">
            Daftar Akun EduQuest Baru
          </Link>
        </div>

        {/* BACKEND STATUS BADGE */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-slate-200/80 text-slate-600 border border-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseActive ? 'bg-duo-green' : 'bg-duo-amber animate-pulse'
              }`}
            />
            Backend: {isSupabaseActive ? 'Supabase Terhubung' : 'Demo Mode (Offline Local)'}
          </span>
        </div>
      </div>
    </div>
  );
}

