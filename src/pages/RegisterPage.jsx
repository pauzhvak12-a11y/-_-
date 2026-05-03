import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  function onSubmit(e) {
    e.preventDefault();
    setError('');
    const r = register(name.trim(), email.trim(), password);
    if (!r.ok) setError(r.error);
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1>Регистрация</h1>
        <p className="muted">Создайте аккаунт для сохранения турниров в браузере</p>
        <form onSubmit={onSubmit} className="form">
          <label>
            Имя
            <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              autoComplete="new-password"
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn primary">
            Зарегистрироваться
          </button>
        </form>
        <p className="auth-switch">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
