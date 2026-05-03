import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TournamentsPage from './pages/TournamentsPage.jsx';
import TournamentNewPage from './pages/TournamentNewPage.jsx';
import TournamentDetailPage from './pages/TournamentDetailPage.jsx';

function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<TournamentsPage />} />
        <Route path="tournaments/new" element={<TournamentNewPage />} />
        <Route path="tournaments/:id" element={<TournamentDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
