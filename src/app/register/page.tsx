'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Lock,
  Mail,
  User,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';
import { ChibiAvatar } from '@/components/avatar/ChibiAvatar';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const { register, loading, error } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;
    await register(fullName, email, password, role);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 animate-fadeIn">
      <div className="max-w-md w-full space-y-6">
        {/* BRAND & MASCOT */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              <ChibiAvatar size="sm" expression={fullName ? 'excited' : 'happy'} animated={true} />
            </motion.div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Buat Akun <span className="text-duo-green">Baru</span>!
          </h1>
          <p className="text-slate-500 font-bold text-xs sm:text-sm">
            Dapatkan bonus 100 koin awal dan karakter chibi pertamamu!
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
            Daftar Siswa
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
            Daftar Guru
          </button>
        </div>

        {/* MAIN REGISTER CARD */}
        <ChunkyCard variant="white" className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-duo-red/10 border-2 border-duo-red/30 text-duo-red font-black text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                Nama Lengkap / Panggilan
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Pintar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-300 text-sm font-extrabold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-duo-blue focus:ring-2 focus:ring-duo-blueLight bg-slate-50"
                />
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
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
                  placeholder="Minimal 6 karakter"
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
              icon={<Sparkles className="w-5 h-5" />}
            >
              {loading ? 'Mendaftarkan...' : 'Daftar & Mulai Petualangan'}
            </ChunkyButton>
          </form>
        </ChunkyCard>

        {/* LOGIN LINK */}
        <div className="text-center font-bold text-xs text-slate-500">
          Sudah punya akun sebelumnya?{' '}
          <Link href="/login" className="font-black text-duo-blue hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}

