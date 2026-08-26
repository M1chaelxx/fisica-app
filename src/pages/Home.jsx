import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LEVELS, DIFFICULTIES, TOPICS } from '../data/topics';
import { generateExercise } from '../lib/api';

export default function Home() {
  const navigate = useNavigate();
  const [level, setLevel] = useState('secundaria');
  const [topic, setTopic] = useState(TOPICS.secundaria[0].id);
  const [difficulty, setDifficulty] = useState('facil');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleLevelChange(newLevel) {
    setLevel(newLevel);
    setTopic(TOPICS[newLevel][0].id);
  }

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const exercise = await generateExercise(level, topic, difficulty);
      navigate('/ejercicio', { state: { exercise, level, topic, difficulty } });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section">
      <h1 className="page-title">Practicá Física</h1>
      <p className="page-subtitle">Ejercicios generados al momento, con resolución paso a paso.</p>

      <div className="form-group">
        <label>Nivel</label>
        <div className="pill-group">
          {LEVELS.map(l => (
            <button
              key={l.id}
              className={`pill ${level === l.id ? 'active' : ''}`}
              onClick={() => handleLevelChange(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Tema</label>
        <div className="topic-grid">
          {TOPICS[level].map(t => (
            <button
              key={t.id}
              className={`topic-card ${topic === t.id ? 'active' : ''}`}
              onClick={() => setTopic(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Link to={`/teoria/${topic}`} className="theory-link">📖 Ver teoría de este tema</Link>
      </div>

      <div className="form-group">
        <label>Dificultad</label>
        <div className="pill-group">
          {DIFFICULTIES.map(d => (
            <button
              key={d.id}
              className={`pill ${difficulty === d.id ? 'active' : ''}`}
              onClick={() => setDifficulty(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <button className="solve-btn" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generando ejercicio…' : 'Generar ejercicio'}
      </button>
    </div>
  );
}
