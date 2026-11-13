'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Coins,
  X,
  AlertCircle,
} from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ChunkyCard } from '@/components/ui/ChunkyCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { INITIAL_QUESTIONS } from '@/lib/mockData';
import { sounds } from '@/lib/sounds';

export default function ActiveQuizPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId as string;

  const activeQuizSession = useGameStore((s) => s.activeQuizSession);
  const quizAnswers = useGameStore((s) => s.quizAnswers);
  const selectQuizAnswer = useGameStore((s) => s.selectQuizAnswer);
  const recordQuizResult = useGameStore((s) => s.recordQuizResult);
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!activeQuizSession) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQuizSession]);

  if (!activeQuizSession || activeQuizSession.category_id !== categoryId) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-duo-red/10 text-duo-red flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Sesi Kuis Belum Dimulai</h2>
        <p className="text-xs font-bold text-slate-400">
          Silakan pilih materi kuis dari arena kuis terlebih dahulu.
        </p>
        <ChunkyButton onClick={() => router.push('/quiz')} variant="blue">
          Kembali ke Arena Kuis
        </ChunkyButton>
      </div>
    );
  }

  const currentQuestion = activeQuizSession.questions[currentIndex];
  const totalQuestions = activeQuizSession.questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const selectedOptionId = quizAnswers[currentQuestion.id];
  const answeredCount = Object.keys(quizAnswers).length;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (optionId: string) => {
    if (soundEnabled) sounds.playClick();
    selectQuizAnswer(currentQuestion.id, optionId);
  };

  const handleSubmitQuiz = () => {
    setIsSubmitting(true);

    let correctCount = 0;
    const breakdown = activeQuizSession.questions.map((q) => {
      const originalQ = INITIAL_QUESTIONS.find((item) => item.id === q.id);
      const chosenOptId = quizAnswers[q.id];
      const correctOpt = originalQ?.options.find((opt) => opt.is_correct);
      const isCorrect = chosenOptId === correctOpt?.id;

      if (isCorrect) correctCount += 1;

      return {
        question_id: q.id,
        question_text: q.question_text,
        explanation: originalQ?.explanation || 'Belum ada penjelasan materi.',
        selected_option_id: chosenOptId || null,
        is_correct: isCorrect,
        correct_option: {
          id: correctOpt?.id || '',
          label: correctOpt?.option_label || 'A',
          text: correctOpt?.option_text || '',
        },
      };
    });

    const rewardPerCorrect = activeQuizSession.reward_per_correct || 10;
    const coinsEarned = correctCount * rewardPerCorrect;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    const result = {
      attempt_id: activeQuizSession.attempt_id,
      category_id: categoryId,
      total_questions: totalQuestions,
      correct_answers: correctCount,
      wrong_answers: totalQuestions - correctCount,
      score_percentage: scorePercentage,
      coins_earned: coinsEarned,
      breakdown,
      completed_at: new Date().toISOString(),
    };

    recordQuizResult(result);
    if (soundEnabled) sounds.playCorrect();

    router.push(`/quiz/result/${activeQuizSession.attempt_id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* DUOLINGO STYLE TOP PROGRESS HEADER */}
      <div className="flex items-center gap-4 py-2">
        <button
          onClick={() => {
            if (confirm('Keluar dari kuis ini? Progress kuis tidak akan tersimpan.')) {
              router.push('/quiz');
            }
          }}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        {/* PROGRESS BAR */}
        <div className="flex-1">
          <ProgressBar progress={progressPercent} color="green" height="lg" />
        </div>

        {/* TIMER PILL */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 text-xs font-black text-slate-700 shadow-sm">
          <Clock className="w-4 h-4 text-duo-blue" />
          <span>{formatTimer(secondsLeft)}</span>
        </div>

        {/* REWARD PILL */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-duo-amber text-amber-950 border-b-4 border-duo-amberDark text-xs font-black shadow-sm">
          <Coins className="w-4 h-4 fill-amber-300 text-amber-900" />
          <span>+{activeQuizSession.reward_per_correct}</span>
        </div>
      </div>

      {/* QUESTION CARD */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          <ChunkyCard variant="white" className="space-y-6 p-6 sm:p-8">
            {/* DIFFICULTY & QUESTION NUM */}
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl border-b-2 ${
                  currentQuestion.difficulty === 'easy'
                    ? 'bg-duo-greenLight text-duo-greenDark border-duo-green'
                    : currentQuestion.difficulty === 'medium'
                    ? 'bg-duo-amberLight text-amber-800 border-duo-amber'
                    : 'bg-duo-red/10 text-duo-red border-duo-red'
                }`}
              >
                Tingkat: {currentQuestion.difficulty}
              </span>

              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Soal {currentIndex + 1} dari {totalQuestions}
              </span>
            </div>

            {/* QUESTION TEXT */}
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
              {currentQuestion.question_text}
            </h2>

            {/* 4 CHOICES (CHUNKY DUOLINGO BUTTONS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`flex items-center gap-4 p-4 rounded-3xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bg-duo-blueLight border-duo-blue border-b-6 border-b-duo-blueDark text-duo-blueDark shadow-3d-blue'
                        : 'bg-white border-slate-200 border-b-4 border-b-slate-300 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-duo-blue text-white shadow-sm'
                          : 'bg-slate-100 border-2 border-slate-200 text-slate-600'
                      }`}
                    >
                      {opt.option_label}
                    </div>
                    <span className="font-extrabold text-sm sm:text-base">{opt.option_text}</span>
                  </motion.button>
                );
              })}
            </div>
          </ChunkyCard>
        </motion.div>
      </AnimatePresence>

      {/* BOTTOM ACTION BAR */}
      <div className="flex items-center justify-between pt-2">
        <ChunkyButton
          variant="white"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Kembali
        </ChunkyButton>

        {currentIndex < totalQuestions - 1 ? (
          <ChunkyButton
            variant="blue"
            size="lg"
            onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Lanjut
          </ChunkyButton>
        ) : (
          <ChunkyButton
            variant="green"
            size="lg"
            disabled={isSubmitting}
            onClick={handleSubmitQuiz}
            icon={<CheckCircle className="w-5 h-5" />}
          >
            {isSubmitting ? 'Memeriksa...' : 'Kirim Jawaban!'}
          </ChunkyButton>
        )}
      </div>

      {/* QUICK QUESTION NAVIGATOR PILLS */}
      <div className="bg-white p-3 rounded-2xl border-2 border-slate-200 border-b-4 border-b-slate-300 flex flex-wrap gap-2 justify-center">
        {activeQuizSession.questions.map((q, idx) => {
          const isAnswered = !!quizAnswers[q.id];
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-xl font-black text-xs transition-all ${
                isCurrent
                  ? 'bg-duo-blue text-white shadow-3d-blue'
                  : isAnswered
                  ? 'bg-duo-greenLight text-duo-greenDark border-2 border-duo-green/40'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
