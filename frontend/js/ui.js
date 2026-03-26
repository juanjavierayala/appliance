// ══════════════════════════════════════════════════════════════
//  UI helpers
// ══════════════════════════════════════════════════════════════

const SECCIONES = {
  General: [
    ['Modelo','modelo'],['Marca','marca'],['Concesionaria','concesionaria'],
    ['Segmento','segmento'],['Motor','tipo_motor'],['Combustible','combustible'],
    ['Transmisión','transmision'],['Tracción','traccion'],['Puertas','puertas'],
    ['Pasajeros','pasajeros'],['Cilindros','cilindros'],['Potencia (HP)','potencia_hp'],
    ['Torque (Nm)','torque_nm'],['Consumo (L/100km)','consumo_ruta'],['Precio (USD)','precio'],
  ],
  Dimensiones: [
    ['Largo Total (mm)','largo_mm'],['Ancho Total (mm)','ancho_mm'],
    ['Alto Total (mm)','alto_mm'],['Distancia Ejes (mm)','distancia_ejes_mm'],
    ['Despeje Suelo (mm)','despeje_suelo_mm'],['Peso (kg)','peso_kg'],
    ['Tanque (L)','capacidad_tanque_l'],['Baúl (L)','baul_litros'],
  ],
  Caracteristicas: {
    Interiores: [
      ['A/C Automático','ac_automatico'],['A/C Bi-Zona','ac_bizona'],
      ['Asiento Elec. Conductor','asiento_electrico_conductor'],
      ['Asientos Calefactados','asientos_calefactados'],['Asientos Forrados','asientos_forrados'],
      ['Asientos Traseros Plegables','asientos_traseros_plegables'],
      ['Botón de Encendido','boton_encendido'],['Comandos al Volante','comandos_volante'],
      ['Levanta Vidrios Automático','levanta_vidrios_auto'],
      ['Sistema de Altavoces','sistema_altavoces'],['Volante Forrado','volante_forrado'],
    ],
    Exteriores: [
      ['Apagado Luces Automático','apagado_luces_auto'],
      ['Central Mando a Distancia','central_mando_distancia'],
      ['Luces Delanteras Automáticas','luces_delanteras_auto'],
      ['Espejos Calefactados','espejos_calefactados'],['Espejos con Luz de Giro','espejos_luz_giro'],
      ['Espejos Eléctricos','espejos_electricos'],['Faros Full LED','faros_full_led'],
      ['Faros Traseros LED','faros_traseros_led'],['Llanta Aleación Aluminio','llanta_aleacion_aluminio'],
      ['Techo Solar Panorámico','techo_solar_panoramico'],['Valijera Eléctrica','valijera_electrica'],
    ],
    Seguridad: [
      ['ABS','abs_frenos'],['Airbag Conductor','airbag_conductor'],
      ['Airbag Copiloto','airbag_copiloto'],['Airbag Cortina','airbag_cortina'],
      ['Airbag Lateral','airbag_lateral'],['Anclaje ISOFIX','isofix'],
      ['Control Crucero','control_crucero'],['Limitador de Velocidad','limitador_velocidad'],
      ['Asistencia Punto Ciego','asistencia_punto_ciego'],['Cámara de Retroceso','camara_retroceso'],
      ['Control Frenado Bajadas','control_frenado_bajadas'],
      ['Freno Estacionamiento Elec.','freno_estacionamiento_electrico'],
      ['Control de Estabilidad','control_estabilidad'],
      ['Sensor Parking Delantero','sensor_parking_delantero'],
      ['Sensor Parking Trasero','sensor_parking_trasero'],
    ],
    Tecnología: [
      ['Android Auto / Apple CarPlay','android_auto_carplay'],
      ['Cargador Inalámbrico','cargador_inalambrico'],['Computadora a Bordo','computadora_abordo'],
      ['Encendido Remoto','encendido_remoto'],['Llave Inteligente','llave_inteligente'],
      ['Modos de Conducción','modos_conduccion'],['Pantalla Multimedia','pantalla_multimedia'],
      ['Tomas USB','tomas_usb'],
    ],
  },
  Precios: [
    ['Modelo','modelo'],['Marca','marca'],['Concesionaria','concesionaria'],
    ['Motor','tipo_motor'],['Transmisión','transmision'],['Precio (USD)','precio'],
  ],
}

// ── helpers pequeños ──────────────────────────────────────────
function fmtVal(label, val) {
  const v = String(val ?? '—').trim()
  if (label.toLowerCase().includes('precio')) {
    const n = parseFloat(v)
    if (!isNaN(n)) return '$ ' + n.toLocaleString('es-PY')
  }
  if (v.toLowerCase() === 'si' || v.toLowerCase() === 'sí') return '✓  Sí'
  if (v.toLowerCase() === 'no') return '✗  No'
  return v || '—'
}

