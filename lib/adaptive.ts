import type { Question, Topic } from '@/data/questions';
import type { ProgressState } from './progress';

// Returns a weight for each question — higher weight = more likely to be selected.
// Unseen questions: medium weight. Wrong/low-accuracy: high weight. Mastered: low weight.
function questionWeight(questionId: string, state: ProgressState, now: number): number {
  const record = state.records[questionId];
  if (!record || record.attempts === 0) return 5; // unseen

  const accuracy = record.correct / record.attempts;
  const hoursSinceSeen = (now - record.lastSeen) / (1000 * 60 * 60);
  const decayBonus = Math.min(hoursSinceSeen / 24, 3); // up to +3 for not seen in days

  if (record.streak >= 3 && accuracy >= 0.8) return 0.5 + decayBonus; // well mastered
  if (accuracy >= 0.75) return 2 + decayBonus;
  if (accuracy >= 0.5) return 5 + decayBonus;
  return 9 + decayBonus; // struggling
}

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function selectNextQuestion(
  questions: Question[],
  state: ProgressState,
  topic?: Topic,
): Question {
  const pool = topic ? questions.filter((q) => q.topic === topic) : questions;
  const now = Date.now();
  const weights = pool.map((q) => questionWeight(q.id, state, now));
  return weightedRandom(pool, weights);
}

export function buildQuizSession(
  questions: Question[],
  state: ProgressState,
  count: number,
  topic?: Topic,
): Question[] {
  const pool = topic ? questions.filter((q) => q.topic === topic) : questions;
  const now = Date.now();
  const selected: Question[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const remaining = pool.filter((q) => !usedIds.has(q.id));
    if (remaining.length === 0) break;
    const weights = remaining.map((q) => questionWeight(q.id, state, now));
    const pick = weightedRandom(remaining, weights);
    selected.push(pick);
    usedIds.add(pick.id);
  }

  return selected;
}
