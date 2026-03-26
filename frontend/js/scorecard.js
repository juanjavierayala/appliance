const SCORECARD_CATS = [
  { label:'Seguridad',   icon:'🛡', color:'#EF4444', peso:25,
    campos:[['abs_frenos','bool'],['airbag_conductor','bool'],['airbag_copiloto','bool'],
            ['airbag_cortina','bool'],['airbag_lateral','bool'],['isofix','bool'],
            ['asistencia_punto_ciego','bool'],['camara_retroceso','bool'],
            ['control_frenado_bajadas','bool'],['freno_estacionamiento_electrico','bool'],
            ['control_estabilidad','bool'],['sensor_parking_delantero','bool'],
            ['sensor_parking_trasero','bool'],['airbags','num_max']] },
  { label:'Tecnología',  icon:'⚙', color:'#3B82F6', peso:20,
    campos:[['android_auto_carplay','bool'],['cargador_inalambrico','bool'],
            ['computadora_abordo','bool'],['encendido_remoto','bool'],
            ['llave_inteligente','bool'],['pantalla_multimedia','bool'],['tomas_usb','num_max']] },
  { label:'Confort',     icon:'🛋', color:'#8B5CF6', peso:20,
    campos:[['ac_automatico','bool'],['ac_bizona','bool'],['asiento_electrico_conductor','bool'],
            ['asientos_calefactados','bool'],['asientos_forrados','bool'],
            ['asientos_traseros_plegables','bool'],['techo_solar_panoramico','bool'],
            ['valijera_electrica','bool'],['comandos_volante','bool'],['sistema_altavoces','num_max']] },
  { label:'Performance', icon:'⚡', color:'#F59E0B', peso:20,
    campos:[['potencia_hp','num_max'],['torque_nm','num_max'],['consumo_ruta','num_min']] },
  { label:'Equipamiento Exterior', icon:'🚘', color:'#22C55E', peso:15,
    campos:[['faros_full_led','bool'],['faros_traseros_led','bool'],['espejos_electricos','bool'],
            ['espejos_calefactados','bool'],['luces_delanteras_auto','bool'],['llanta_aleacion_aluminio','bool']] },
]

function parseNum(val) {
  if (!val) return NaN
  return parseFloat(String(val).split('"')[0].replace(',', '.'))
}

function calcularScore(p, cat) {
  let total = 0, mx = 0
  for (const [campo, tipo] of cat.campos) {
    const val = (p[campo] ?? '').trim().toLowerCase()
    if (tipo === 'bool') {
      mx++
      if (['si','sí','✓','yes','1'].includes(val)) total++
    } else {
      const n = parseNum(val)
      if (!isNaN(n)) { mx++; total += n }
    }
  }
  return mx === 0 ? 0 : Math.round(total / mx * 1000) / 10
}

function normalizarScores(s1, s2) {
  const mx = Math.max(s1, s2)
  if (mx === 0) return [0, 0]
  return [Math.round(s1/mx*1000)/10, Math.round(s2/mx*1000)/10]
}

function scoreGlobal(p) {
  let total = 0, pesoTotal = 0
  for (const cat of SCORECARD_CATS) {
    total     += calcularScore(p, cat) * cat.peso
    pesoTotal += cat.peso
  }
  return pesoTotal ? Math.round(total / pesoTotal * 10) / 10 : 0
}

const VENTAJAS_CHECKS = [
  ['techo_solar_panoramico',         'Techo solar panorámico'],
  ['ac_bizona',                      'A/C Bi-Zona'],
  ['asiento_electrico_conductor',    'Asiento eléctrico conductor'],
  ['asientos_calefactados',          'Asientos calefactados'],
  ['cargador_inalambrico',           'Cargador inalámbrico'],
  ['valijera_electrica',             'Valijera eléctrica'],
  ['faros_full_led',                 'Faros Full LED'],
  ['asistencia_punto_ciego',         'Asistencia punto ciego'],
  ['freno_estacionamiento_electrico','Freno estacionamiento eléctrico'],
  ['android_auto_carplay',           'Android Auto / Apple CarPlay'],
  ['llave_inteligente',              'Llave inteligente'],
  ['encendido_remoto',               'Encendido remoto'],
  ['isofix',                         'Anclaje ISOFIX'],
  ['sensor_parking_delantero',       'Sensor parking delantero'],
  ['sensor_parking_trasero',         'Sensor parking trasero'],
]