function valClass(val) {
  const v = String(val ?? '').trim().toLowerCase()
  if (['si','sí','✓'].includes(v)) return 'ok'
  if (v === 'no') return 'nok'
  return ''
}

function diffBadge(label, v1, v2) {
  try {
    const n1 = parseFloat(String(v1).replace(/[$,]/g,''))
    const n2 = parseFloat(String(v2).replace(/[$,]/g,''))
    if (isNaN(n1) || isNaN(n2) || n1 === n2) return ''
    const pct = Math.abs((n1-n2)/n2*100)
    if (pct < 1) return ''
    const up = n1 > n2
    return `<span class="diff-badge ${up?'diff-up':'diff-down'}">${up?'▲':'▼'} ${Math.round(pct)}%</span>`
  } catch { return '' }
}

function sectionHeader(text, cls='') {
  return `<div class="data-section-header ${cls}">${text}</div>`
}

// ── fila individual ───────────────────────────────────────────
function dataRow(label, v1, v2, alt) {
  const altClass = alt ? ' alt' : ''
  const fv1 = fmtVal(label, v1)
  const vc1 = valClass(v1)
  if (v2 === undefined) {
    return `<div class="data-row${altClass}">
      <span class="data-label">${label}</span>
      <span class="data-val ${vc1}">${fv1}</span>
    </div>`
  }
  const fv2 = fmtVal(label, v2)
  const vc2 = valClass(v2)
  const diff = diffBadge(label, v1, v2)
  return `<div class="data-row${altClass}">
    <span class="data-label">${label}</span>
    <span class="data-val ${vc1}">${fv1}${diff}</span>
    <span class="data-val comp-sep"></span>
    <span class="data-val ${vc2}">${fv2}</span>
  </div>`
}

// ── encabezado de comparación ─────────────────────────────────
function compHeader(p1, p2) {
  if (!p2) return ''
  return `<div class="comp-header">
    <span class="comp-header-spacer"></span>
    <span class="comp-name n1">${p1.modelo.toUpperCase()}</span>
    <span class="comp-name n2">${p2.modelo.toUpperCase()}</span>
  </div>`
}

// ── renderiza lista de campos ─────────────────────────────────
function renderCampos(campos, p1, p2) {
  return campos.map(([lbl,key], i) =>
    dataRow(lbl, p1[key], p2?.[key], i%2===0)
  ).join('')
}

// ══════════════════════════════════════════════════════════════
//  TABS
// ══════════════════════════════════════════════════════════════

function renderGeneral(p1, p2) {
  return compHeader(p1,p2)
    + sectionHeader('ⓘ  Características Básicas')
    + renderCampos(SECCIONES.General, p1, p2)
}

function renderDimensiones(p1, p2) {
  return compHeader(p1,p2)
    + sectionHeader('⊡  Dimensiones')
    + renderCampos(SECCIONES.Dimensiones, p1, p2)
}

function renderCaracteristicas(p1, p2) {
  const iconos = {Interiores:'🛋',Exteriores:'🚘',Seguridad:'🛡',Tecnología:'⚙'}
  const colores = {Interiores:'',Exteriores:'',Seguridad:'warn',Tecnología:''}
  let html = compHeader(p1,p2)
  for (const [sub, campos] of Object.entries(SECCIONES.Caracteristicas)) {
    html += sectionHeader(`${iconos[sub]}  ${sub}`, colores[sub]||'')
    html += renderCampos(campos, p1, p2)
  }
  return html
}

function renderPrecios(p1, p2) {
  return compHeader(p1,p2)
    + sectionHeader('◈  Información de Precio', 'gold')
    + renderCampos(SECCIONES.Precios, p1, p2)
}

