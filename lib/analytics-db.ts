import { supabase, type Metrica } from "./supabase"

// Registrar métrica
export async function registrarMetrica(
  tipoMetrica: string,
  valor: number,
  unidad?: string,
  categoria?: string,
  datosAdicionales?: any,
  fecha?: string,
): Promise<Metrica> {
  try {
    const { data, error } = await supabase
      .from("metricas")
      .insert({
        fecha: fecha || new Date().toISOString().split("T")[0],
        tipo_metrica: tipoMetrica,
        valor,
        unidad,
        categoria,
        datos_adicionales: datosAdicionales,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error registrando métrica:", error)
    throw error
  }
}

// Obtener métricas por tipo y período
export async function getMetricas(
  tipoMetrica?: string,
  fechaInicio?: string,
  fechaFin?: string,
  categoria?: string,
): Promise<Metrica[]> {
  try {
    let query = supabase.from("metricas").select("*")

    if (tipoMetrica) {
      query = query.eq("tipo_metrica", tipoMetrica)
    }

    if (categoria) {
      query = query.eq("categoria", categoria)
    }

    if (fechaInicio) {
      query = query.gte("fecha", fechaInicio)
    }

    if (fechaFin) {
      query = query.lte("fecha", fechaFin)
    }

    const { data, error } = await query.order("fecha", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error obteniendo métricas:", error)
    throw error
  }
}

// Obtener estadísticas agregadas
export async function getEstadisticasAgregadas(fechaInicio?: string, fechaFin?: string) {
  try {
    const fechaInicioDefault =
      fechaInicio || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const fechaFinDefault = fechaFin || new Date().toISOString().split("T")[0]

    // Obtener estadísticas de trámites
    const { data: estadisticasTramites, error: errorTramites } = await supabase.rpc("obtener_estadisticas_tramites", {
      fecha_inicio: fechaInicioDefault,
      fecha_fin: fechaFinDefault,
    })

    if (errorTramites) throw errorTramites

    // Obtener métricas adicionales
    const metricas = await getMetricas(undefined, fechaInicioDefault, fechaFinDefault)

    // Procesar métricas por categoría
    const metricasPorCategoria = metricas.reduce(
      (acc, metrica) => {
        const categoria = metrica.categoria || "general"
        if (!acc[categoria]) {
          acc[categoria] = []
        }
        acc[categoria].push(metrica)
        return acc
      },
      {} as Record<string, Metrica[]>,
    )

    return {
      tramites: estadisticasTramites,
      metricas: metricasPorCategoria,
      periodo: {
        inicio: fechaInicioDefault,
        fin: fechaFinDefault,
      },
    }
  } catch (error) {
    console.error("Error obteniendo estadísticas agregadas:", error)
    throw error
  }
}

// Registrar métricas diarias automáticamente
export async function registrarMetricasDiarias() {
  try {
    const hoy = new Date().toISOString().split("T")[0]
    const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    // Contar trámites iniciados ayer
    const { count: tramitesIniciados, error: errorIniciados } = await supabase
      .from("tramites")
      .select("*", { count: "exact", head: true })
      .gte("fecha_inicio", ayer)
      .lt("fecha_inicio", hoy)

    if (!errorIniciados && tramitesIniciados !== null) {
      await registrarMetrica("tramites_iniciados", tramitesIniciados, "cantidad", "tramites", null, ayer)
    }

    // Contar trámites completados ayer
    const { count: tramitesCompletados, error: errorCompletados } = await supabase
      .from("tramites")
      .select("*", { count: "exact", head: true })
      .eq("estado", "completado")
      .gte("fecha_completado", ayer)
      .lt("fecha_completado", hoy)

    if (!errorCompletados && tramitesCompletados !== null) {
      await registrarMetrica("tramites_completados", tramitesCompletados, "cantidad", "tramites", null, ayer)
    }

    // Calcular tiempo promedio de resolución
    const { data: tiemposResolucion, error: errorTiempos } = await supabase
      .from("tramites")
      .select("tiempo_resolucion_dias")
      .eq("estado", "completado")
      .gte("fecha_completado", ayer)
      .lt("fecha_completado", hoy)
      .not("tiempo_resolucion_dias", "is", null)

    if (!errorTiempos && tiemposResolucion && tiemposResolucion.length > 0) {
      const tiempoPromedio =
        tiemposResolucion.reduce((sum, t) => sum + (t.tiempo_resolucion_dias || 0), 0) / tiemposResolucion.length
      await registrarMetrica("tiempo_promedio_resolucion", tiempoPromedio, "dias", "rendimiento", null, ayer)
    }

    return true
  } catch (error) {
    console.error("Error registrando métricas diarias:", error)
    return false
  }
}

// Detectar cuellos de botella
export async function detectarCuellosDeBottella(fechaInicio?: string, fechaFin?: string) {
  try {
    const fechaInicioDefault =
      fechaInicio || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const fechaFinDefault = fechaFin || new Date().toISOString().split("T")[0]

    // Analizar trámites por estado y tiempo transcurrido
    const { data: tramitesPorEstado, error } = await supabase
      .from("tramites")
      .select(`
        estado,
        fecha_inicio,
        tiempo_resolucion_dias,
        tipo_tramite:tipos_tramites(nombre)
      `)
      .gte("fecha_inicio", fechaInicioDefault)
      .lte("fecha_inicio", fechaFinDefault)

    if (error) throw error

    // Analizar tiempos por estado
    const analisisPorEstado =
      tramitesPorEstado?.reduce(
        (acc, tramite) => {
          const estado = tramite.estado
          const diasTranscurridos = Math.floor(
            (Date.now() - new Date(tramite.fecha_inicio).getTime()) / (1000 * 60 * 60 * 24),
          )

          if (!acc[estado]) {
            acc[estado] = {
              cantidad: 0,
              tiempoPromedio: 0,
              tiempoMaximo: 0,
              tramites: [],
            }
          }

          acc[estado].cantidad++
          acc[estado].tramites.push(diasTranscurridos)
          acc[estado].tiempoMaximo = Math.max(acc[estado].tiempoMaximo, diasTranscurridos)

          return acc
        },
        {} as Record<string, any>,
      ) || {}

    // Calcular promedios y identificar cuellos de botella
    const cuellosDeBottella = Object.entries(analisisPorEstado)
      .map(([estado, datos]) => {
        const tiempoPromedio = datos.tramites.reduce((sum: number, tiempo: number) => sum + tiempo, 0) / datos.cantidad

        return {
          estado,
          cantidad: datos.cantidad,
          tiempoPromedio: Math.round(tiempoPromedio * 100) / 100,
          tiempoMaximo: datos.tiempoMaximo,
          esCuelloDeBottella: tiempoPromedio > 7 || datos.tiempoMaximo > 15,
        }
      })
      .sort((a, b) => b.tiempoPromedio - a.tiempoPromedio)

    return cuellosDeBottella
  } catch (error) {
    console.error("Error detectando cuellos de botella:", error)
    throw error
  }
}

// Generar reporte de rendimiento
export async function generarReporteRendimiento(fechaInicio?: string, fechaFin?: string) {
  try {
    const estadisticas = await getEstadisticasAgregadas(fechaInicio, fechaFin)
    const cuellosDeBottella = await detectarCuellosDeBottella(fechaInicio, fechaFin)

    return {
      ...estadisticas,
      cuellosDeBottella,
      recomendaciones: generarRecomendaciones(estadisticas, cuellosDeBottella),
    }
  } catch (error) {
    console.error("Error generando reporte de rendimiento:", error)
    throw error
  }
}

// Generar recomendaciones basadas en análisis
function generarRecomendaciones(estadisticas: any, cuellosDeBottella: any[]) {
  const recomendaciones = []

  // Analizar cuellos de botella
  const cuellosSignificativos = cuellosDeBottella.filter((c) => c.esCuelloDeBottella)

  if (cuellosSignificativos.length > 0) {
    recomendaciones.push({
      tipo: "cuello_botella",
      prioridad: "alta",
      titulo: "Optimizar estados con mayor demora",
      descripcion: `Se detectaron ${cuellosSignificativos.length} estados con tiempos excesivos de procesamiento.`,
      acciones: [
        "Revisar procesos en estados con mayor demora",
        "Redistribuir carga de trabajo",
        "Automatizar validaciones donde sea posible",
      ],
    })
  }

  // Analizar volumen de trámites
  if (estadisticas.tramites?.total_tramites > 100) {
    recomendaciones.push({
      tipo: "volumen",
      prioridad: "media",
      titulo: "Alto volumen de trámites",
      descripcion: "El volumen de trámites está por encima del promedio.",
      acciones: [
        "Considerar aumentar personal en períodos pico",
        "Implementar más automatizaciones",
        "Mejorar formularios para reducir errores",
      ],
    })
  }

  return recomendaciones
}
