'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { questions, TOPICS, type Topic } from '@/data/questions';
import { loadProgress, getTopicStats } from '@/lib/progress';
import TopicCard from '@/components/TopicCard';

export default function HomePage() {
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const topics = Object.keys(TOPICS) as Topic[];
  const totalQuestions = questions.length;
  const totalAttempted = Object.values(progress.records).filter((r) => r.attempts > 0).length;
  const totalCorrect = Object.values(progress.records).reduce((s, r) => s + r.correct, 0);
  const totalAttempts = Object.values(progress.records).reduce((s, r) => s + r.attempts, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const sessionsCount = progress.sessions.length;

  return (
    <div className="px-4 py-8 max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-violet-300 text-sm font-medium mb-1">Year 9 Maths Revision</p>
        <h1 className="text-white text-3xl font-bold tracking-tight">
          Hi Isla! 👋
        </h1>
        <p className="text-white/50 mt-1 text-sm">
          {sessionsCount === 0
            ? 'Pick a topic below to get started.'
            : `${sessionsCount} session${sessionsCount !== 1 ? 's' : ''} completed. Keep going!`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Questions', value: `${totalAttempted}/${totalQuestions}` },
          { label: 'Accuracy', value: `${overallAccuracy}%` },
          { label: 'Sessions', value: sessionsCount },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/10 rounded-xl p-4 text-center border border-white/10">
            <p className="text-white font-bold text-xl">{value}</p>
            <p className="text-white/50 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick start */}
      <Link
        href="/quiz"
        className="block w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-center font-semibold text-base py-4 rounded-2xl mb-6 transition-colors shadow-lg shadow-violet-900/40"
      >
        ✨ Start Adaptive Quiz
      </Link>

      {/* Topics */}
      <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-3">
        Practice by Topic
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {topics.map((topic) => {
          const topicQs = questions.filter((q) => q.topic === topic);
          const stats = getTopicStats(progress, topic, topicQs.map((q) => q.id));
          return (
            <TopicCard
              key={topic}
              topic={topic}
              total={topicQs.length}
              attempted={stats.attempted}
              accuracy={stats.accuracy}
              mastered={stats.mastered}
            />
          );
        })}
      </div>
    </div>
  );
}
