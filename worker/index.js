// Cloudflare Worker — backend de la app de ejercicios de física.
// Sirve los assets estáticos (dist/) y expone /api/generate, que llama a
// Cloudflare Workers AI (Llama 3.3 70B) para generar un ejercicio completo
// (enunciado, datos, fórmulas, respuesta con tolerancia, solución paso a
// paso y una pista) en un solo llamado, devuelto como JSON estructurado.

const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

const TOPIC_CONTEXT = {
  cinematica: 'Cinemática: MRU, MRUV (v=v0+at, x=x0+v0t+½at², v²=v0²+2aΔx), caída libre (g≈9.8 m/s²), tiro oblicuo (alcance R=v0²sin(2θ)/g).',
  dinamica: 'Dinámica (Leyes de Newton): ΣF=ma, peso P=mg, fricción f=μN, plano inclinado (Px=mg·senθ, Py=mg·cosθ), tensión en cuerdas, poleas.',
  'trabajo-energia': 'Trabajo y Energía: W=F·d·cosθ, Ec=½mv², Ep gravitatoria=mgh, Ep elástica=½kx², teorema trabajo-energía, conservación de energía mecánica, potencia P=W/t.',
  ondas: 'Ondas: v=λf, T=1/f, ecuación de onda y(x,t)=A·sen(kx-ωt), ondas sonoras, intensidad y decibeles β=10log(I/I0).',
  'electricidad-basica': 'Electricidad básica: Ley de Coulomb F=kq1q2/r², Ley de Ohm V=IR, potencia P=VI=I²R, circuitos serie y paralelo.',
  mecanica: 'Mecánica de partícula y cuerpo rígido: torque τ=r×F, momento de inercia I=Σmr², ΣΤ=Iα, momento angular L=Iω y su conservación, choques elásticos e inelásticos (conservación de momento), centro de masa.',
  termodinamica: 'Termodinámica: gas ideal PV=nRT, primera ley ΔU=Q-W, procesos isotérmico/isocórico/isobárico/adiabático, calor Q=mcΔT, eficiencia de ciclos η=1-Qfrío/Qcaliente.',
  electromagnetismo: 'Electromagnetismo: campo eléctrico E=kQ/r², Ley de Gauss, fuerza de Lorentz F=qv×B, fuerza sobre conductor F=BIL·senθ, Ley de Faraday ε=-dΦ/dt, campo de conductor recto B=μ0I/2πr.',
  'ondas-optica': 'Ondas y Óptica: Ley de Snell n1senθ1=n2senθ2, ecuación de lentes/espejos 1/f=1/do+1/di, interferencia de Young d·senθ=mλ, difracción a·senθ=mλ.',
  'fisica-moderna': 'Física Moderna: relatividad especial (γ=1/√(1-v²/c²), E=mc², dilatación temporal), efecto fotoeléctrico Ec,max=hf-φ, De Broglie λ=h/p, modelo de Bohr En=-13.6eV/n².',
};

const DIFFICULTY_GUIDE = {
  facil: 'Un solo concepto, aplicación directa de una fórmula, números redondos, sin combinar múltiples pasos.',
  medio: 'Combina 2-3 conceptos o pasos, requiere despejar variables o encadenar fórmulas.',
  dificil: 'Problema de varios pasos, puede combinar conceptos de distintas fórmulas del tema, requiere análisis cuidadoso y planteo previo.',
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders() },
  });
}

