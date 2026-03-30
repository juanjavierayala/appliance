// ── Configuración ─────────────────────────────────────────────
const API_URL = "https://sara-pro-api.onrender.com"

// ── Función base de requests ──────────────────────────────────
async function req(path, opts = {}) {
  const res = await fetch(API_URL + path, opts)

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `HTTP ${res.status}`)
  }

  return res.json()
}

// ── API ───────────────────────────────────────────────────────
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

  eliminarPromocion:(m, idx)     => req(`/promociones/${encodeURIComponent(m)}/${idx}`, {
    method: 'DELETE'
  }),
}
