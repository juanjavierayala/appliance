// ══════════════════════════════════════════════════════════════
//  Estado global
// ══════════════════════════════════════════════════════════════
const state = {
  p1:         null,   // datos vehículo automotor
  p2:         null,   // datos vehículo competencia
  modo:       null,   // 'ficha1' | 'ficha2' | 'comparar'
  activeTab:  'general',
  promos1:    null,
  promos2:    null,
  modalModelo: null,
}

// ══════════════════════════════════════════════════════════════
//  DOM refs
// ══════════════════════════════════════════════════════════════
const selM1       = document.getElementById('sel-m1')
const selM2       = document.getElementById('sel-m2')
const btnFicha1   = document.getElementById('btn-ficha1')
const btnFicha2   = document.getElementById('btn-ficha2')
const btnComp     = document.getElementById('btn-comp')
const tabBar      = document.getElementById('tab-bar')
const tabContent  = document.getElementById('tab-content')
const statusDot   = document.getElementById('status-dot')
const statusMsg   = document.getElementById('status-msg')
const dbCount     = document.getElementById('db-count')

// modal
const modalOverlay = document.getElementById('modal-overlay')
const modalTitle   = document.getElementById('modal-title')
const modalSave    = document.getElementById('modal-save')
const modalCancel  = document.getElementById('modal-cancel')
const modalClose   = document.getElementById('modal-close')
const modalError   = document.getElementById('modal-error')

// ══════════════════════════════════════════════════════════════
//  Init
// ══════════════════════════════════════════════════════════════
async function init() {
  try {
    const vehiculos = await api.getAutomotor()
    dbCount.textContent = `${vehiculos.length} vehículos en base`

    vehiculos.sort((a,b) => a.modelo.localeCompare(b.modelo))
    for (const v of vehiculos) {
      const opt = document.createElement('option')
      opt.value = v.modelo
      opt.textContent = `${v.marca.toUpperCase()} ${v.modelo.toUpperCase()}`
      selM1.appendChild(opt)
    }
    setStatus('Listo')
  } catch(e) {
  console.error(e)
  setStatus('⚠ Error: ' + e.message)
}
}

// ══════════════════════════════════════════════════════════════
//  Eventos selectores
// ══════════════════════════════════════════════════════════════
selM1.addEventListener('change', async () => {
  const m = selM1.value
  selM2.innerHTML = '<option value="">Cargando…</option>'
  selM2.disabled = true

  if (!m) {
    selM2.innerHTML = '<option value="">Primero seleccioná nuestro modelo…</option>'
    return
  }

  try {
    const comp = await api.getCompetencia(m)
    selM2.innerHTML = '<option value="">Seleccioná competencia…</option>'
    comp.sort((a,b) => a.modelo.localeCompare(b.modelo))
    for (const v of comp) {
      const opt = document.createElement('option')
      opt.value = v.modelo
      opt.textContent = `${v.marca.toUpperCase()} ${v.modelo.toUpperCase()}`
      selM2.appendChild(opt)
    }
    selM2.disabled = false
    setStatus(`Modelo seleccionado: ${m.toUpperCase()}`)
  } catch(e) {
    selM2.innerHTML = '<option value="">Error cargando competencia</option>'
  }
})

// ══════════════════════════════════════════════════════════════
//  Acciones
// ══════════════════════════════════════════════════════════════
btnFicha1.addEventListener('click', async () => {
  const m = selM1.value
  if (!m) return alertSelect('Seleccioná nuestro modelo primero.')
  setStatus('Cargando…')
  try {
    state.p1    = await api.getVehiculo(m)
    state.p2    = null
    state.modo  = 'ficha1'
    state.promos1 = await api.getPromociones(m)
    state.promos2 = null
    renderAllTabs()
    switchTab('general')
    dotActive()
    setStatus(`Ficha: ${m.toUpperCase()}`)
  } catch(e) { setStatus('Error: ' + e.message) }
})

btnFicha2.addEventListener('click', async () => {
  const m = selM2.value
  if (!m) return alertSelect('Seleccioná el modelo de competencia primero.')
  setStatus('Cargando…')
  try {
    // mostramos solo la ficha de competencia en la columna izquierda
    state.p1    = await api.getVehiculo(m)
    state.p2    = null
    state.modo  = 'ficha2'
    state.promos1 = await api.getPromociones(m)
    state.promos2 = null
    renderAllTabs()
    switchTab('general')
    dotActive()
    setStatus(`Ficha competencia: ${m.toUpperCase()}`)
  } catch(e) { setStatus('Error: ' + e.message) }
})

btnComp.addEventListener('click', async () => {
  const m1 = selM1.value, m2 = selM2.value
  if (!m1 || !m2) return alertSelect('Seleccioná ambos modelos para comparar.')
  setStatus('Comparando…')
  try {
    const { modelo1, modelo2 } = await api.comparar(m1, m2)
    state.p1    = modelo1
    state.p2    = modelo2
    state.modo  = 'comparar'
    const [pr1, pr2] = await Promise.all([
      api.getPromociones(m1),
      api.getPromociones(m2),
    ])
    state.promos1 = pr1
    state.promos2 = pr2
    renderAllTabs()
    switchTab('scorecard')
    dotActive()
    setStatus(`Comparación: ${m1.toUpperCase()} vs ${m2.toUpperCase()}`)
  } catch(e) { setStatus('Error: ' + e.message) }
})