function extractJSON(text) {
  // Los modelos a veces envuelven la respuesta en ```json ... ``` o agregan texto alrededor.
  let cleaned = text.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) throw new Error('La IA no devolvió JSON válido.');
  cleaned = cleaned.slice(firstBrace, lastBrace + 1);

  // Arregla backslashes de LaTeX que no son escapes válidos de JSON.
  // Solo \" y \\ son escapes legítimos aquí — cualquier otro backslash
  // (\(, \), \t de \text, \b de \beta, etc.) se duplica para que JSON.parse
  // lo trate como un backslash literal en vez de una secuencia de control.
  cleaned = cleaned.replace(/\\(?!["\\])/g, '\\\\');

  return JSON.parse(cleaned);
}

function buildPrompt(level, topic, difficulty) {
  const topicInfo = TOPIC_CONTEXT[topic] || topic;
  const diffInfo = DIFFICULTY_GUIDE[difficulty] || difficulty;
  const levelLabel = level === 'universitaria' ? 'universitario (primer/segundo año de carrera de ciencias/ingeniería)' : 'secundario (escuela media)';

  return `Actúa como un profesor experto de Física, con el rigor y estilo de "Física Universitaria" de Sears y Zemansky. Vas a generar UN ejercicio de física completo, original y resuelto, en formato JSON estricto.

CONTEXTO DEL EJERCICIO:
- Nivel: ${levelLabel}
- Tema: ${topic} — fórmulas y conceptos relevantes: ${topicInfo}
- Dificultad: ${difficulty} — ${diffInfo}

REQUISITOS DE CALIDAD (muy importantes):
1. El problema debe ser físicamente realista: usa valores numéricos razonables (masas, velocidades, distancias, etc. típicos del mundo real, no valores absurdos).
2. Usa unidades del Sistema Internacional (SI) de forma consistente. Si conviene, puedes usar otras unidades comunes (km/h, g, cm) pero sé consistente y clarísimo.
3. El enunciado debe ser autocontenido: debe incluirse toda la información numérica necesaria para resolverlo, sin datos faltantes ni sobrantes.
4. La resolución debe ser matemáticamente correcta y dimensionalmente consistente — verifica tus cálculos antes de responder.
5. La respuesta final debe tener 2-4 cifras significativas razonables.
6. Los pasos de la solución deben ser didácticos: cada paso identifica qué se hace, con qué fórmula, y el resultado parcial.
7. Usa notación LaTeX para TODA expresión matemática (fórmulas, números con unidades, exponentes), delimitada con \\( ... \\) para inline. Ejemplo: "Un bloque de \\(5\\,\\text{kg}\\) se desliza..."
8. La pista debe dar una orientación útil (qué fórmula o enfoque usar) SIN revelar el resultado numérico final ni resolver el problema.
9. IMPORTANTE — backslashes dentro del JSON: cada backslash de LaTeX debe escribirse DUPLICADO dentro de las cadenas del JSON. Ejemplo correcto: "\\\\(x^2\\\\)" y "\\\\text{kg}". Un solo backslash rompe el JSON — es obligatorio duplicarlos todos.
10. Gráfico opcional: si el tema y el ejercicio se prestan para una gráfica simple 2D (ej. posición o velocidad vs. tiempo en cinemática, una onda y(x), una recta en un circuito V-I), completá el campo "graph". Si no aplica (ej. sistemas 3D, choques, circuitos complejos), poné "graph": null.

FORMATO DE SALIDA — responde ÚNICAMENTE con este JSON, sin texto antes ni después, sin markdown:
{
  "statement": "Enunciado completo del problema con LaTeX inline para los datos y unidades",
  "givenData": [
    {"label": "nombre de la magnitud", "symbol": "símbolo LaTeX", "value": número, "unit": "unidad"}
  ],
  "formulas": ["fórmula clave 1 en LaTeX sin delimitadores", "fórmula clave 2 en LaTeX"],
  "answer": {"value": número, "unit": "unidad de la respuesta", "tolerance": 0.05},
  "solution": [
    {"step": "título breve del paso", "detail": "explicación del paso, puede incluir LaTeX inline con \\\\( \\\\)", "formula": "fórmula usada en este paso, en LaTeX sin delimitadores, o cadena vacía si no aplica"}
  ],
  "hint": "una pista breve, sin revelar la respuesta",
  "graph": {
    "type": "linear | quadratic | sine",
    "xLabel": "nombre y unidad del eje x, ej: 't (s)'",
    "yLabel": "nombre y unidad del eje y, ej: 'v (m/s)'",
    "xMin": número, "xMax": número,
    "params": {
      "//linear": "y = m*x + b -> usar {m, b}",
      "//quadratic": "y = a*x^2 + b*x + c -> usar {a, b, c}",
      "//sine": "y = amplitude*sin(omega*x + phase) -> usar {amplitude, omega, phase}"
    }
  }
}

El campo "params" debe tener SOLO las claves correspondientes al "type" elegido (m,b para linear / a,b,c para quadratic / amplitude,omega,phase para sine), con valores numéricos coherentes con el ejercicio. Si "graph" no aplica, el valor completo debe ser JSON null (sin el objeto adentro).

El campo "tolerance" es el margen relativo aceptable (0.05 = 5%) para considerar correcta la respuesta del estudiante.
Genera el ejercicio ahora.`;
}

async function handleGenerate(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (_) {
    return jsonResponse({ error: 'Body inválido.' }, 400);
  }

  const { level, topic, difficulty } = body;
  if (!level || !topic || !difficulty) {
    return jsonResponse({ error: 'Faltan parámetros: level, topic, difficulty.' }, 400);
  }

  const prompt = buildPrompt(level, topic, difficulty);

  try {
    const aiResponse = await env.AI.run(MODEL, {
      messages: [
        { role: 'system', content: 'Eres un generador de ejercicios de física que responde EXCLUSIVAMENTE con JSON válido, sin texto adicional, sin bloques de markdown.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2048,
    });

    const rawText = aiResponse.response || aiResponse.result?.response || '';
    if (!rawText) throw new Error('La IA no devolvió contenido.');

    const exercise = extractJSON(rawText);

    // Validación básica de estructura
    if (!exercise.statement || !exercise.answer || !Array.isArray(exercise.solution)) {
      throw new Error('El JSON generado no tiene la estructura esperada.');
    }

    exercise.id = crypto.randomUUID();
    exercise.level = level;
    exercise.topic = topic;
    exercise.difficulty = difficulty;
    exercise.createdAt = new Date().toISOString();

    return jsonResponse(exercise);
  } catch (e) {
    return jsonResponse({ error: `Error al generar el ejercicio: ${e.message}` }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (url.pathname === '/api/generate' && request.method === 'POST') {
      return handleGenerate(request, env);
    }

    if (url.pathname.startsWith('/api/')) {
      return jsonResponse({ error: 'Ruta no encontrada.' }, 404);
    }

    // Todo lo demás lo sirve el binding de assets estáticos (dist/)
    return env.ASSETS.fetch(request);
  },
};
