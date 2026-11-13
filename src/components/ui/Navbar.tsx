'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Sparkles,
  Shirt,
  ShoppingBag,
  History,
  ShieldCheck,
  Volume2,
  VolumeX,
  Coins,
  Menu,
  X,
  LogOut,
  User,
  GraduationCap,
} from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const coins = useGameStore((s) => s.coins);
  const userRole = useGameStore((s) => s.userRole);
  const setUserRole = useGameStore((s) => s.setUserRole);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const profile = useGameStore((s) => s.profile);
  const { logout } = useAuth();

  // If on login/register page, keep minimal navbar
  const isAuthPage = pathname === '/login' || pathname === '/register';

  const studentNavItems = [
    { label: 'Beranda', href: '/home', icon: Gamepad2, color: 'text-duo-green' },
    { label: 'Kuis', href: '/quiz', icon: Sparkles, color: 'text-duo-blue' },
    { label: 'Karakter', href: '/character', icon: Shirt, color: 'text-duo-purple' },
    { label: 'Toko', href: '/shop', icon: ShoppingBag, color: 'text-duo-amber' },
    { label: 'Riwayat', href: '/history', icon: History, color: 'text-duo-orange' },
  ];

  const adminNavItems = [
    { label: 'Dashboard', href: '/admin', icon: ShieldCheck, color: 'text-duo-purple' },
    { label: 'Mapel & Kategori', href: '/admin/subjects', icon: Sparkles, color: 'text-duo-blue' },
    { label: 'Bank Soal', href: '/admin/questions', icon: Gamepad2, color: 'text-duo-green' },
    { label: 'Aturan Kuis', href: '/admin/quiz-settings', icon: ShoppingBag, color: 'text-duo-amber' },
    { label: 'Hasil Siswa', href: '/admin/results', icon: History, color: 'text-duo-orange' },
  ];

  const navItems = userRole === 'student' ? studentNavItems : adminNavItems;

  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LOGO (CHUNKY DUOLINGO STYLE) */}
          <Link href="/home" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-2xl bg-duo-green border-b-4 border-duo-greenDark flex items-center justify-center text-white shadow-3d-green"
            >
              <Gamepad2 className="w-7 h-7" />
            </motion.div>
            <div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 block leading-tight">
                Edu<span className="text-duo-green">Quest</span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block -mt-1">
                Belajar · Main · Juara!
              </span>
            </div>
          </Link>

          {!isAuthPage && (
            <>
              {/* DESKTOP NAV TABS (CHUNKY TACTILE) */}
              <nav className="hidden md:flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/home' && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all select-none ${
                        isActive
                          ? 'bg-duo-blueLight text-duo-blueDark border-2 border-duo-blue/30 border-b-4 border-b-duo-blue'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-2 border-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-duo-blue' : item.color}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* RIGHT STATUS (COINS, ROLE SWITCHER, SOUND, PROFILE) */}
              <div className="hidden lg:flex items-center gap-3">
                {/* CHUNKY COIN BADGE */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-duo-amber text-amber-950 font-black px-4 py-2 rounded-2xl border-2 border-duo-amberDark/30 border-b-4 border-b-duo-amberDark shadow-3d-amber select-none"
                >
                  <Coins className="w-5 h-5 fill-amber-300 text-amber-900 animate-wiggle" />
                  <span className="text-base sm:text-lg">{coins}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900/80">
                    Koin
                  </span>
                </motion.div>

                {/* ROLE TOGGLE (STUDENT vs TEACHER) */}
                <div className="flex items-center bg-slate-100 p-1 rounded-2xl border-2 border-slate-200">
                  <button
                    onClick={() => setUserRole('student')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                      userRole === 'student'
                        ? 'bg-white text-duo-greenDark shadow-sm border border-slate-200'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    🎒 Murid
                  </button>
                  <button
                    onClick={() => setUserRole('admin')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                      userRole === 'admin'
                        ? 'bg-white text-duo-purpleDark shadow-sm border border-slate-200'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    🎓 Guru
                  </button>
                </div>

                {/* SOUND BUTTON */}
                <button
                  onClick={toggleSound}
                  title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
                  className="p-2.5 rounded-2xl bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 text-slate-700 active:translate-y-0.5 transition-transform"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-duo-green" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* LOGOUT BUTTON */}
                <button
                  onClick={logout}
                  title="Keluar Akun"
                  className="p-2.5 rounded-2xl bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 text-slate-500 hover:text-duo-red active:translate-y-0.5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* MOBILE TOGGLE & COIN */}
          <div className="flex lg:hidden items-center gap-2">
            {!isAuthPage && (
              <div className="flex items-center gap-1.5 bg-duo-amber text-amber-950 font-black px-3 py-1.5 rounded-xl text-xs border-b-2 border-duo-amberDark">
                <Coins className="w-4 h-4 fill-amber-300 text-amber-900" />
                <span>{coins}</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && !isAuthPage && (
        <div className="lg:hidden bg-white border-t-2 border-slate-200 px-4 pt-3 pb-6 space-y-4">
          <div className="flex items-center justify-between p-2 bg-slate-100 rounded-2xl border border-slate-200">
            <span className="text-xs font-black uppercase text-slate-500">Peran Aktif:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setUserRole('student')}
                className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                  userRole === 'student' ? 'bg-duo-green text-white' : 'text-slate-600'
                }`}
              >
                Murid
              </button>
              <button
                onClick={() => setUserRole('admin')}
                className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                  userRole === 'admin' ? 'bg-duo-purple text-white' : 'text-slate-600'
                }`}
              >
                Guru
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 text-slate-700 font-black text-xs uppercase hover:bg-duo-blueLight"
                >
                  <Icon className="w-4 h-4 text-duo-blue" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="w-full py-2.5 text-center text-xs font-black uppercase text-duo-red bg-duo-red/10 rounded-2xl border border-duo-red/20"
          >
            Keluar Akun
          </button>
        </div>
      )}
    </header>
  );
};
