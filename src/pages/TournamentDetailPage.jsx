import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ParticipantsEditor from '../components/ParticipantsEditor.jsx';
import MatchCard from '../components/MatchCard.jsx';
import StandingsTable from '../components/StandingsTable.jsx';
import { applyMatchResultRR, applyMatchResultSingle, normalizeBracket } from '../lib/brackets/index.js';
import { generateBracketState } from '../lib/tournamentApi';
import { getTournamentById, upsertTournament } from '../lib/storage';

const typeLabels = {
  single: 'Одиночное выбывание',
  round_robin: 'Круговой турнир',
};

function cloneState(s) {
  return JSON.parse(JSON.stringify(s));
}

export default function TournamentDetailPage() {
  const { id } = useParams();
  const initial = useMemo(() => getTournamentById(id), [id]);
  const [tournament, setTournament] = useState(initial);

  useEffect(() => {
    setTournament(getTournamentById(id));
  }, [id]);

  const persist = useCallback((next) => {
    upsertTournament(next);
    setTournament(next);
  }, []);

  if (!tournament) {
    return (
      <div className="page">
        <p>Турнир не найден.</p>
        <Link to="/">Назад</Link>
      </div>
    );
  }

  const bracketState = tournament.bracketState ? normalizeBracket(cloneState(tournament.bracketState)) : null;

  function addParticipant() {
    const pid = crypto.randomUUID?.() ?? `p-${Date.now()}`;
    persist({ ...tournament, participants: [...tournament.participants, { id: pid, name: '' }] });
  }

  function updateParticipant(pid, name) {
    persist({
      ...tournament,
      participants: tournament.participants.map((p) => (p.id === pid ? { ...p, name } : p)),
    });
  }

  function removeParticipant(pid) {
    persist({
      ...tournament,
      participants: tournament.participants.filter((p) => p.id !== pid),
    });
  }

  function generateBracket() {
    const generated = generateBracketState(tournament.bracketType, tournament.participants);
    if (generated.error) {
      alert(generated.error);
      return;
    }
    persist({ ...tournament, bracketState: generated });
  }

  function clearBracket() {
    if (!confirm('Сбросить сетку и результаты?')) return;
    persist({ ...tournament, bracketState: null });
  }

  function onSubmitResult(matchId, winnerId, scoreA, scoreB) {
    if (!tournament.bracketState) return;
    const raw = normalizeBracket(cloneState(tournament.bracketState));
    const nextState =
      raw.type === 'single'
        ? applyMatchResultSingle(raw, matchId, winnerId, scoreA, scoreB)
        : applyMatchResultRR(raw, matchId, winnerId, scoreA, scoreB);
    persist({ ...tournament, bracketState: nextState });
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <Link to="/" className="back-link">
            ← Все турниры
          </Link>
          <h1>{tournament.name}</h1>
          <p className="muted">
            {typeLabels[tournament.bracketType]} · создан {new Date(tournament.createdAt).toLocaleString('ru-RU')}
          </p>
        </div>
        <div className="actions-row">
          {tournament.bracketState && (
            <button type="button" className="btn ghost" onClick={clearBracket}>
              Сбросить сетку
            </button>
          )}
        </div>
      </div>

      <ParticipantsEditor
        participants={tournament.participants}
        onAdd={addParticipant}
        onUpdate={updateParticipant}
        onRemove={removeParticipant}
        onGenerate={generateBracket}
      />

      {bracketState && tournament.bracketType === 'single' && (
        <section className="section">
          <h2>Сетка</h2>
          <div className="bracket-scroll">
            <div className="bracket-columns">
              {bracketState.rounds.map((round, ri) => (
                <div key={ri} className="bracket-col">
                  <h3 className="round-title">Раунд {ri + 1}</h3>
                  {round.map((m) => (
                    <MatchCard key={m.id} match={m} onSubmitResult={onSubmitResult} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {bracketState && tournament.bracketType === 'round_robin' && (
        <section className="section">
          <h2>Круговой турнир</h2>
          <div className="bracket-scroll">
            <div className="bracket-columns">
              {bracketState.rounds.map((round, ri) => (
                <div key={ri} className="bracket-col">
                  <h3 className="round-title">Тур {ri + 1}</h3>
                  {round.map((m) => (
                    <MatchCard key={m.id} match={m} onSubmitResult={onSubmitResult} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <StandingsTable standings={bracketState.standings} participants={tournament.participants} />
        </section>
      )}
    </div>
  );
}
