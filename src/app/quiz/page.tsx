'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calculator,
  FlaskConical,
  BookOpen,
  PieChart,
  PlusCircle,
  Shapes,
  Sparkles,
  Play,
  HelpCircle,
  Coins,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  INITIAL_SUBJECTS,
  INITIAL_CATEGORIES,
  INITIAL_QUIZ_SETTINGS,
  INITIAL_QUESTIONS,
} from '@/lib/mockData';
import { useGameStore } from '@/stores/useGameStore';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';
import { QuestionCategory } from '@/types';

export default function QuizSelectPage() {
  const router = useRouter();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('subj-1'); // Default Matematika
  const startQuizSession = useGameStore((s) => s.startQuizSession);

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-6 h-6" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'PieChart':
        return <PieChart className="w-6 h-6" />;
      case 'PlusCircle':
        return <PlusCircle className="w-6 h-6" />;
      case 'Shapes':
        return <Shapes className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const currentSubject = INITIAL_SUBJECTS.find((s) => s.id === selectedSubjectId);
  const categories = INITIAL_CATEGORIES.filter((c) => c.subject_id === selectedSubjectId);

  const handleStartQuiz = (category: QuestionCategory) => {
    const settings = INITIAL_QUIZ_SETTINGS[category.id] || {
      total_questions: 10,
      easy_count: 4,
      medium_count: 4,
      hard_count: 2,
      reward_per_correct: 10,
    };

    const catQuestions = INITIAL_QUESTIONS.filter(
      (q) => q.category_id === category.id && q.status === 'published'
    );

    const easyQ = catQuestions
      .filter((q) => q.difficulty === 'easy')
      .sort(() => 0.5 - Math.random())
      .slice(0, settings.easy_count);

    const medQ = catQuestions
      .filter((q) => q.difficulty === 'medium')
      .sort(() => 0.5 - Math.random())
      .slice(0, settings.medium_count);

    const hardQ = catQuestions
      .filter((q) => q.difficulty === 'hard')
      .sort(() => 0.5 - Math.random())
      .slice(0, settings.hard_count);

    const merged = [...easyQ, ...medQ, ...hardQ].sort(() => 0.5 - Math.random());
    const finalQuestions =
      merged.length > 0 ? merged : catQuestions.slice(0, settings.total_questions);

    const sessionData = {
      attempt_id: 'attempt-' + Date.now(),
      category_id: category.id,
      category_name: category.name,
      subject_name: currentSubject?.name || 'Matematika',
      total_questions: finalQuestions.length || settings.total_questions,
      reward_per_correct: settings.reward_per_correct,
      questions: finalQuestions.map((q, idx) => ({
        id: q.id,
        order_num: idx + 1,
        question_text: q.question_text,
        difficulty: q.difficulty,
        options: q.options.map((opt) => ({
          id: opt.id,
          option_label: opt.option_label,
          option_text: opt.option_text,
        })),
      })),
    };

    startQuizSession(sessionData);
    router.push(`/quiz/${category.id}`);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
          Arena <span className="text-duo-green">Kuis EduQuest</span>
        </h1>
        <p className="text-slate-500 font-bold text-xs sm:text-sm">
          Pilih mata pelajaran dan materi. Setiap jawaban benar memberimu koin!
        </p>
      </div>

      {/* STEP 1: MATA PELAJARAN TABS */}
      <div className="space-y-3">
        <div className="text-xs font-black uppercase tracking-wider text-slate-400">
          Langkah 1: Pilih Mata Pelajaran
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {INITIAL_SUBJECTS.map((subj) => {
            const isSelected = subj.id === selectedSubjectId;
            return (
              <motion.button
                key={subj.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSubjectId(subj.id)}
                className={`p-5 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${
                  isSelected
                    ? 'bg-white border-duo-blue border-b-6 border-b-duo-blueDark shadow-3d-blue'
                    : 'bg-white border-slate-200 border-b-4 border-b-slate-300 hover:border-slate-300'
                }`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                  style={{ backgroundColor: subj.color }}
                >
                  {getSubjectIcon(subj.icon)}
                </div>

                <div>
                  <div className="text-lg font-black text-slate-800">{subj.name}</div>
                  <div className="text-xs font-bold text-slate-400 line-clamp-1">
                    {subj.description}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: CATEGORIES OF SELECTED SUBJECT */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">
            Langkah 2: Pilih Materi ({currentSubject?.name})
          </div>
          <span className="text-xs font-black uppercase text-duo-blue bg-duo-blueLight px-3 py-1 rounded-full">
            {categories.length} Materi Tersedia
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const settings = INITIAL_QUIZ_SETTINGS[cat.id] || {
              total_questions: 10,
              easy_count: 4,
              medium_count: 4,
              hard_count: 2,
              reward_per_correct: 10,
            };

            return (
              <ChunkyCard
                key={cat.id}
                variant="white"
                className="flex flex-col justify-between space-y-6 hover:border-duo-blue transition-all"
              >
                <div className="space-y-4">
                  {/* CATEGORY ICON & REWARD PILL */}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-duo-blueLight text-duo-blue flex items-center justify-center border-2 border-duo-blue/30">
                      {getCategoryIcon(cat.icon)}
                    </div>

                    <div className="flex items-center gap-1 font-black text-amber-950 bg-duo-amber px-3 py-1 rounded-xl text-xs border-b-2 border-duo-amberDark shadow-sm">
                      <Coins className="w-3.5 h-3.5 fill-amber-300 text-amber-900" />
                      +{settings.reward_per_correct} Koin/Soal
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-800">{cat.name}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">{cat.description}</p>
                  </div>

                  {/* SETTINGS SUMMARY */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200/80 space-y-2 text-xs">
                    <div className="flex justify-between font-black text-slate-600">
                      <span className="flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-duo-blue" />
                        Jumlah Soal:
                      </span>
                      <span className="text-slate-800">{settings.total_questions} Soal</span>
                    </div>

                    <div className="flex justify-between font-black text-slate-600">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-duo-purple" />
                        Komposisi:
                      </span>
                      <div className="flex gap-1 text-[11px]">
                        <span className="text-duo-greenDark bg-duo-greenLight/60 px-1.5 py-0.5 rounded-md">
                          {settings.easy_count} Mudah
                        </span>
                        <span className="text-amber-800 bg-duo-amberLight px-1.5 py-0.5 rounded-md">
                          {settings.medium_count} Sedang
                        </span>
                        <span className="text-duo-redDark bg-duo-red/10 px-1.5 py-0.5 rounded-md">
                          {settings.hard_count} Sulit
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PLAY BUTTON */}
                <ChunkyButton
                  onClick={() => handleStartQuiz(cat)}
                  variant="green"
                  size="md"
                  fullWidth
                  icon={<Play className="w-4 h-4 fill-white" />}
                >
                  Mulai Kuis {cat.name}
                </ChunkyButton>
              </ChunkyCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
