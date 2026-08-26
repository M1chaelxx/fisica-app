import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MathText, { MathFormula } from '../components/MathText';
import { generateExercise } from '../lib/api';
import { addToHistory } from '../lib/storage';
import { findTopic } from '../data/topics';

export default function Exercise() {
  const location = useLocation();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(location.state?.exercise || null);
  const [level, setLevel] = useState(location.state?.level);
  const [topic, setTopic] = useState(location.state?.topic);
  const [difficulty, setDifficulty] = useState(location.state?.difficulty);

  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [corrected, setCorrected] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [savedToHistory, setSavedToHistory] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!exercise) navigate('/', { replace: true });
  }, [exercise, navigate]);

  if (!exercise) return null;

  const topicInfo = findTopic(topic);

  function resetForNewExercise(newExercise) {
    setExercise(newExercise);
    setAnswer('');
    setShowHint(false);
    setCorrected(false);
    setIsCorrect(false);
    setSavedToHistory(false);
    setError('');
  }

  async function handleOther() {
    setLoadingNext(true);
    setError('');
    try {
      const newExercise = await generateExercise(level, topic, difficulty);
      resetForNewExercise(newExercise);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingNext(false);
    }
  }

  function handleCorrect() {
    const userVal = parseFloat(answer.replace(',', '.'));
    if (isNaN(userVal)) {
      setError('Ingresá un valor numérico válido.');
      return;
    }
    setError('');

    const target = exercise.answer.value;
    const tolerance = exercise.answer.tolerance ?? 0.05;
    const margin = Math.abs(target) * tolerance || 0.01;
    const correct = Math.abs(userVal - target) <= margin;

    setIsCorrect(correct);
    setCorrected(true);

    if (!savedToHistory) {
      addToHistory({
        exercise,
        level,
        topic,
        difficulty,
        userAnswer: userVal,
        correct,
      });
      setSavedToHistory(true);
    }
  }

  return (
    <div className="section">
      <div className="exercise-meta">
        <span className="meta-chip">{topicInfo?.label || topic}</span>
        <span className="meta-chip">{level === 'universitaria' ? 'Universitaria' : 'Secundaria'}</span>
        <span className={`meta-chip diff-${difficulty}`}>{difficulty}</span>
      </div>

      <div className="statement-card">
        <MathText>{exercise.statement}</MathText>
      </div>

      {exercise.givenData?.length > 0 && (
        <div className="given-data">
          <span className="given-label">Datos:</span>
          <ul>
            {exercise.givenData.map((d, i) => (
              <li key={i}>
                {d.label}: <MathText>{`\\(${d.symbol} = ${d.value}\\,\\text{${d.unit}}\\)`}</MathText>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-group">
        <label>Tu respuesta {exercise.answer?.unit ? `(en ${exercise.answer.unit})` : ''}</label>
        <input
          className="math-input"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Ej: 12.5"
          disabled={corrected}
        />
      </div>

      {error && <div className="error">{error}</div>}

      <div className="exercise-actions">
        {!corrected && (
          <button className="hint-btn" onClick={() => setShowHint(s => !s)}>
            {showHint ? 'Ocultar pista' : '💡 Pista'}
          </button>
        )}
        {!corrected && (
          <button className="solve-btn" onClick={handleCorrect}>Corregir</button>
        )}
        <button className="other-btn" onClick={handleOther} disabled={loadingNext}>
          {loadingNext ? 'Generando…' : 'Otro ejercicio'}
        </button>
      </div>

      {showHint && !corrected && (
        <div className="hint-box">
          <MathText>{exercise.hint}</MathText>
        </div>
      )}

      {corrected && (
        <div className={`verdict ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? '✓ ¡Correcto!' : '✗ Incorrecto'}
          <span className="verdict-answer">
            Respuesta esperada: {exercise.answer.value} {exercise.answer.unit}
          </span>
        </div>
      )}

      {corrected && (
        <div className="solution-block">
          <h3>Resolución paso a paso</h3>

          {exercise.formulas?.length > 0 && (
            <div className="formulas-used">
              <span className="given-label">Fórmulas utilizadas:</span>
              {exercise.formulas.map((f, i) => <MathFormula key={i} latex={f} />)}
            </div>
          )}

          <ol className="solution-steps">
            {exercise.solution.map((s, i) => (
              <li key={i}>
                <strong>{s.step}</strong>
                <div><MathText>{s.detail}</MathText></div>
                {s.formula && <MathFormula latex={s.formula} block={false} />}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
