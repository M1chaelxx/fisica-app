import { useParams, Link, useNavigate } from 'react-router-dom';
import { MathFormula } from '../components/MathText';
import { THEORY } from '../data/theory';

export default function Theory() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const theory = THEORY[topicId];

  if (!theory) {
    return (
      <div className="section">
        <p>Tema no encontrado.</p>
        <button className="solve-btn" onClick={() => navigate('/')}>Volver</button>
      </div>
    );
  }

  return (
    <div className="section">
      <Link to="/" className="back-link">← Volver</Link>
      <h1 className="page-title">{theory.title}</h1>
      <p className="page-subtitle">{theory.intro}</p>

      <div className="theory-sections">
        {theory.sections.map((s, i) => (
          <div key={i} className="theory-section">
            <h3>{s.heading}</h3>
            {s.text && <p>{s.text}</p>}
            {s.formulas?.map((f, j) => <MathFormula key={j} latex={f} />)}
          </div>
        ))}
      </div>
    </div>
  );
}
