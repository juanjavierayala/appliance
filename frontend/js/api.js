// ── Configuración ─────────────────────────────────────────────
// En desarrollo: proxy via vite o servidor local en :8000
// En producción: poner la URL de Render en VITE_API_URL o window.API_URL
const API = window.API_URL ?? 'http://localhost:8000'

async function req(path, opts = {}) {
  const res = await fetch(API + path, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `HTTP ${res.status}`)
  }
  return res.json()
}

const api = {
  getAutomotor:     ()           => req('/vehiculos/automotor'),
  getCompetencia:   (m)          => req(`/vehiculos/competencia/${encodeURIComponent(m)}`),
  getVehiculo:      (m)          => req(`/vehiculos/${encodeURIComponent(m)}`),
  comparar:         (m1, m2)     => req(`/comparar?m1=${encodeURIComponent(m1)}&m2=${encodeURIComponent(m2)}`),
  getPromociones:   (m)          => req(`/promociones/${encodeURIComponent(m)}`),
  crearPromocion:   (m, data)    => req(`/promociones/${encodeURIComponent(m)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  eliminarPromocion:(m, idx)     => req(`/promociones/${encodeURIComponent(m)}/${idx}`, { method: 'DELETE' }),
}
