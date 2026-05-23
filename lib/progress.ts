'use client';

import type { Topic } from '@/data/questions';

export interface QuestionRecord {
  questionId: string;
  attempts: number;
  correct: number;
  lastSeen: number;
  streak: number;
}

export interface SessionRecord {
  date: number;
  questionsAnswered: number;
  correct: number;
  topics: Topic[];
}

export interface ProgressState {
  records: Record<string, QuestionRecord>;
  sessions: SessionRecord[];
}

const STORAGE_KEY = 'isla-maths-progress';

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return { records: {}, sessions: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { records: {}, sessions: [] };
    return JSON.parse(raw) as ProgressState;
  } catch {
    return { records: {}, sessions: [] };
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function recordAnswer(
  state: ProgressState,
  questionId: string,
  correct: boolean,
): ProgressState {
  const existing = state.records[questionId] ?? {
    questionId,
    attempts: 0,
    correct: 0,
    lastSeen: 0,
    streak: 0,
  };

  const updated: QuestionRecord = {
    ...existing,
    attempts: existing.attempts + 1,
    correct: existing.correct + (correct ? 1 : 0),
    lastSeen: Date.now(),
    streak: correct ? existing.streak + 1 : 0,
  };

  return {
    ...state,
    records: { ...state.records, [questionId]: updated },
  };
}

export function saveSession(
  state: ProgressState,
  session: SessionRecord,
): ProgressState {
  return { ...state, sessions: [...state.sessions, session] };
}

export function getTopicStats(
  state: ProgressState,
  topic: Topic,
  questionIds: string[],
): { attempted: number; accuracy: number; mastered: number } {
  const relevant = questionIds
    .map((id) => state.records[id])
    .filter(Boolean) as QuestionRecord[];

  const attempted = relevant.filter((r) => r.attempts > 0).length;
  const totalAttempts = relevant.reduce((s, r) => s + r.attempts, 0);
  const totalCorrect = relevant.reduce((s, r) => s + r.correct, 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const mastered = relevant.filter((r) => r.streak >= 2 && r.correct / r.attempts >= 0.75).length;

  return { attempted, accuracy, mastered };
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
