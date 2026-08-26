// Contenido de teoría por tema — enfoque y notación estilo Sears & Zemansky
// (Física Universitaria). Cada entrada: intro, secciones con fórmulas LaTeX.

export const THEORY = {
  cinematica: {
    title: 'Cinemática',
    intro: 'Estudia el movimiento de los cuerpos sin analizar sus causas. Se describe mediante posición, velocidad y aceleración en función del tiempo.',
    sections: [
      {
        heading: 'Movimiento Rectilíneo Uniforme (MRU)',
        text: 'Velocidad constante, aceleración nula.',
        formulas: ['x = x_0 + v \\cdot t'],
      },
      {
        heading: 'Movimiento Rectilíneo Uniformemente Variado (MRUV)',
        text: 'Aceleración constante. Estas son las tres ecuaciones fundamentales del movimiento uniformemente acelerado:',
        formulas: [
          'v = v_0 + a t',
          'x = x_0 + v_0 t + \\tfrac{1}{2} a t^2',
          'v^2 = v_0^2 + 2 a (x - x_0)',
        ],
      },
      {
        heading: 'Caída libre',
        text: 'Caso particular de MRUV donde a = g ≈ 9.8 m/s² (dirigida hacia abajo).',
        formulas: ['v = v_0 - g t', 'y = y_0 + v_0 t - \\tfrac{1}{2} g t^2'],
      },
      {
        heading: 'Tiro oblicuo',
        text: 'Movimiento en dos dimensiones: componente horizontal (MRU) y vertical (MRUV) independientes.',
        formulas: [
          'x = v_0 \\cos\\theta \\cdot t',
          'y = v_0 \\sin\\theta \\cdot t - \\tfrac{1}{2} g t^2',
          'Alcance: R = \\dfrac{v_0^2 \\sin(2\\theta)}{g}',
        ],
      },
    ],
  },

  dinamica: {
    title: 'Dinámica — Leyes de Newton',
    intro: 'Relaciona el movimiento de los cuerpos con las fuerzas que lo producen.',
    sections: [
      {
        heading: '1ª Ley (Inercia)',
        text: 'Un cuerpo permanece en reposo o MRU a menos que actúe sobre él una fuerza neta no nula.',
        formulas: ['\\sum \\vec{F} = 0 \\;\\Rightarrow\\; \\vec{v} = \\text{constante}'],
      },
      {
        heading: '2ª Ley (Fundamental)',
        text: 'La aceleración es proporcional a la fuerza neta e inversamente proporcional a la masa.',
        formulas: ['\\sum \\vec{F} = m \\vec{a}'],
      },
      {
        heading: '3ª Ley (Acción y Reacción)',
        text: 'A toda fuerza de acción le corresponde una de reacción, igual en magnitud y de sentido contrario.',
        formulas: ['\\vec{F}_{A \\to B} = -\\vec{F}_{B \\to A}'],
      },
      {
        heading: 'Fuerzas comunes',
        text: 'Peso, normal y fricción son las fuerzas que más aparecen en los problemas.',
        formulas: [
          'Peso: P = m g',
          'Fricción: f = \\mu N \\quad (\\mu_e \\geq \\mu_c)',
          'Plano inclinado: P_x = mg\\sin\\theta,\\; P_y = mg\\cos\\theta',
        ],
      },
    ],
  },

  'trabajo-energia': {
    title: 'Trabajo y Energía',
    intro: 'El trabajo mide la transferencia de energía mediante una fuerza que actúa a lo largo de un desplazamiento.',
    sections: [
      {
        heading: 'Trabajo',
        text: 'Solo la componente de la fuerza en la dirección del desplazamiento realiza trabajo.',
        formulas: ['W = F \\cdot d \\cdot \\cos\\theta'],
      },
      {
        heading: 'Energía cinética y Teorema trabajo-energía',
        formulas: [
          'E_c = \\tfrac{1}{2} m v^2',
          'W_{neto} = \\Delta E_c = E_{c,f} - E_{c,i}',
        ],
      },
      {
        heading: 'Energía potencial',
        formulas: [
          'Gravitatoria: E_p = m g h',
          'Elástica: E_p = \\tfrac{1}{2} k x^2',
        ],
      },
      {
        heading: 'Conservación de la energía mecánica',
        text: 'Si solo actúan fuerzas conservativas, la energía mecánica total se mantiene constante.',
        formulas: ['E_{mec} = E_c + E_p = \\text{constante}'],
      },
      {
        heading: 'Potencia',
        formulas: ['P = \\dfrac{W}{t} = F \\cdot v'],
      },
    ],
  },

  ondas: {
    title: 'Ondas',
    intro: 'Una onda transporta energía sin transportar materia, mediante una perturbación que se propaga.',
    sections: [
      {
        heading: 'Magnitudes básicas',
        formulas: [
          'v = \\lambda \\cdot f',
          'T = \\dfrac{1}{f}',
          '\\omega = 2\\pi f',
        ],
      },
      {
        heading: 'Ecuación de onda armónica',
        formulas: ['y(x,t) = A \\sin(kx - \\omega t)', 'k = \\dfrac{2\\pi}{\\lambda}'],
      },
      {
        heading: 'Ondas sonoras',
        text: 'El sonido es una onda mecánica longitudinal. Su intensidad se mide en decibeles.',
        formulas: ['\\beta = 10 \\log_{10}\\left(\\dfrac{I}{I_0}\\right)\\;\\text{dB}, \\quad I_0 = 10^{-12}\\,\\text{W/m}^2'],
      },
    ],
  },

  'electricidad-basica': {
    title: 'Electricidad básica',
    intro: 'Estudia las cargas eléctricas, corrientes y circuitos simples.',
    sections: [
      {
        heading: 'Ley de Coulomb',
        formulas: ['F = k \\dfrac{|q_1 q_2|}{r^2}, \\quad k \\approx 9\\times10^9\\, \\text{N·m}^2/\\text{C}^2'],
      },
      {
        heading: 'Ley de Ohm',
        formulas: ['V = I \\cdot R'],
      },
      {
        heading: 'Potencia eléctrica',
        formulas: ['P = V \\cdot I = I^2 R = \\dfrac{V^2}{R}'],
      },
      {
        heading: 'Circuitos',
        text: 'Resistencias en serie se suman; en paralelo se suman sus inversos.',
        formulas: [
          'Serie: R_{eq} = R_1 + R_2 + \\dots',
          'Paralelo: \\dfrac{1}{R_{eq}} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2} + \\dots',
        ],
      },
    ],
  },

  mecanica: {
    title: 'Mecánica — Partícula y Cuerpo Rígido',
    intro: 'Extiende la dinámica a sistemas de partículas y cuerpos con rotación.',
    sections: [
      {
        heading: 'Torque (momento de fuerza)',
        formulas: ['\\vec{\\tau} = \\vec{r} \\times \\vec{F}, \\quad \\tau = r F \\sin\\theta'],
      },
      {
        heading: 'Momento de inercia y 2ª Ley rotacional',
        formulas: [
          'I = \\sum m_i r_i^2',
          '\\sum \\tau = I \\alpha',
        ],
      },
      {
        heading: 'Momento angular',
        formulas: ['L = I \\omega', '\\text{Conservación: } L_i = L_f \\text{ si } \\tau_{neto}=0'],
      },
      {
        heading: 'Choques',
        formulas: [
          'Conservación de momento: m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}',
          'Elástico: se conserva también la energía cinética',
        ],
      },
      {
        heading: 'Centro de masa',
        formulas: ['x_{cm} = \\dfrac{\\sum m_i x_i}{\\sum m_i}'],
      },
    ],
  },

  termodinamica: {
    title: 'Termodinámica',
    intro: 'Estudia el calor, el trabajo y la energía interna de los sistemas.',
    sections: [
      {
        heading: 'Ecuación de gas ideal',
        formulas: ['PV = nRT, \\quad R = 8.314\\,\\text{J/(mol·K)}'],
      },
      {
        heading: 'Primera Ley de la Termodinámica',
        formulas: ['\\Delta U = Q - W'],
      },
      {
        heading: 'Procesos comunes',
        formulas: [
          'Isotérmico: \\Delta U = 0 \\Rightarrow Q = W',
          'Isocórico: W = 0 \\Rightarrow \\Delta U = Q',
          'Isobárico: W = P \\Delta V',
          'Adiabático: Q = 0 \\Rightarrow \\Delta U = -W',
        ],
      },
      {
        heading: 'Calor y capacidad calorífica',
        formulas: ['Q = m c \\Delta T'],
      },
      {
        heading: 'Segunda Ley y eficiencia',
        formulas: ['\\eta = 1 - \\dfrac{Q_{frío}}{Q_{caliente}}'],
      },
    ],
  },

  electromagnetismo: {
    title: 'Electromagnetismo',
    intro: 'Estudia los campos eléctricos y magnéticos y su interacción.',
    sections: [
      {
        heading: 'Campo eléctrico',
        formulas: ['\\vec{E} = k \\dfrac{Q}{r^2}\\hat{r}', 'F = qE'],
      },
      {
        heading: 'Ley de Gauss',
        formulas: ['\\oint \\vec{E} \\cdot d\\vec{A} = \\dfrac{Q_{enc}}{\\varepsilon_0}'],
      },
      {
        heading: 'Campo magnético y fuerza de Lorentz',
        formulas: [
          '\\vec{F} = q\\vec{v} \\times \\vec{B}',
          'Sobre un conductor: F = BIL\\sin\\theta',
        ],
      },
      {
        heading: 'Ley de Faraday (inducción)',
        formulas: ['\\varepsilon = -\\dfrac{d\\Phi_B}{dt}, \\quad \\Phi_B = B A \\cos\\theta'],
      },
      {
        heading: 'Ley de Ampère (campo de un conductor recto)',
        formulas: ['B = \\dfrac{\\mu_0 I}{2\\pi r}'],
      },
    ],
  },

  'ondas-optica': {
    title: 'Ondas y Óptica',
    intro: 'Fenómenos de interferencia, difracción y reflexión/refracción de la luz.',
    sections: [
      {
        heading: 'Reflexión y refracción',
        formulas: ['n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 \\quad \\text{(Ley de Snell)}'],
      },
      {
        heading: 'Lentes y espejos',
        formulas: [
          '\\dfrac{1}{f} = \\dfrac{1}{d_o} + \\dfrac{1}{d_i}',
          'Aumento: m = -\\dfrac{d_i}{d_o}',
        ],
      },
      {
        heading: 'Interferencia (doble rendija de Young)',
        formulas: ['d \\sin\\theta = m\\lambda \\quad (m = 0, \\pm1, \\pm2, \\dots)'],
      },
      {
        heading: 'Difracción (rendija simple)',
        formulas: ['a \\sin\\theta = m\\lambda \\quad (\\text{mínimos}, m \\neq 0)'],
      },
    ],
  },

  'fisica-moderna': {
    title: 'Física Moderna (introducción)',
    intro: 'Introducción a la relatividad especial y la física cuántica.',
    sections: [
      {
        heading: 'Relatividad especial',
        formulas: [
          '\\gamma = \\dfrac{1}{\\sqrt{1 - v^2/c^2}}',
          'Dilatación temporal: \\Delta t = \\gamma \\Delta t_0',
          'Energía-masa: E = mc^2',
        ],
      },
      {
        heading: 'Efecto fotoeléctrico',
        formulas: [
          'E_{fotón} = h f',
          'E_{c,max} = h f - \\phi \\quad (\\phi = \\text{función trabajo})',
        ],
      },
      {
        heading: 'Dualidad onda-partícula (De Broglie)',
        formulas: ['\\lambda = \\dfrac{h}{p} = \\dfrac{h}{mv}'],
      },
      {
        heading: 'Modelo de Bohr del átomo de hidrógeno',
        formulas: ['E_n = -\\dfrac{13.6\\,\\text{eV}}{n^2}'],
      },
    ],
  },
};
