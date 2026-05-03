const uid = () => crypto.randomUUID?.() ?? `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function nextPow2(n) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

/** Одиночное выбывание. */
export function buildSingleElimination(participants) {
  const seeds = participants.map((p) => ({ ...p }));
  const size = nextPow2(seeds.length);
  while (seeds.length < size) {
    seeds.push({ id: `bye-${uid()}`, name: '— Пропуск —', isBye: true });
  }

  const rounds = [];
  let prevCount = seeds.length;

  for (let roundIndex = 0; prevCount > 1; roundIndex++) {
    const matchCount = prevCount / 2;
    const row = [];
    for (let i = 0; i < matchCount; i++) {
      row.push({
        id: uid(),
        round: roundIndex,
        side: 'single',
        a: null,
        b: null,
        winnerId: null,
        scoreA: null,
        scoreB: null,
        nextMatchId: null,
        prevAId: null,
        prevBId: null,
      });
    }
    rounds.push(row);

    if (roundIndex > 0) {
      const prev = rounds[roundIndex - 1];
      for (let i = 0; i < prev.length; i++) {
        const next = row[Math.floor(i / 2)];
        prev[i].nextMatchId = next.id;
        if (i % 2 === 0) next.prevAId = prev[i].id;
        else next.prevBId = prev[i].id;
      }
    }

    prevCount = matchCount;
  }

  const first = rounds[0];
  for (let i = 0; i < first.length; i++) {
    first[i].a = seeds[i * 2];
    first[i].b = seeds[i * 2 + 1];
    if (first[i].a.isBye) first[i].winnerId = first[i].b.id;
    else if (first[i].b.isBye) first[i].winnerId = first[i].a.id;
  }

  const matches = rounds.flat();
  const idMap = Object.fromEntries(matches.map((m) => [m.id, m]));

  for (const m of first) {
    if (m.winnerId) advanceSingleWinner(m, idMap);
  }

  return { type: 'single', rounds, matches, idMap };
}

function advanceSingleWinner(match, idMap) {
  if (!match.nextMatchId) return;
  const next = idMap[match.nextMatchId];
  if (!next) return;
  const winner = match.winnerId === match.a?.id ? match.a : match.b;
  if (next.prevAId === match.id) next.a = winner;
  else if (next.prevBId === match.id) next.b = winner;
}

export function applyMatchResultSingle(state, matchId, winnerId, scoreA, scoreB) {
  const match = state.idMap[matchId];
  if (!match || match.winnerId || !match.a || !match.b) return state;

  match.winnerId = winnerId;
  match.scoreA = scoreA;
  match.scoreB = scoreB;
  advanceSingleWinner(match, state.idMap);

  return { ...state, rounds: state.rounds.map((r) => [...r]) };
}
