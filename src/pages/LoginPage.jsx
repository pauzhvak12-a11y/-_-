import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  function onSubmit(e) {
    e.preventDefault();
    setError('');
    const r = login(email.trim(), password);
    if (!r.ok) setError(r.error);
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1>Вход</h1>
        <p className="muted">Войдите, чтобы управлять турнирами</p>
        <form onSubmit={onSubmit} className="form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn primary">
            Войти
          </button>
        </form>
        <p className="auth-switch">
          Нет аккаунта? <Link to="/register">Регистрация</Link>
        </p>
      </div>
    </div>
  );
}
