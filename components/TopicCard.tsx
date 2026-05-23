'use client';

import Link from 'next/link';
import type { Topic } from '@/data/questions';
import { TOPICS } from '@/data/questions';

interface Props {
  topic: Topic;
  total: number;
  attempted: number;
  accuracy: number;
  mastered: number;
}

const colourMap: Record<string, { ring: string; bg: string; text: string; bar: string }> = {
  violet:  { ring: 'ring-violet-400/30',  bg: 'bg-violet-500/10',  text: 'text-violet-300',  bar: 'bg-violet-400' },
  indigo:  { ring: 'ring-indigo-400/30',  bg: 'bg-indigo-500/10',  text: 'text-indigo-300',  bar: 'bg-indigo-400' },
  sky:     { ring: 'ring-sky-400/30',     bg: 'bg-sky-500/10',     text: 'text-sky-300',     bar: 'bg-sky-400' },
  emerald: { ring: 'ring-emerald-400/30', bg: 'bg-emerald-500/10', text: 'text-emerald-300', bar: 'bg-emerald-400' },
  amber:   { ring: 'ring-amber-400/30',   bg: 'bg-amber-500/10',   text: 'text-amber-300',   bar: 'bg-amber-400' },
};

export default function TopicCard({ topic, total, attempted, accuracy, mastered }: Props) {
  const meta = TOPICS[topic];
  const colours = colourMap[meta.colour];
  const pct = attempted > 0 ? accuracy : 0;

  return (
    <Link
      href={`/quiz?topic=${topic}`}
      className={`block rounded-2xl p-5 border ring-1 ${colours.ring} ${colours.bg} border-white/10 hover:bg-white/5 transition-all duration-200 group`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{meta.icon}</span>
        <span className={`text-xs font-bold ${colours.text} bg-white/10 px-2 py-1 rounded-full`}>
          {mastered}/{total} mastered
        </span>
      </div>
      <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-violet-200 transition-colors">
        {meta.label}
      </h3>
      <p className="text-white/50 text-sm mb-4">
        {attempted === 0 ? 'Not started yet' : `${attempted} attempted · ${accuracy}% accuracy`}
      </p>

      {/* Accuracy bar */}
      <div className="bg-white/10 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${colours.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}
