'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Sparkles,
  ArrowLeft,
  FolderPlus,
  X,
} from 'lucide-react';
import { INITIAL_SUBJECTS, INITIAL_CATEGORIES } from '@/lib/mockData';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';
import { Subject, QuestionCategory } from '@/types';

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [categories, setCategories] = useState<QuestionCategory[]>(INITIAL_CATEGORIES);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    slug: '',
    color: '#3B82F6',
    description: '',
  });

  const [categoryForm, setCategoryForm] = useState({
    subject_id: INITIAL_SUBJECTS[0]?.id || '',
    name: '',
    slug: '',
    description: '',
  });

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.name) return;

    const newSubject: Subject = {
      id: 'subj-' + Date.now(),
      name: subjectForm.name,
      slug: subjectForm.slug || subjectForm.name.toLowerCase().replace(/\s+/g, '-'),
      color: subjectForm.color,
      icon: 'BookOpen',
      description: subjectForm.description,
      is_active: true,
    };

    setSubjects([...subjects, newSubject]);
    setIsSubjectModalOpen(false);
    setSubjectForm({ name: '', slug: '', color: '#3B82F6', description: '' });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.subject_id) return;

    const newCategory: QuestionCategory = {
      id: 'cat-' + Date.now(),
      subject_id: categoryForm.subject_id,
      name: categoryForm.name,
      slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
      icon: 'PieChart',
      description: categoryForm.description,
      is_active: true,
    };

    setCategories([...categories, newCategory]);
    setIsCategoryModalOpen(false);
    setCategoryForm({ subject_id: subjects[0]?.id || '', name: '', slug: '', description: '' });
  };

  const toggleSubjectActive = (id: string) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="text-xs font-black uppercase text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Mata Pelajaran & Kategori
          </h1>
          <p className="text-slate-500 font-bold text-xs sm:text-sm">
            Kurikulum dinamis untuk pengelolaan kuis pembelajaran.
          </p>
        </div>

        <div className="flex gap-2">
          <ChunkyButton
            variant="blue"
            size="md"
            onClick={() => setIsSubjectModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Tambah Mapel
          </ChunkyButton>
          <ChunkyButton
            variant="purple"
            size="md"
            onClick={() => setIsCategoryModalOpen(true)}
            icon={<FolderPlus className="w-4 h-4" />}
          >
            Tambah Kategori
          </ChunkyButton>
        </div>
      </div>

      {/* LIST OF SUBJECTS & CATEGORIES */}
      <div className="space-y-6">
        {subjects.map((subj) => {
          const subjCategories = categories.filter((c) => c.subject_id === subj.id);

          return (
            <ChunkyCard key={subj.id} variant="white" className="p-0 overflow-hidden space-y-0">
              <div className="p-6 bg-slate-50 border-b-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md font-black"
                    style={{ backgroundColor: subj.color }}
                  >
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-slate-800">{subj.name}</h2>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          subj.is_active
                            ? 'bg-duo-greenLight text-duo-greenDark'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {subj.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-400">{subj.description}</p>
                  </div>
                </div>

                <ChunkyButton
                  variant="white"
                  size="sm"
                  onClick={() => toggleSubjectActive(subj.id)}
                >
                  {subj.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                </ChunkyButton>
              </div>

              {/* CATEGORIES */}
              <div className="p-6 space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Sub-Kategori ({subjCategories.length})
                </div>

                {subjCategories.length === 0 ? (
                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center text-xs text-slate-400 font-bold">
                    Belum ada kategori untuk mapel ini.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subjCategories.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-4 rounded-2xl border-2 border-slate-200 bg-white flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-duo-purpleLight text-duo-purpleDark flex items-center justify-center font-bold">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-black text-sm text-slate-800">{cat.name}</div>
                            <div className="text-[11px] font-bold text-slate-400 line-clamp-1">
                              {cat.description}
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/admin/questions?category=${cat.id}`}
                          className="text-xs font-black text-duo-blue hover:underline"
                        >
                          Soal
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ChunkyCard>
          );
        })}
      </div>

      {/* MODAL TAMBAH MAPEL */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border-4 border-duo-blue shadow-2xl relative">
            <button
              onClick={() => setIsSubjectModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>

            <h3 className="text-xl font-black text-slate-800">Tambah Mata Pelajaran</h3>

            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                  Nama Mata Pelajaran
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Matematika"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-sm font-extrabold focus:outline-none focus:border-duo-blue"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                  Warna Tema
                </label>
                <div className="flex gap-2">
                  {['#58CC02', '#1CB0F6', '#FFC800', '#CE82FF', '#FF4B4B'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSubjectForm({ ...subjectForm, color: c })}
                      className={`w-8 h-8 rounded-xl border-2 transition-all ${
                        subjectForm.color === c ? 'border-slate-800 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                  Deskripsi
                </label>
                <textarea
                  placeholder="Deskripsi materi pembelajaran..."
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-2xl border-2 border-slate-300 text-sm font-bold focus:outline-none focus:border-duo-blue h-20"
                />
              </div>

              <ChunkyButton variant="blue" type="submit" fullWidth>
                Simpan Mata Pelajaran
              </ChunkyButton>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH KATEGORI */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border-4 border-duo-purple shadow-2xl relative">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>

            <h3 className="text-xl font-black text-slate-800">Tambah Kategori Baru</h3>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                  Pilih Mata Pelajaran Induk
                </label>
                <select
                  value={categoryForm.subject_id}
                  onChange={(e) => setCategoryForm({ ...categoryForm, subject_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-sm font-extrabold focus:outline-none focus:border-duo-purple"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pecahan, Operasi Hitung"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-sm font-extrabold focus:outline-none focus:border-duo-purple"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                  Deskripsi
                </label>
                <textarea
                  placeholder="Deskripsi materi kategori..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-2xl border-2 border-slate-300 text-sm font-bold focus:outline-none focus:border-duo-purple h-20"
                />
              </div>

              <ChunkyButton variant="purple" type="submit" fullWidth>
                Simpan Kategori
              </ChunkyButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
