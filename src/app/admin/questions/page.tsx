'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileQuestion,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  X,
  Filter,
} from 'lucide-react';
import {
  INITIAL_QUESTIONS,
  INITIAL_CATEGORIES,
} from '@/lib/mockData';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';
import { Question, DifficultyLevel, QuestionStatus } from '@/types';

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [formState, setFormState] = useState({
    category_id: INITIAL_CATEGORIES[0]?.id || '',
    question_text: '',
    difficulty: 'easy' as DifficultyLevel,
    status: 'published' as QuestionStatus,
    explanation: '',
    optA: '',
    optB: '',
    optC: '',
    optD: '',
    correctLabel: 'A' as 'A' | 'B' | 'C' | 'D',
  });

  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory !== 'all' && q.category_id !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (selectedStatus !== 'all' && q.status !== selectedStatus) return false;
    return true;
  });

  const openAddModal = () => {
    setEditingQuestion(null);
    setFormState({
      category_id: INITIAL_CATEGORIES[0]?.id || '',
      question_text: '',
      difficulty: 'easy',
      status: 'published',
      explanation: '',
      optA: '',
      optB: '',
      optC: '',
      optD: '',
      correctLabel: 'A',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (q: Question) => {
    setEditingQuestion(q);
    const optA = q.options.find((o) => o.option_label === 'A')?.option_text || '';
    const optB = q.options.find((o) => o.option_label === 'B')?.option_text || '';
    const optC = q.options.find((o) => o.option_label === 'C')?.option_text || '';
    const optD = q.options.find((o) => o.option_label === 'D')?.option_text || '';
    const correctOpt = q.options.find((o) => o.is_correct);

    setFormState({
      category_id: q.category_id,
      question_text: q.question_text,
      difficulty: q.difficulty,
      status: q.status,
      explanation: q.explanation || '',
      optA,
      optB,
      optC,
      optD,
      correctLabel: correctOpt?.option_label || 'A',
    });
    setIsModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.question_text || !formState.optA || !formState.optB) return;

    const options = [
      { id: 'opt-a-' + Date.now(), option_label: 'A' as const, option_text: formState.optA, is_correct: formState.correctLabel === 'A', sort_order: 1 },
      { id: 'opt-b-' + Date.now(), option_label: 'B' as const, option_text: formState.optB, is_correct: formState.correctLabel === 'B', sort_order: 2 },
      { id: 'opt-c-' + Date.now(), option_label: 'C' as const, option_text: formState.optC, is_correct: formState.correctLabel === 'C', sort_order: 3 },
      { id: 'opt-d-' + Date.now(), option_label: 'D' as const, option_text: formState.optD, is_correct: formState.correctLabel === 'D', sort_order: 4 },
    ];

    if (editingQuestion) {
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id
            ? {
                ...q,
                category_id: formState.category_id,
                question_text: formState.question_text,
                difficulty: formState.difficulty,
                status: formState.status,
                explanation: formState.explanation,
                options,
              }
            : q
        )
      );
    } else {
      const newQuestion: Question = {
        id: 'q-' + Date.now(),
        category_id: formState.category_id,
        question_text: formState.question_text,
        difficulty: formState.difficulty,
        status: formState.status,
        explanation: formState.explanation,
        options,
      };
      setQuestions([newQuestion, ...questions]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Yakin ingin menghapus soal ini?')) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
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
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FileQuestion className="w-8 h-8 text-duo-purple" />
            Bank Soal Pembelajaran
          </h1>
          <p className="text-slate-500 font-bold text-xs sm:text-sm">
            Total {questions.length} butir soal tersedia dalam kurikulum.
          </p>
        </div>

        <ChunkyButton
          variant="purple"
          size="md"
          onClick={openAddModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Buat Soal Baru
        </ChunkyButton>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-3xl border-2 border-slate-200 border-b-4 border-b-slate-300 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase">
          <Filter className="w-4 h-4" /> Filter:
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-black bg-slate-50 focus:outline-none"
        >
          <option value="all">Semua Kategori</option>
          {INITIAL_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-black bg-slate-50 focus:outline-none"
        >
          <option value="all">Semua Tingkat</option>
          <option value="easy">Mudah (Easy)</option>
          <option value="medium">Sedang (Medium)</option>
          <option value="hard">Sulit (Hard)</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-black bg-slate-50 focus:outline-none"
        >
          <option value="all">Semua Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <span className="ml-auto text-xs font-black text-slate-400 uppercase">
          {filteredQuestions.length} Soal
        </span>
      </div>

      {/* QUESTION CARDS */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const categoryObj = INITIAL_CATEGORIES.find((c) => c.id === q.category_id);

          return (
            <ChunkyCard
              key={q.id}
              variant="white"
              className="space-y-4 p-6 hover:border-duo-purple transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center border border-slate-200">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-black text-duo-purpleDark bg-duo-purpleLight px-2.5 py-1 rounded-xl">
                    {categoryObj?.name || 'Kategori'}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      q.difficulty === 'easy'
                        ? 'bg-duo-greenLight text-duo-greenDark'
                        : q.difficulty === 'medium'
                        ? 'bg-duo-amberLight text-amber-800'
                        : 'bg-duo-red/10 text-duo-red'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      q.status === 'published'
                        ? 'bg-duo-blueLight text-duo-blueDark'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(q)}
                    className="p-2 text-slate-400 hover:text-duo-blue rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-2 text-slate-400 hover:text-duo-red rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-black text-slate-800 leading-snug">
                {q.question_text}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 font-bold ${
                      opt.is_correct
                        ? 'bg-duo-greenLight/50 border-duo-green text-duo-greenDark'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black ${
                        opt.is_correct
                          ? 'bg-duo-green text-white shadow-sm'
                          : 'bg-white border-2 border-slate-200 text-slate-600'
                      }`}
                    >
                      {opt.option_label}
                    </span>
                    <span>{opt.option_text}</span>
                    {opt.is_correct && <span className="ml-auto text-[10px] font-black">✓ KUNCI</span>}
                  </div>
                ))}
              </div>

              {q.explanation && (
                <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-bold">
                  <span className="font-black text-slate-800">Pembahasan: </span>
                  {q.explanation}
                </div>
              )}
            </ChunkyCard>
          );
        })}
      </div>

      {/* MODAL EDIT / TAMBAH SOAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 border-4 border-duo-purple shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>

            <h3 className="text-2xl font-black text-slate-800">
              {editingQuestion ? 'Edit Soal Kuis' : 'Buat Soal Kuis Baru'}
            </h3>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                    Kategori
                  </label>
                  <select
                    value={formState.category_id}
                    onChange={(e) => setFormState({ ...formState, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-xs font-black"
                  >
                    {INITIAL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={formState.difficulty}
                    onChange={(e) =>
                      setFormState({ ...formState, difficulty: e.target.value as DifficultyLevel })
                    }
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-xs font-black"
                  >
                    <option value="easy">Mudah (Easy)</option>
                    <option value="medium">Sedang (Medium)</option>
                    <option value="hard">Sulit (Hard)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                    Status Soal
                  </label>
                  <select
                    value={formState.status}
                    onChange={(e) =>
                      setFormState({ ...formState, status: e.target.value as QuestionStatus })
                    }
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-xs font-black"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                  Pertanyaan
                </label>
                <textarea
                  required
                  placeholder="Ketik soal kuis..."
                  value={formState.question_text}
                  onChange={(e) => setFormState({ ...formState, question_text: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 text-sm font-black focus:outline-none focus:border-duo-purple h-20"
                />
              </div>

              {/* 4 CHOICES */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-600 block">
                  Pilihan Jawaban & Kunci Jawaban
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'A', field: 'optA' as const },
                    { label: 'B', field: 'optB' as const },
                    { label: 'C', field: 'optC' as const },
                    { label: 'D', field: 'optD' as const },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`p-3 rounded-2xl border-2 flex items-center gap-2 ${
                        formState.correctLabel === item.label
                          ? 'border-duo-green bg-duo-greenLight/40'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="correctAnswerRadio"
                        checked={formState.correctLabel === item.label}
                        onChange={() =>
                          setFormState({ ...formState, correctLabel: item.label as 'A' | 'B' | 'C' | 'D' })
                        }
                        className="w-4 h-4 text-duo-green"
                      />
                      <span className="font-black text-xs text-slate-700">{item.label}:</span>
                      <input
                        type="text"
                        required
                        placeholder={`Jawaban ${item.label}`}
                        value={formState[item.field]}
                        onChange={(e) =>
                          setFormState({ ...formState, [item.field]: e.target.value })
                        }
                        className="w-full px-2 py-1 text-xs font-bold bg-transparent border-b border-slate-300 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[11px] font-bold text-slate-400">
                  * Klik bulatan radio untuk menentukan kunci jawaban yang benar.
                </p>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-600 block mb-1">
                  Pembahasan Jawaban (Opsional)
                </label>
                <textarea
                  placeholder="Penjelasan edukatif..."
                  value={formState.explanation}
                  onChange={(e) => setFormState({ ...formState, explanation: e.target.value })}
                  className="w-full px-4 py-2 rounded-2xl border-2 border-slate-300 text-xs font-bold focus:outline-none focus:border-duo-purple h-16"
                />
              </div>

              <ChunkyButton variant="purple" type="submit" fullWidth>
                Simpan Soal ke Bank Soal
              </ChunkyButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