// ── SCORECARD ─────────────────────────────────────────────────
function renderScorecard(p1, p2) {
  const n1 = p1.modelo.toUpperCase()
  const n2 = p2 ? p2.modelo.toUpperCase() : ''

  let legend = ''
  if (p2) {
    legend = `<div class="sc-legend">
      <div class="sc-legend-item"><div class="sc-legend-dot" style="background:var(--accent)"></div><span>${n1}</span></div>
      <div class="sc-legend-item"><div class="sc-legend-dot" style="background:var(--accent2)"></div><span>${n2}</span></div>
    </div>`
  }

  let catsHtml = ''
  let wins1 = 0, wins2 = 0

  for (const cat of SCORECARD_CATS) {
    const s1r = calcularScore(p1, cat)
    const s2r = p2 ? calcularScore(p2, cat) : null
    const [s1, s2] = p2 ? normalizarScores(s1r, s2r) : [s1r, null]

    let winnerHtml = ''
    if (p2) {
      if (s1 > s2)       { winnerHtml = `<span class="sc-cat-winner" style="color:var(--success)">✓ ${n1} lidera</span>`; wins1++ }
      else if (s2 > s1)  { winnerHtml = `<span class="sc-cat-winner" style="color:var(--warn)">✓ ${n2} lidera</span>`;   wins2++ }
      else                { winnerHtml = `<span class="sc-cat-winner" style="color:var(--muted)">Empate</span>` }
    }

    const bar1 = `<div class="bar-row">
      <span class="bar-score" style="color:${cat.color}">${Math.round(s1)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${s1}%;background:var(--accent)"></div></div>
    </div>`

    const bar2 = p2 ? `<div class="bar-row">
      <span class="bar-score" style="color:${cat.color}">${Math.round(s2)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${s2}%;background:var(--accent2)"></div></div>
    </div>` : ''

    const barsHtml = p2
      ? `<div style="display:flex;gap:8px;padding:0 16px 12px">
           <div style="flex:1">${bar1}</div>
           <div style="flex:1">${bar2}</div>
         </div>`
      : bar1

    catsHtml += `<div class="sc-cat">
      <div class="sc-cat-header">
        <span class="sc-cat-title" style="color:${cat.color}">${cat.icon}  ${cat.label}</span>
        <span class="sc-cat-meta">Peso: ${cat.peso}%</span>
        ${winnerHtml}
      </div>
      ${barsHtml}
    </div>`
  }

  // score global
  const sg1 = scoreGlobal(p1)
  const sg2 = p2 ? scoreGlobal(p2) : null

  let resultHtml = ''
  if (p2) {
    let rTxt, rCol
    if (sg1 > sg2)       { rTxt = `🏆 ${n1} gana en ${wins1} de ${SCORECARD_CATS.length} categorías`; rCol = 'var(--success)' }
    else if (sg2 > sg1)  { rTxt = `🏆 ${n2} gana en ${wins2} de ${SCORECARD_CATS.length} categorías`; rCol = 'var(--warn)' }
    else                  { rTxt = '🤝 Empate técnico'; rCol = 'var(--muted)' }
    resultHtml = `<span class="sc-result" style="color:${rCol}">${rTxt}</span>`
  }

  const globalHtml = `<div class="sc-global">
    <span class="sc-global-label">SCORE GLOBAL</span>
    <div class="sc-score-box" style="background:var(--accent)">${n1} — ${sg1} / 100</div>
    ${p2 ? `<div class="sc-score-box" style="background:var(--accent2)">${n2} — ${sg2} / 100</div>` : ''}
    ${resultHtml}
  </div>`

  // ventajas clave
  let ventajasHtml = ''
  if (p2) {
    const vents = [], dsvents = []
    for (const [campo, texto] of VENTAJAS_CHECKS) {
      const t1 = ['si','sí'].includes((p1[campo]??'').trim().toLowerCase())
      const t2 = ['si','sí'].includes((p2[campo]??'').trim().toLowerCase())
      if (t1 && !t2) vents.push(texto)
      else if (t2 && !t1) dsvents.push(texto)
    }
    try {
      const pr1 = parseFloat(p1.precio), pr2 = parseFloat(p2.precio)
      if (!isNaN(pr1)&&!isNaN(pr2)) {
        if (pr1<pr2) vents.push(`Precio menor ($${pr1.toLocaleString('es-PY')} vs $${pr2.toLocaleString('es-PY')})`)
        else if (pr2<pr1) dsvents.push(`Precio mayor ($${pr1.toLocaleString('es-PY')} vs $${pr2.toLocaleString('es-PY')})`)
      }
    } catch {}
    try {
      const h1=parseFloat(p1.potencia_hp), h2=parseFloat(p2.potencia_hp)
      if (!isNaN(h1)&&!isNaN(h2)) {
        if (h1>h2) vents.push(`Mayor potencia (${h1} HP vs ${h2} HP)`)
        else if (h2>h1) dsvents.push(`Menor potencia (${h1} HP vs ${h2} HP)`)
      }
    } catch {}

    const mkItems = (arr, col) => arr.length
      ? arr.map(i=>`<div class="sc-vent-item" style="border-color:#2a4a2a;background:#161f16;color:${col}">▸ ${i}</div>`).join('')
      : `<div style="padding:8px 12px;color:var(--muted);font-size:.85rem">Sin ventajas exclusivas.</div>`

    ventajasHtml = `<div class="sc-ventajas">
      <div class="sc-vent-col" style="border:1px solid #2a4a2a">
        <div class="sc-vent-hdr" style="background:#1a3a1a;color:var(--success)">✓ VENTAJAS DE ${n1}</div>
        ${mkItems(vents,'var(--success)')}
      </div>
      <div class="sc-vent-col" style="border:1px solid #4a2a2a">
        <div class="sc-vent-hdr" style="background:#3a1a1a;color:var(--warn)">✗ VENTAJAS DE ${n2}</div>
        ${mkItems(dsvents,'var(--warn)')}
      </div>
    </div>`
  }

  return `<div class="scorecard-wrap">
    <div class="sc-header">
      <span class="sc-title">★  SCORECARD DE VENTAJAS</span>
      ${legend}
    </div>
    ${catsHtml}
    ${globalHtml}
    ${ventajasHtml}
  </div>`
}

