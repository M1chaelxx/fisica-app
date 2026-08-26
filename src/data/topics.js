export const LEVELS = [
  { id: 'secundaria', label: 'Secundaria' },
  { id: 'universitaria', label: 'Universitaria' },
];

export const DIFFICULTIES = [
  { id: 'facil', label: 'Fácil' },
  { id: 'medio', label: 'Medio' },
  { id: 'dificil', label: 'Difícil' },
];

export const TOPICS = {
  secundaria: [
    { id: 'cinematica', label: 'Cinemática' },
    { id: 'dinamica', label: 'Dinámica (Leyes de Newton)' },
    { id: 'trabajo-energia', label: 'Trabajo y Energía' },
    { id: 'ondas', label: 'Ondas' },
    { id: 'electricidad-basica', label: 'Electricidad básica' },
  ],
  universitaria: [
    { id: 'mecanica', label: 'Mecánica (partícula y cuerpo rígido)' },
    { id: 'termodinamica', label: 'Termodinámica' },
    { id: 'electromagnetismo', label: 'Electromagnetismo' },
    { id: 'ondas-optica', label: 'Ondas y Óptica' },
    { id: 'fisica-moderna', label: 'Física Moderna (introducción)' },
  ],
};

export function findTopic(topicId) {
  for (const level of Object.values(TOPICS)) {
    const found = level.find(t => t.id === topicId);
    if (found) return found;
  }
  return null;
}
