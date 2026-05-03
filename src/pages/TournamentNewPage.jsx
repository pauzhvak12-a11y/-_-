import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { upsertTournament } from '../lib/storage';

export default function TournamentNewPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [bracketType, setBracketType] = useState('single');

  function onSubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID?.() ?? `t-${Date.now()}`;
    upsertTournament({
      id,
      userId: user.id,
      name: name.trim(),
      bracketType,
      participants: [],
      bracketState: null,
      createdAt: new Date().toISOString(),
    });
    nav(`/tournaments/${id}`);
  }

  return (
    <div className="page narrow">
      <h1>Новый турнир</h1>
      <form onSubmit={onSubmit} className="card form">
        <label>
          Название
          <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
        </label>
        <label>
          Тип сетки
          <select value={bracketType} onChange={(e) => setBracketType(e.target.value)}>
            <option value="single">Олимпийская (одиночное выбывание)</option>
            <option value="round_robin">Круговой турнир</option>
          </select>
        </label>
        <p className="hint">
          После создания добавьте участников и нажмите «Сгенерировать сетку». Данные сохраняются в LocalStorage
          браузера.
        </p>
        <div className="actions">
          <button type="submit" className="btn primary">
            Создать
          </button>
        </div>
      </form>
    </div>
  );
}