// ── PROMOCIONES ───────────────────────────────────────────────
function renderPromoCard(promo, modelo, formIdx) {
  const fuente = promo.fuente ?? 'form'
  const esCsv  = fuente.startsWith('csv')
  const vigente = !promo.hasta || new Date(promo.hasta) >= new Date()

  const origenBadges = {
    csv_modelo: ['📄 CSV · Modelo', '#0F766E'],
    csv_marca:  ['📄 CSV · Marca',  '#0369A1'],
    form:       [null, null],
  }
  const [origTxt, origBg] = origenBadges[fuente] ?? [null, null]

  const typeBadges = {
    cuotas:       ['💳 Cuotas s/interés', '#22D3EE'],
    bonificacion: ['🎁 Bonificación',      '#A78BFA'],
    descripcion:  ['📝 Descripción',        'var(--muted)'],
  }

  const tipos = []
  if (promo.cuotas)      tipos.push(['cuotas',promo.cuotas])
  if (promo.bonificacion) tipos.push(['bonificacion',promo.bonificacion])
  if (promo.descripcion) tipos.push(['descripcion',promo.descripcion])

  const origBadgeHtml = origTxt
    ? `<span class="promo-origin-badge" style="background:${origBg}">${origTxt}</span>
       ${fuente==='csv_marca'&&promo._marca ? `<span style="font-size:.7rem;color:var(--muted)">${promo._marca}</span>` : ''}`
    : ''

  const typeBadgeHtml = !esCsv && tipos.length
    ? (() => { const [k] = tipos[0]; const [t,c] = typeBadges[k]??['','']; return `<span class="promo-type-badge" style="background:${c}">${t}</span>` })()
    : ''

  const hastaHtml = promo.hasta
    ? `<span class="promo-hasta ${vigente?'':'vencida'}">Hasta: ${promo.hasta}</span>` : ''

  const actionHtml = esCsv
    ? `<span class="promo-readonly">solo lectura</span>`
    : formIdx !== null
      ? `<button class="promo-delete-btn" onclick="window._deletePromo('${modelo}',${formIdx})">✕</button>`
      : ''

  const bodyHtml = tipos.map(([,v]) =>
    `<div>${v}</div>`
  ).join('')

  return `<div class="promo-card ${vigente?'':'vencida'}">
    <div class="promo-card-top">
      ${origBadgeHtml}${typeBadgeHtml}${hastaHtml}${actionHtml}
    </div>
    <div class="promo-card-body">${bodyHtml}</div>
  </div>`
}

function renderPromoCol(modelo, nombre, color, promoData) {
  const { vigentes = [], vencidas = [] } = promoData
  const allPromos = [...vigentes, ...vencidas]

  // forma de obtener formIdx: contar cuántas promos de 'form' hay antes
  let formCounter = 0
  function getFormIdx(promo) {
    if (promo.fuente !== 'form') return null
    return formCounter++
  }

  const vigentesHtml = vigentes.length
    ? `<div class="promo-group-label vigente">✓  VIGENTES</div>`
      + vigentes.map(p => { const fi = getFormIdx(p); return renderPromoCard(p, modelo, fi) }).join('')
    : ''

  const vencidasHtml = vencidas.length
    ? `<div class="promo-group-label">⏰  VENCIDAS</div>`
      + vencidas.map(p => { const fi = getFormIdx(p); return renderPromoCard(p, modelo, fi) }).join('')
    : ''

  const emptyHtml = !allPromos.length
    ? `<p class="promo-empty">Sin promociones cargadas.<br>Usá el botón para agregar o cargá el CSV.</p>`
    : ''

  const badge = vigentes.length
  return `<div class="promo-col" style="border-color:${color}">
    <div class="promo-col-header" style="background:${color}">
      <span class="promo-col-title">${nombre}</span>
      <span class="promo-badge" style="background:${badge?'var(--promo)':'var(--muted)'}">${badge}</span>
    </div>
    <div class="promo-list">
      ${vigentesHtml}${vencidasHtml}${emptyHtml}
    </div>
    <button class="promo-add-btn" onclick="window._openPromoModal('${modelo}')">＋ Agregar Promoción</button>
  </div>`
}
