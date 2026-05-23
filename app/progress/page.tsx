'use client';

import { useEffect, useState } from 'react';
import { questions, TOPICS, type Topic } from '@/data/questions';
import { loadProgress, clearProgress, getTopicStats } from '@/lib/progress';
import type { ProgressState } from '@/lib/progress';

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressState>({ records: {}, sessions: [] });

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const topics = Object.keys(TOPICS) as Topic[];
  const recentSessions = [...progress.sessions].reverse().slice(0, 5);

  const totalAttempts = Object.values(progress.records).reduce((s, r) => s + r.attempts, 0);
  const totalCorrect = Object.values(progress.records).reduce((s, r) => s + r.correct, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  function handleReset() {
    if (confirm('Reset all progress? This cannot be undone.')) {
      clearProgress();
      setProgress({ records: {}, sessions: [] });
    }
  }

  return (
    <div className="px-4 py-8 max-w-xl mx-auto">
      <h1 className="text-white text-2xl font-bold mb-1">Your Progress</h1>
      <p className="text-white/50 text-sm mb-6">
        {totalAttempts === 0 ? 'No questions answered yet.' : `${totalAttempts} questions answered · ${overallAccuracy}% overall accuracy`}
      </p>

      {/* Topic breakdown */}
      <h2 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">By Topic</h2>
      <div className="space-y-3 mb-8">
        {topics.map((topic) => {
          const topicQs = questions.filter((q) => q.topic === topic);
          const stats = getTopicStats(progress, topic, topicQs.map((q) => q.id));
          const pct = stats.accuracy;

          return (
            <div
              key={topic}
              className="bg-white/10 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium flex items-center gap-2">
                  <span>{TOPICS[topic].icon}</span>
                  <span>{TOPICS[topic].label}</span>
                </span>
                <span className="text-white/60 text-sm">
                  {stats.attempted > 0 ? `${pct}%` : '—'}
                </span>
              </div>
              <div className="bg-white/10 rounded-full h-2 mb-1.5">
                <div
                  className="h-2 rounded-full bg-violet-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-white/40 text-xs">
                {stats.attempted === 0
                  ? 'Not started'
                  : `${stats.attempted}/${topicQs.length} attempted · ${stats.mastered} mastered`}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <>
          <h2 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
            Recent Sessions
          </h2>
          <div className="space-y-2 mb-8">
            {recentSessions.map((s, i) => {
              const pct = Math.round((s.correct / s.questionsAnswered) * 100);
              return (
                <div
                  key={i}
                  className="bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between border border-white/10"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {s.correct}/{s.questionsAnswered} correct
                    </p>
                    <p className="text-white/40 text-xs">{formatDate(s.date)}</p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Reset */}
      {totalAttempts > 0 && (
        <button
          onClick={handleReset}
          className="w-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-white/50 hover:text-rose-300 font-medium py-3 rounded-xl transition-all text-sm"
        >
          Reset all progress
        </button>
      )}
    </div>
  );
}
