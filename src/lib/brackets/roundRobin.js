const uid = () => crypto.randomUUID?.() ?? `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** Круговой турнир. */
export function buildRoundRobin(participants) {
  let list = participants.filter((p) => !p.isBye).map((p) => ({ ...p }));
  if (list.length < 2) {
    return { type: 'round_robin', rounds: [], matches: [], standings: [] };
  }

  if (list.length % 2 === 1) {
    list = [...list, { id: `bye-${uid()}`, name: '— Пропуск —', isBye: true }];
  }

  const rounds = [];
  const arr = [...list];
  const n = arr.length;
  const half = n / 2;

  for (let r = 0; r < n - 1; r++) {
    const matches = [];
    for (let i = 0; i < half; i++) {
      const a = arr[i];
      const b = arr[n - 1 - i];
      if (!a.isBye && !b.isBye) {
        matches.push({
          id: uid(),
          round: r,
          side: 'round_robin',
          a,
          b,
          winnerId: null,
          scoreA: null,
          scoreB: null,
        });
      }
    }
    rounds.push(matches);

    const fixed = arr[0];
    const rest = arr.slice(1);
    rest.unshift(rest.pop());
    arr.splice(0, n, fixed, ...rest);
  }

  const matches = rounds.flat();
  const standings = participants.map((p) => ({
    participantId: p.id,
    wins: 0,
    losses: 0,
    played: 0,
  }));

  return { type: 'round_robin', rounds, matches, standings };
}

export function applyMatchResultRR(state, matchId, winnerId, scoreA, scoreB) {
  const match = state.matches.find((m) => m.id === matchId);
  if (!match || match.winnerId || !match.a || !match.b) return state;

  match.winnerId = winnerId;
  match.scoreA = scoreA;
  match.scoreB = scoreB;

  const loserId = winnerId === match.a.id ? match.b.id : match.a.id;
  const standings = state.standings.map((s) => ({ ...s }));

  const winner = standings.find((s) => s.participantId === winnerId);
  const loser = standings.find((s) => s.participantId === loserId);

  if (winner) {
    winner.wins += 1;
    winner.played += 1;
  }
  if (loser) {
    loser.losses += 1;
    loser.played += 1;
  }

  return { ...state, standings };
}
