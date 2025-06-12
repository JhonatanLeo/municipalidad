// Funciones de Machine Learning para análisis y optimización
export interface TramiteData {
  id: string
  tipo: string
  fechaInicio: string
  estado: string
  prioridad: string
  tiempoResolucion?: number
  errores?: string[]
}

export interface PrediccionTramite {
  tiempoEstimado: string
  probabilidadAprobacion: string
  posiblesProblemas: string[]
  recomendaciones: string[]
}

// Análisis de priorización inteligente
export function analizarPrioridadInteligente(tramites: TramiteData[]): TramiteData[] {
  return tramites.map((tramite) => {
    let score = 0

    // Factores de priorización
    const tiposPrioridad = {
      "Licencia de Construcción": 3,
      "Reclamo por Servicios": 3,
      "Permiso Comercial": 2,
      "Permiso de Evento": 2,
      "Certificado de Residencia": 1,
    }

    score += tiposPrioridad[tramite.tipo] || 1

    // Tiempo transcurrido
    const diasTranscurridos = Math.floor((Date.now() - new Date(tramite.fechaInicio).getTime()) / (1000 * 60 * 60 * 24))

    if (diasTranscurridos > 7) score += 2
    else if (diasTranscurridos > 3) score += 1

    // Determinar nueva prioridad
    let nuevaPrioridad = "Baja"
    if (score >= 5) nuevaPrioridad = "Alta"
    else if (score >= 3) nuevaPrioridad = "Media"

    return {
      ...tramite,
      prioridad: nuevaPrioridad,
    }
  })
}

// Detección de cuellos de botella
export function detectarCuellosDeBottella(tramites: TramiteData[]) {
  const fases = [
    "Recepción",
    "Revisión de documentación",
    "Verificación técnica",
    "Aprobación departamental",
    "Emisión final",
  ]

  const tiemposPorFase = fases.map((fase) => ({
    fase,
    tiempoPromedio: Math.random() * 3 + 1, // Simulado
    cantidadTramites: Math.floor(Math.random() * 50) + 10,
    porcentajeRetrasos: Math.random() * 30 + 5,
  }))

  // Ordenar por tiempo promedio descendente
  return tiemposPorFase.sort((a, b) => b.tiempoPromedio - a.tiempoPromedio)
}

// Predicción de errores comunes
export function predecirErroresComunes(tipoTramite: string, documentos: string[]): string[] {
  const erroresPorTipo = {
    "Licencia de Construcción": [
      "Planos sin firma de arquitecto",
      "Medidas inconsistentes",
      "Falta certificado de zonificación",
    ],
    "Permiso Comercial": [
      "Registro fiscal vencido",
      "Falta certificado de bomberos",
      "Documentos de propiedad incompletos",
    ],
    "Certificado de Residencia": ["Comprobante de domicilio antiguo", "Identificación vencida"],
  }

  const erroresPosibles = erroresPorTipo[tipoTramite] || []

  // Simular análisis de ML para determinar probabilidad de cada error
  return erroresPosibles.filter(() => Math.random() > 0.7)
}

// Generación de predicciones para un trámite específico
export function generarPrediccionesTramite(tramite: TramiteData): PrediccionTramite {
  const tiemposPromedio = {
    "Licencia de Construcción": 8,
    "Permiso Comercial": 5,
    "Certificado de Residencia": 2,
    "Reclamo por Servicios": 4,
    "Permiso de Evento": 3,
  }

  const tiempoBase = tiemposPromedio[tramite.tipo] || 5
  const factorPrioridad = tramite.prioridad === "Alta" ? 0.7 : tramite.prioridad === "Media" ? 1.0 : 1.3
  const tiempoEstimado = Math.round(tiempoBase * factorPrioridad)

  // Calcular probabilidad de aprobación basada en factores históricos
  let probabilidad = 85 // Base
  if (tramite.errores && tramite.errores.length > 0) {
    probabilidad -= tramite.errores.length * 10
  }

  const posiblesProblemas = predecirErroresComunes(tramite.tipo, [])

  const recomendaciones = [
    "Mantener documentación actualizada",
    "Responder rápidamente a solicitudes adicionales",
    "Verificar requisitos específicos del tipo de trámite",
  ]

  return {
    tiempoEstimado: `${tiempoEstimado} días`,
    probabilidadAprobacion: `${Math.max(probabilidad, 20)}%`,
    posiblesProblemas,
    recomendaciones,
  }
}

// Análisis de tendencias y patrones
export function analizarTendencias(tramites: TramiteData[]) {
  const tramitesPorMes = {}
  const tiemposPorTipo = {}
  const erroresPorTipo = {}

  tramites.forEach((tramite) => {
    const mes = new Date(tramite.fechaInicio).toISOString().slice(0, 7)
    tramitesPorMes[mes] = (tramitesPorMes[mes] || 0) + 1

    if (tramite.tiempoResolucion) {
      if (!tiemposPorTipo[tramite.tipo]) {
        tiemposPorTipo[tramite.tipo] = []
      }
      tiemposPorTipo[tramite.tipo].push(tramite.tiempoResolucion)
    }

    if (tramite.errores) {
      erroresPorTipo[tramite.tipo] = (erroresPorTipo[tramite.tipo] || 0) + tramite.errores.length
    }
  })

  return {
    tramitesPorMes,
    tiemposPorTipo,
    erroresPorTipo,
  }
}

// Optimización de asignación de recursos
export function optimizarAsignacionRecursos(tramites: TramiteData[], personal: any[]) {
  // Algoritmo simplificado de asignación basado en:
  // - Carga de trabajo actual
  // - Especialización del personal
  // - Prioridad de los trámites

  const asignaciones = []

  tramites.forEach((tramite) => {
    // Encontrar el personal más adecuado
    const personalDisponible = personal.filter(
      (p) => p.especialidades.includes(tramite.tipo) && p.cargaActual < p.capacidadMaxima,
    )

    if (personalDisponible.length > 0) {
      // Seleccionar el que tenga menor carga actual
      const asignado = personalDisponible.reduce((min, current) =>
        current.cargaActual < min.cargaActual ? current : min,
      )

      asignaciones.push({
        tramiteId: tramite.id,
        personalId: asignado.id,
        tiempoEstimado: generarPrediccionesTramite(tramite).tiempoEstimado,
      })
    }
  })

  return asignaciones
}
