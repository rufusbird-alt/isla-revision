'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { questions, type Topic } from '@/data/questions';
import { loadProgress, recordAnswer, saveProgress, saveSession } from '@/lib/progress';
import { buildQuizSession } from '@/lib/adaptive';
import QuestionCard from '@/components/QuestionCard';
import type { Question } from '@/data/questions';
import type { SessionRecord } from '@/lib/progress';

const SESSION_SIZE = 10;

function QuizContent() {
  const router = useRouter();
  const params = useSearchParams();
  const topic = (params.get('topic') ?? undefined) as Topic | undefined;

  const [session, setSession] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const progress = loadProgress();
    const qs = buildQuizSession(questions, progress, SESSION_SIZE, topic);
    setSession(qs);
    setIndex(0);
    setResults([]);
    setDone(false);
  }, [topic]);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      const current = session[index];
      const progress = loadProgress();
      const updated = recordAnswer(progress, current.id, correct);
      saveProgress(updated);

      const newResults = [...results, correct];
      setResults(newResults);

      if (index + 1 >= session.length) {
        const sessionRecord: SessionRecord = {
          date: Date.now(),
          questionsAnswered: session.length,
          correct: newResults.filter(Boolean).length,
          topics: [...new Set(session.map((q) => q.topic))],
        };
        const withSession = saveSession(updated, sessionRecord);
        saveProgress(withSession);
        setDone(true);
      } else {
        setIndex((i) => i + 1);
      }
    },
    [session, index, results],
  );

  if (session.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (done) {
    const correct = results.filter(Boolean).length;
    const pct = Math.round((correct / session.length) * 100);
    const emoji = pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '💪';
    const message =
      pct >= 80 ? 'Brilliant work!' : pct >= 60 ? 'Good effort — keep going!' : "Don't worry, practice makes perfect!";

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="text-7xl mb-6">{emoji}</div>
        <h2 className="text-white text-3xl font-bold mb-2">Session complete!</h2>
        <p className="text-white/60 mb-6">{message}</p>
        <div className="bg-white/10 rounded-2xl p-6 mb-8 w-full max-w-xs border border-white/20">
          <p className="text-5xl font-bold text-white mb-1">{pct}%</p>
          <p className="text-white/50">
            {correct} of {session.length} correct
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => {
              const progress = loadProgress();
              const qs = buildQuizSession(questions, progress, SESSION_SIZE, topic);
              setSession(qs);
              setIndex(0);
              setResults([]);
              setDone(false);
            }}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-4 rounded-2xl transition-colors"
          >
            Go again
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-white/10 hover:bg-white/15 text-white font-semibold py-4 rounded-2xl transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-xl mx-auto">
      {/* Topic badge */}
      {topic && (
        <p className="text-center text-violet-300 text-sm font-medium mb-4 capitalize">
          {topic.replace('-', ' ')} practice
        </p>
      )}
      {!topic && (
        <p className="text-center text-violet-300 text-sm font-medium mb-4">
          Adaptive quiz
        </p>
      )}

      <QuestionCard
        question={session[index]}
        questionNumber={index + 1}
        total={session.length}
        onAnswer={handleAnswer}
      />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense>
      <QuizContent />
    </Suspense>
  );
}
