const USERS = 'tb_users';
const TOURNAMENTS = 'tb_tournaments';
const SESSION = 'tb_session';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() {
  return read(USERS, []);
}

export function saveUser(user) {
  const users = getUsers();
  if (users.some((u) => u.email === user.email)) return { ok: false, error: 'Email уже зарегистрирован' };
  users.push(user);
  write(USERS, users);
  return { ok: true };
}

export function findUserByEmail(email) {
  return getUsers().find((u) => u.email === email) ?? null;
}

export function setSession(userId) {
  write(SESSION, { userId });
}

export function getSession() {
  return read(SESSION, null);
}

export function clearSession() {
  localStorage.removeItem(SESSION);
}

export function getTournaments() {
  return read(TOURNAMENTS, []);
}

export function saveTournaments(list) {
  write(TOURNAMENTS, list);
}

export function getTournamentsForUser(userId) {
  return getTournaments().filter((t) => t.userId === userId);
}

export function upsertTournament(tournament) {
  const all = getTournaments();
  const i = all.findIndex((t) => t.id === tournament.id);
  if (i === -1) all.push(tournament);
  else all[i] = tournament;
  saveTournaments(all);
}

export function getTournamentById(id) {
  return getTournaments().find((t) => t.id === id) ?? null;
}

export function deleteTournament(id) {
  saveTournaments(getTournaments().filter((t) => t.id !== id));
}
