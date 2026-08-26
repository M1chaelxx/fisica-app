import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Exercise from './pages/Exercise';
import History from './pages/History';
import Theory from './pages/Theory';
import './App.css';

export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <header className="app-header">
          <NavLink to="/" className="brand">⚛ Física — Práctica</NavLink>
          <nav className="top-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Inicio</NavLink>
            <NavLink to="/historial" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Historial</NavLink>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ejercicio" element={<Exercise />} />
            <Route path="/historial" element={<History />} />
            <Route path="/teoria/:topicId" element={<Theory />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
