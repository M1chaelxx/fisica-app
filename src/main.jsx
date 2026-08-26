import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MathJaxContext } from 'better-react-mathjax';
import App from './App.jsx';
import './index.css';

const mathJaxConfig = {
  loader: { load: ['[tex]/ams'] },
  tex: {
    packages: { '[+]': ['ams'] },
    inlineMath: [['\\(', '\\)']],
    displayMath: [['\\[', '\\]']],
  },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MathJaxContext config={mathJaxConfig} version={3}>
      <App />
    </MathJaxContext>
  </StrictMode>,
);