// ══════════════════════════════════════════════════════════════
//  Tabs
// ══════════════════════════════════════════════════════════════
tabBar.addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn')
  if (!btn) return
  switchTab(btn.dataset.tab)
})

function switchTab(name) {
  state.activeTab = name
  tabBar.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name))
  renderTab(name)
}

// ── renderiza todos los tabs en memoria, muestra el activo ────
const tabCache = {}

function renderAllTabs() {
  // limpiar caché
  Object.keys(tabCache).forEach(k => delete tabCache[k])
  renderTab(state.activeTab)
}

function renderTab(name) {
  if (!state.p1) return

  if (!tabCache[name]) {
    tabCache[name] = buildTab(name)
  }
  tabContent.innerHTML = tabCache[name]
  // forzar animación de barras del scorecard
  if (name === 'scorecard') {
    requestAnimationFrame(() => {
      tabContent.querySelectorAll('.bar-fill').forEach(b => {
        const w = b.style.width
        b.style.width = '0'
        requestAnimationFrame(() => { b.style.width = w })
      })
    })
  }
}

function buildTab(name) {
  const { p1, p2, promos1, promos2 } = state
  switch(name) {
    case 'general':        return renderGeneral(p1, p2)
    case 'dimensiones':    return renderDimensiones(p1, p2)
    case 'caracteristicas':return renderCaracteristicas(p1, p2)
    case 'precios':        return renderPrecios(p1, p2)
    case 'scorecard':      return renderScorecard(p1, p2)
    case 'promociones':    return buildPromoTab()
    default:               return ''
  }
}

function buildPromoTab() {
  const { p1, p2, promos1, promos2 } = state
  const n1 = p1.modelo.toUpperCase()
  const n2 = p2 ? p2.modelo.toUpperCase() : null

  let html = '<div class="promo-wrap">'
  html += renderPromoCol(p1.modelo, n1, 'var(--accent)',  promos1 ?? {})
  if (p2) {
    html += renderPromoCol(p2.modelo, n2, 'var(--accent2)', promos2 ?? {})
  }
  html += '</div>'
  return html
}

// ══════════════════════════════════════════════════════════════
//  Modal de Promoción
// ══════════════════════════════════════════════════════════════
window._openPromoModal = function(modelo) {
  state.modalModelo = modelo
  modalTitle.textContent = `Nueva Promoción · ${modelo.toUpperCase()}`
  document.getElementById('promo-cuotas').value  = ''
  document.getElementById('promo-bonif').value   = ''
  document.getElementById('promo-desc').value    = ''
  document.getElementById('promo-hasta').value   = ''
  modalError.hidden = true
  modalOverlay.hidden = false
}

function closeModal() { modalOverlay.hidden = true }
modalClose.addEventListener('click', closeModal)
modalCancel.addEventListener('click', closeModal)
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal() })

modalSave.addEventListener('click', async () => {
  const cuotas  = document.getElementById('promo-cuotas').value.trim()
  const bonif   = document.getElementById('promo-bonif').value.trim()
  const desc    = document.getElementById('promo-desc').value.trim()
  const hasta   = document.getElementById('promo-hasta').value.trim()

  if (!cuotas && !bonif && !desc) {
    showModalError('Completá al menos un campo.')
    return
  }
  if (hasta && !/^\d{4}-\d{2}-\d{2}$/.test(hasta)) {
    showModalError('Formato de fecha inválido. Usar AAAA-MM-DD.')
    return
  }

  modalSave.disabled = true
  modalSave.textContent = 'Guardando…'
  try {
    await api.crearPromocion(state.modalModelo, { cuotas, bonificacion: bonif, descripcion: desc, hasta })
    // refrescar promos del modelo afectado
    const m = state.modalModelo
    const nuevas = await api.getPromociones(m)
    if (m === state.p1?.modelo) state.promos1 = nuevas
    if (m === state.p2?.modelo) state.promos2 = nuevas
    // borrar caché del tab promociones y re-renderizar
    delete tabCache['promociones']
    if (state.activeTab === 'promociones') renderTab('promociones')
    closeModal()
    setStatus(`Promoción agregada: ${m.toUpperCase()}`)
  } catch(e) {
    showModalError(e.message)
  } finally {
    modalSave.disabled = false
    modalSave.textContent = 'Guardar Promoción'
  }
})

function showModalError(msg) {
  modalError.textContent = msg
  modalError.hidden = false
}

// ══════════════════════════════════════════════════════════════
//  Eliminar promo (llamado desde HTML generado)
// ══════════════════════════════════════════════════════════════
window._deletePromo = async function(modelo, idx) {
  if (!confirm('¿Eliminás esta promoción?')) return
  try {
    await api.eliminarPromocion(modelo, idx)
    const nuevas = await api.getPromociones(modelo)
    if (modelo === state.p1?.modelo) state.promos1 = nuevas
    if (modelo === state.p2?.modelo) state.promos2 = nuevas
    delete tabCache['promociones']
    if (state.activeTab === 'promociones') renderTab('promociones')
    setStatus(`Promoción eliminada: ${modelo.toUpperCase()}`)
  } catch(e) { alert('Error al eliminar: ' + e.message) }
}

// ══════════════════════════════════════════════════════════════
//  Helpers UI
// ══════════════════════════════════════════════════════════════
function setStatus(msg) { statusMsg.textContent = msg }
function dotActive()    { statusDot.classList.add('active') }
function alertSelect(msg) { alert(msg) }

// ══════════════════════════════════════════════════════════════
//  Arrancar
// ══════════════════════════════════════════════════════════════
init()
