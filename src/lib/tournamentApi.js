import { buildRoundRobin, buildSingleElimination } from './brackets/index.js';

export function generateBracketState(bracketType, participants) {
  const list = participants.filter((p) => p?.name?.trim());
  if (list.length < 2) return { error: 'Добавьте минимум двух участников с именами.' };

  if (bracketType === 'single') return buildSingleElimination(list);
  if (bracketType === 'round_robin') return buildRoundRobin(list);

  return { error: 'Поддерживаются только: одиночное выбывание и круговой турнир.' };
}
