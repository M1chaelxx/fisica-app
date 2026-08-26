const KEY = 'fisica-app-historial';

export function getHistory() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function addToHistory(entry) {
  const history = getHistory();
  history.unshift({ ...entry, savedAt: new Date().toISOString() });
  // límite razonable para no llenar el localStorage
  const trimmed = history.slice(0, 300);
  localStorage.setItem(KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}

export function getHistoryEntry(id) {
  return getHistory().find(e => e.exercise.id === id) || null;
}
