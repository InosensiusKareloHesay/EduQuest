'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { useGameStore } from '@/stores/useGameStore';
import { UserRole, Profile } from '@/types';
import { sounds } from '@/lib/sounds';

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profile = useGameStore((s) => s.profile);
  const setProfile = useGameStore((s) => s.setProfile);
  const setUserRole = useGameStore((s) => s.setUserRole);
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  // LOGIN METHOD
  const login = async (email: string, password?: string, preferredRole?: UserRole) => {
    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured() && supabase && password) {
        const { data, error: sbError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (sbError) throw sbError;

        if (data.user) {
          // Fetch profile from supabase profiles table
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (userProfile) {
            setProfile(userProfile);
            setUserRole(userProfile.role);
          }
        }
      } else {
        // Fallback / Demo Login
        const role = preferredRole || (email.includes('guru') || email.includes('admin') ? 'teacher' : 'student');
        const demoProfile: Profile = {
          id: 'user-' + Date.now(),
          email,
          full_name: email.split('@')[0].toUpperCase(),
          role: role === 'teacher' ? 'teacher' : 'student',
          coins: 120,
          avatar_skin: '#FFDFC4',
          avatar_expression: 'happy',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(demoProfile);
        setUserRole(demoProfile.role);
      }

      if (soundEnabled) sounds.playFanfare();
      router.push(preferredRole === 'teacher' || preferredRole === 'admin' ? '/admin' : '/home');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal masuk akun. Periksa email & password Anda.';
      setError(message);
      if (soundEnabled) sounds.playWrong();
      return false;
    } finally {
      setLoading(false);
    }
  };

  // REGISTER METHOD
  const register = async (fullName: string, email: string, password?: string, role: UserRole = 'student') => {
    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured() && supabase && password) {
        const { data, error: sbError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role,
            },
          },
        });

        if (sbError) throw sbError;

        if (data.user) {
          const newProfile: Profile = {
            id: data.user.id,
            email,
            full_name: fullName,
            role,
            coins: 100,
            avatar_skin: '#FFDFC4',
            avatar_expression: 'happy',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setProfile(newProfile);
          setUserRole(role);
        }
      } else {
        // Fallback / Demo Register
        const demoProfile: Profile = {
          id: 'user-' + Date.now(),
          email,
          full_name: fullName,
          role,
          coins: 100,
          avatar_skin: '#FFDFC4',
          avatar_expression: 'happy',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(demoProfile);
        setUserRole(role);
      }

      if (soundEnabled) sounds.playFanfare();
      router.push(role === 'student' ? '/home' : '/admin');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mendaftar akun baru.';
      setError(message);
      if (soundEnabled) sounds.playWrong();
      return false;
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT METHOD
  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    router.push('/login');
  };

  // QUICK DEMO LOGINS
  const loginAsDemoStudent = () => {
    login('budi.petualang@eduquest.id', undefined, 'student');
  };

  const loginAsDemoTeacher = () => {
    login('guru.hebat@eduquest.id', undefined, 'teacher');
  };

  return {
    profile,
    loading,
    error,
    login,
    register,
    logout,
    loginAsDemoStudent,
    loginAsDemoTeacher,
    isSupabaseActive: isSupabaseConfigured(),
  };
};

