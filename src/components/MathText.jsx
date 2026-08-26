import { MathJax } from 'better-react-mathjax';

// Renderiza texto que puede contener LaTeX inline \( ... \) o bloque \[ ... \]
export default function MathText({ children, block = false, className = '' }) {
  if (!children) return null;
  return (
    <MathJax inline={!block} className={className} dynamic>
      {children}
    </MathJax>
  );
}

// Renderiza directamente una fórmula LaTeX (sin delimitadores) como bloque o inline
export function MathFormula({ latex, block = true, className = '' }) {
  if (!latex) return null;
  const wrapped = block ? `\\[${latex}\\]` : `\\(${latex}\\)`;
  return (
    <MathJax inline={!block} className={className} dynamic>
      {wrapped}
    </MathJax>
  );
}
