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
        <fieldset className="type-picker">
          <legend>Тип сетки</legend>
          <div className="type-options">
            <label className={`type-option ${bracketType === 'single' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="bracketType"
                value="single"
                checked={bracketType === 'single'}
                onChange={(e) => setBracketType(e.target.value)}
              />
              <img src="./trophy.svg" alt="Иллюстрация одиночного выбывания" />
              <span className="type-title">Олимпийская сетка</span>
              <span className="type-description">Проиграл матч — выбыл. Быстрый формат для плей-офф.</span>
            </label>
            <label className={`type-option ${bracketType === 'round_robin' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="bracketType"
                value="round_robin"
                checked={bracketType === 'round_robin'}
                onChange={(e) => setBracketType(e.target.value)}
              />
              <img src="./league.svg" alt="Иллюстрация кругового турнира" />
              <span className="type-title">Круговой турнир</span>
              <span className="type-description">Каждый играет с каждым, лидер определяется по таблице.</span>
            </label>
          </div>
        </fieldset>
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
