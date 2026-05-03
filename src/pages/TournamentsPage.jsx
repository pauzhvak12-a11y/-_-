import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteTournament, getTournamentsForUser } from '../lib/storage';

const typeLabels = {
  single: 'На выбывание',
  round_robin: 'Круговой',
};

export default function TournamentsPage() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0);
  const list = useMemo(
    () => getTournamentsForUser(user.id).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [user.id, tick],
  );

  function remove(tid, e) {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Удалить турнир?')) {
      deleteTournament(tid);
      setTick((x) => x + 1);
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Мои турниры</h1>
        <Link to="/tournaments/new" className="btn primary">
          Новый турнир
        </Link>
      </div>
      {list.length === 0 ? (
        <div className="card empty">
          <p>Пока нет турниров. Создайте первый — укажите название и тип сетки.</p>
          <Link to="/tournaments/new" className="btn primary">
            Создать турнир
          </Link>
        </div>
      ) : (
        <ul className="tournament-list">
          {list.map((t) => (
            <li key={t.id}>
              <Link to={`/tournaments/${t.id}`} className="tournament-card card">
                <div>
                  <h2>{t.name}</h2>
                  <p className="muted">
                    {typeLabels[t.bracketType] ?? t.bracketType} · участников: {t.participants?.length ?? 0}
                    {t.bracketState ? ' · сетка сгенерирована' : ''}
                  </p>
                </div>
                <button type="button" className="btn danger ghost" onClick={(e) => remove(t.id, e)}>
                  Удалить
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
