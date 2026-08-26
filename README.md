# Física — Práctica de ejercicios

App para generar y corregir ejercicios de física (secundaria y universitaria) usando IA,
con resolución paso a paso, pistas, teoría de referencia y un historial local.

## Stack

- React 19 + Vite, PWA instalable
- HashRouter
- Backend: Cloudflare Worker (`worker/index.js`) que llama a **Cloudflare Workers AI**
  (modelo Llama 3.3 70B) — gratuito, sin necesidad de API key de terceros
- Sin login, sin base de datos — el historial vive en `localStorage` del dispositivo

## Cómo desplegar (sin GitHub, solo con tu cuenta de Cloudflare)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar sesión en Cloudflare (una sola vez)

```bash
npx wrangler login
```

Esto abre el navegador para autenticarte con tu cuenta de Cloudflare (gratuita si no tenés una).

### 3. Desplegar

```bash
npm run deploy
```

Este comando compila la app (`vite build`) y publica el Worker completo —
frontend + backend con IA — en un solo paso. Al terminar te da una URL tipo:

```
https://fisica-ejercicios.<tu-subdominio>.workers.dev
```

Esa es tu app, ya funcionando con generación de ejercicios por IA incluida.

### Actualizar después de un cambio

Cada vez que quieras subir cambios, repetí:

```bash
npm run deploy
```

## Notas

- El binding de **Workers AI** (`[ai]` en `wrangler.toml`) se activa automáticamente
  al desplegar — no hace falta ninguna clave secreta ni tarjeta de crédito.
- Cloudflare Workers AI tiene una cuota gratuita diaria (Neurons) que alcanza
  cómodamente para uso personal.
- Si en el futuro querés más calidad en las resoluciones, podés cambiar el modelo
  en `worker/index.js` (constante `MODEL`) por otro de Workers AI, por ejemplo
  uno de razonamiento como DeepSeek-R1 distill.
