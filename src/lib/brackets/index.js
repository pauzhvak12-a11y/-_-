export { buildSingleElimination, nextPow2, applyMatchResultSingle } from './singleElimination';
export { buildRoundRobin, applyMatchResultRR } from './roundRobin';

/** Восстановление ссылок после загрузки из LocalStorage. */
export function normalizeBracket(state) {
  if (!state || !state.matches) return state;
  state.idMap = Object.fromEntries(state.matches.map((m) => [m.id, m]));

  const maxRound = Math.max(...state.matches.map((m) => m.round), 0);
  state.rounds = [];
  for (let r = 0; r <= maxRound; r++) {
    state.rounds.push(state.matches.filter((m) => m.round === r));
  }

  return state;
}
