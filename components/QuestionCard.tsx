'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Question } from '@/data/questions';

interface Props {
  question: Question;
  questionNumber: number;
  total: number;
  onAnswer: (correct: boolean) => void;
}

export default function QuestionCard({ question, questionNumber, total, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = selected === question.answer;

  function handleSelect(opt: string) {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    setTimeout(() => {
      onAnswer(opt === question.answer);
      setSelected(null);
      setShowResult(false);
      setShowHint(false);
    }, 1800);
  }

  const difficultyLabel = ['', 'Foundation', 'Higher', 'Challenge'][question.difficulty];
  const difficultyColour = ['', 'text-emerald-400', 'text-amber-400', 'text-rose-400'][question.difficulty];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 bg-white/10 rounded-full h-2">
          <div
            className="bg-violet-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / total) * 100}%` }}
          />
        </div>
        <span className="text-white/60 text-sm font-medium">{questionNumber}/{total}</span>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            {question.subtopic}
          </span>
          <span className={`text-xs font-semibold ${difficultyColour}`}>
            {difficultyLabel} · {question.marks} mark{question.marks !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Question text */}
        <p className="text-white text-lg font-medium leading-relaxed mb-4">
          {question.question}
        </p>

        {/* Optional image */}
        {question.image && (
          <div className="mb-4 rounded-xl overflow-hidden bg-white/5">
            <Image
              src={question.image}
              alt="Question diagram"
              width={600}
              height={400}
              className="w-full object-contain max-h-56"
            />
          </div>
        )}

        {/* Hint */}
        {question.hint && !showResult && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-violet-300 text-sm mb-4 flex items-center gap-1 hover:text-violet-200 transition-colors"
          >
            <span>💡</span>
            <span>{showHint ? 'Hide hint' : 'Show hint'}</span>
          </button>
        )}
        {showHint && question.hint && !showResult && (
          <p className="text-violet-200 text-sm bg-violet-900/30 rounded-lg px-4 py-2 mb-4">
            {question.hint}
          </p>
        )}

        {/* Options */}
        {question.type === 'multiple-choice' && question.options && (
          <div className="grid grid-cols-1 gap-3 mt-2">
            {question.options.map((opt) => {
              let cls =
                'w-full text-left px-5 py-3 rounded-xl border font-medium transition-all duration-200 ';

              if (!showResult) {
                cls += 'border-white/20 text-white hover:bg-white/10 hover:border-white/40 cursor-pointer';
              } else if (opt === question.answer) {
                cls += 'border-emerald-400 bg-emerald-500/20 text-emerald-300';
              } else if (opt === selected) {
                cls += 'border-rose-400 bg-rose-500/20 text-rose-300';
              } else {
                cls += 'border-white/10 text-white/40';
              }

              return (
                <button key={opt} className={cls} onClick={() => handleSelect(opt)}>
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Result feedback */}
        {showResult && (
          <div className={`mt-5 rounded-xl px-5 py-4 ${isCorrect ? 'bg-emerald-500/20 border border-emerald-400/40' : 'bg-rose-500/20 border border-rose-400/40'}`}>
            <p className={`font-semibold mb-1 ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
              {isCorrect ? '✓ Correct!' : '✗ Not quite'}
            </p>
            {question.explanation && (
              <p className="text-white/70 text-sm">{question.explanation}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
