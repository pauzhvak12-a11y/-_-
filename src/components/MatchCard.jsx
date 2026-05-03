import { useState } from 'react';

function name(p) {
  if (!p) return '—';
  if (p.placeholder) return '…';
  return p.name ?? '—';
}

export default function MatchCard({ match, onSubmitResult, labels }) {
  const [scoreA, setScoreA] = useState(match.scoreA ?? '');
  const [scoreB, setScoreB] = useState(match.scoreB ?? '');
  const done = Boolean(match.winnerId);
  const canPlay = match.a && match.b && !match.a.placeholder && !match.b.placeholder && !match.a.isBye && !match.b.isBye;

  function pickWinner(winnerId) {
    const sa = scoreA === '' ? 0 : Number(scoreA);
    const sb = scoreB === '' ? 0 : Number(scoreB);
    onSubmitResult(match.id, winnerId, sa, sb);
  }

  return (
    <div className={`match-card ${done ? 'done' : ''}`}>
      {labels && <div className="match-meta">{labels}</div>}
      <div className="match-side">
        <span className={match.winnerId === match.a?.id ? 'won' : ''}>{name(match.a)}</span>
      </div>
      <div className="match-side">
        <span className={match.winnerId === match.b?.id ? 'won' : ''}>{name(match.b)}</span>
      </div>
      {!done && canPlay && (
        <div className="match-actions">
          <div className="scores">
            <input
              type="number"
              min={0}
              className="score-input"
              value={scoreA}
              onChange={(e) => setScoreA(e.target.value)}
              aria-label="Счёт первого"
            />
            <span>:</span>
            <input
              type="number"
              min={0}
              className="score-input"
              value={scoreB}
              onChange={(e) => setScoreB(e.target.value)}
              aria-label="Счёт второго"
            />
          </div>
          <div className="winner-btns">
            <button type="button" className="btn small" onClick={() => pickWinner(match.a.id)}>
              Победа: {name(match.a)}
            </button>
            <button type="button" className="btn small secondary" onClick={() => pickWinner(match.b.id)}>
              Победа: {name(match.b)}
            </button>
          </div>
        </div>
      )}
      {done && (
        <p className="match-result muted">
          Счёт: {match.scoreA ?? 0}:{match.scoreB ?? 0} · победил: {name(match.winnerId === match.a?.id ? match.a : match.b)}
        </p>
      )}
      {!canPlay && !done && <p className="muted small">Ожидание участников</p>}
    </div>
  );
}
