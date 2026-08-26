import { useState } from 'react';
import MathText, { MathFormula } from '../components/MathText';
import { getHistory, clearHistory } from '../lib/storage';
import { findTopic } from '../data/topics';

export default function History() {
  const [history, setHistory] = useState(getHistory());
  const [openId, setOpenId] = useState(null);

  function handleClear() {
    if (confirm('¿Borrar todo el historial? Esta acción no se puede deshacer.')) {
      clearHistory();
      setHistory([]);
    }
  }

  if (history.length === 0) {
    return (
      <div className="section">
        <h1 className="page-title">Historial</h1>
        <p className="page-subtitle">Todavía no resolviste ningún ejercicio.</p>
      </div>
    );
  }

  const correctCount = history.filter(h => h.correct).length;

  return (
    <div className="section">
      <h1 className="page-title">Historial</h1>
      <p className="page-subtitle">
        {history.length} ejercicios resueltos · {correctCount} correctos ({Math.round((correctCount / history.length) * 100)}%)
      </p>

      <button className="clear-btn" onClick={handleClear}>Borrar historial</button>

      <div className="history-list">
        {history.map((entry, idx) => {
          const id = entry.exercise.id + idx;
          const isOpen = openId === id;
          const topicInfo = findTopic(entry.topic);
          const date = new Date(entry.savedAt).toLocaleString();

          return (
            <div key={id} className={`history-item ${entry.correct ? 'correct' : 'incorrect'}`}>
              <button className="history-header" onClick={() => setOpenId(isOpen ? null : id)}>
                <span className={`history-badge ${entry.correct ? 'ok' : 'no'}`}>
                  {entry.correct ? '✓' : '✗'}
                </span>
                <span className="history-topic">{topicInfo?.label || entry.topic}</span>
                <span className="history-date">{date}</span>
                <span className="history-toggle">{isOpen ? '▼' : '▶'}</span>
              </button>

              {isOpen && (
                <div className="history-detail">
                  <div className="statement-card">
                    <MathText>{entry.exercise.statement}</MathText>
                  </div>
                  <p className="history-answer">
                    Tu respuesta: <strong>{entry.userAnswer}</strong> — Esperada:{' '}
                    <strong>{entry.exercise.answer.value} {entry.exercise.answer.unit}</strong>
                  </p>
                  <div className="solution-block">
                    <h3>Resolución</h3>
                    <ol className="solution-steps">
                      {entry.exercise.solution.map((s, i) => (
                        <li key={i}>
                          <strong>{s.step}</strong>
                          <div><MathText>{s.detail}</MathText></div>
                          {s.formula && <MathFormula latex={s.formula} block={false} />}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
