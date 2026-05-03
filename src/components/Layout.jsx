import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="header">
        <NavLink to="/" className="logo">
          Турнирная сетка
        </NavLink>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Мои турниры
          </NavLink>
          <NavLink to="/tournaments/new" className={({ isActive }) => (isActive ? 'active' : '')}>
            Создать
          </NavLink>
        </nav>
        <div className="user-bar">
          <span className="user-name">{user?.name}</span>
          <button type="button" className="btn ghost" onClick={logout}>
            Выйти
          </button>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        Курсовой проект · Фронтенд-разработка · данные в LocalStorage
      </footer>
    </div>
  );
}
