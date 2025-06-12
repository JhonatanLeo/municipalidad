import {
  supabase,
  isSupabaseAvailable,
  type Tramite,
  type TipoTramite,
  type Documento,
  type Comentario,
} from "./supabase"

// Obtener tipos de trámites disponibles
export async function getTiposTramites(): Promise<TipoTramite[]> {
  if (!isSupabaseAvailable()) {
    // Return mock data for preview - Updated to 2025
    return [
      {
        id: "tipo1",
        codigo: "LIC_CONSTRUCCION",
        nombre: "Licencia de Construcción",
        descripcion: "Permiso para construcción de vivienda",
        documentos_requeridos: ["Planos arquitectónicos", "Título de propiedad", "Identificación del solicitante"],
        tiempo_estimado_dias: 30,
        costo: 150.0,
        activo: true,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "tipo2",
        codigo: "CERT_RESIDENCIA",
        nombre: "Certificado de Residencia",
        descripcion: "Certificado que acredita residencia",
        documentos_requeridos: ["Identificación", "Comprobante de domicilio"],
        tiempo_estimado_dias: 3,
        costo: 25.0,
        activo: true,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "tipo3",
        codigo: "PERM_COMERCIAL",
        nombre: "Permiso Comercial",
        descripcion: "Permiso para establecimiento comercial",
        documentos_requeridos: ["Registro fiscal", "Identificación del propietario", "Contrato de arrendamiento"],
        tiempo_estimado_dias: 7,
        costo: 75.0,
        activo: true,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "tipo4",
        codigo: "RECLAMO_SERVICIOS",
        nombre: "Reclamo por Servicios",
        descripcion: "Presentación de reclamo por servicios municipales",
        documentos_requeridos: ["Identificación", "Comprobante de pago", "Evidencia del problema"],
        tiempo_estimado_dias: 5,
        costo: 0.0,
        activo: true,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      },
    ]
  }

  try {
    const { data, error } = await supabase!.from("tipos_tramites").select("*").eq("activo", true).order("nombre")

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error obteniendo tipos de trámites:", error)
    throw error
  }
}

// Crear nuevo trámite
export async function crearTramite(
  formData: {
    tipoTramite: string
    descripcion: string
    direccion: string
    telefono: string
    email: string
    urgencia: string
  },
  files: { [key: string]: File | null },
  usuarioId: string,
) {
  if (!isSupabaseAvailable()) {
    // Return mock response for preview - Updated to 2025
    return `TRM-2025-${String(Date.now()).slice(-6)}`
  }

  try {
    // 1. Obtener el tipo de trámite
    const { data: tipoTramite, error: tipoError } = await supabase!
      .from("tipos_tramites")
      .select("*")
      .eq("codigo", formData.tipoTramite)
      .single()

    if (tipoError) throw tipoError

    // 2. Generate a simple number for now (instead of using RPC) - Updated to 2025
    const numeroTramite = `TRM-2025-${String(Date.now()).slice(-6)}`

    // 3. Create the tramite (without ML analysis for now)
    const { data: tramite, error: tramiteError } = await supabase!
      .from("tramites")
      .insert({
        numero_tramite: numeroTramite,
        usuario_id: usuarioId,
        tipo_tramite_id: tipoTramite.id,
        descripcion: formData.descripcion,
        direccion_tramite: formData.direccion,
        prioridad: "media", // Default priority
        datos_adicionales: {
          telefono: formData.telefono,
          email: formData.email,
          urgencia: formData.urgencia,
        },
        costo_total: tipoTramite.costo,
        fecha_limite: new Date(Date.now() + tipoTramite.tiempo_estimado_dias * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (tramiteError) throw tramiteError

    // 4. Handle file uploads (simplified for now)
    const documentosSubidos = []
    for (const [nombreDoc, archivo] of Object.entries(files)) {
      if (archivo) {
        const nombreArchivo = `${tramite.id}/${nombreDoc}_${Date.now()}_${archivo.name}`

        try {
          // Subir archivo a Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase!.storage
            .from("documentos-tramites")
            .upload(nombreArchivo, archivo)

          if (uploadError) {
            console.error("Error subiendo archivo:", uploadError)
            continue
          }

          // Obtener URL pública del archivo
          const { data: urlData } = supabase!.storage.from("documentos-tramites").getPublicUrl(nombreArchivo)

          // Guardar referencia del documento en la base de datos
          const { data: documento, error: docError } = await supabase!
            .from("documentos")
            .insert({
              tramite_id: tramite.id,
              nombre_documento: nombreDoc,
              nombre_archivo: archivo.name,
              url_archivo: urlData.publicUrl,
              tipo_mime: archivo.type,
              tamaño_bytes: archivo.size,
              requerido: true,
              subido_por: usuarioId,
            })
            .select()
            .single()

          if (!docError) {
            documentosSubidos.push(documento)
          }
        } catch (fileError) {
          console.error("Error processing file:", fileError)
        }
      }
    }

    return tramite.numero_tramite
  } catch (error) {
    console.error("Error creando trámite:", error)
    throw error
  }
}

// Obtener trámites de un usuario
export async function getTramitesUsuario(usuarioId: string): Promise<Tramite[]> {
  if (!isSupabaseAvailable()) {
    // Return mock data for preview - Updated to 2025
    return [
      {
        id: "1",
        numero_tramite: "TRM-2025-001",
        usuario_id: usuarioId,
        tipo_tramite_id: "tipo1",
        descripcion: "Solicitud de licencia para construcción residencial en Av. Principal 123",
        estado: "En proceso",
        prioridad: "Alta",
        fecha_inicio: "2025-01-15",
        fecha_limite: "2025-02-15",
        costo_total: 150.0,
        created_at: "2025-01-15T10:00:00Z",
        updated_at: "2025-01-20T14:30:00Z",
        tipo_tramite: {
          id: "tipo1",
          codigo: "LIC_CONSTRUCCION",
          nombre: "Licencia de Construcción",
          descripcion: "Permiso para construcción de vivienda",
          documentos_requeridos: ["Planos", "Escritura"],
          tiempo_estimado_dias: 30,
          costo: 150.0,
          activo: true,
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-01-01T00:00:00Z",
        },
      },
      {
        id: "2",
        numero_tramite: "TRM-2025-002",
        usuario_id: usuarioId,
        tipo_tramite_id: "tipo2",
        descripcion: "Solicitud de certificado de residencia para trámites bancarios",
        estado: "Completado",
        prioridad: "Media",
        fecha_inicio: "2025-01-10",
        fecha_limite: "2025-01-13",
        costo_total: 25.0,
        created_at: "2025-01-10T09:00:00Z",
        updated_at: "2025-01-12T16:45:00Z",
        tipo_tramite: {
          id: "tipo2",
          codigo: "CERT_RESIDENCIA",
          nombre: "Certificado de Residencia",
          descripcion: "Certificado que acredita residencia",
          documentos_requeridos: ["DNI", "Comprobante domicilio"],
          tiempo_estimado_dias: 3,
          costo: 25.0,
          activo: true,
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-01-01T00:00:00Z",
        },
      },
    ]
  }

  try {
    // Simplified query without complex relationships
    const { data, error } = await supabase!
      .from("tramites")
      .select("*")
      .eq("usuario_id", usuarioId)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Get tipos_tramites separately if needed
    if (data && data.length > 0) {
      const { data: tiposTramites } = await supabase!.from("tipos_tramites").select("*")

      return data.map((tramite) => ({
        ...tramite,
        tipo_tramite: tiposTramites?.find((tipo) => tipo.id === tramite.tipo_tramite_id) || null,
      }))
    }

    return data || []
  } catch (error) {
    console.error("Error obteniendo trámites del usuario:", error)
    throw error
  }
}

// Obtener todos los trámites (para administradores)
export async function getAllTramites(): Promise<Tramite[]> {
  if (!isSupabaseAvailable()) {
    return []
  }

  try {
    const { data, error } = await supabase!.from("tramites").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error obteniendo todos los trámites:", error)
    throw error
  }
}

// Obtener trámite por ID
export async function getTramiteById(tramiteId: string): Promise<Tramite | null> {
  if (!isSupabaseAvailable()) {
    return null
  }

  try {
    const { data, error } = await supabase!.from("tramites").select("*").eq("id", tramiteId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error obteniendo trámite por ID:", error)
    return null
  }
}

// Obtener trámite por número
export async function getTramiteByNumero(numeroTramite: string): Promise<Tramite | null> {
  if (!isSupabaseAvailable()) {
    return null
  }

  try {
    const { data, error } = await supabase!.from("tramites").select("*").eq("numero_tramite", numeroTramite).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error obteniendo trámite por número:", error)
    return null
  }
}

// Actualizar estado de trámite
export async function actualizarEstadoTramite(
  tramiteId: string,
  nuevoEstado: string,
  observaciones?: string,
  usuarioId?: string,
) {
  if (!isSupabaseAvailable()) {
    return null
  }

  try {
    const updates: any = {
      estado: nuevoEstado,
      updated_at: new Date().toISOString(),
    }

    if (observaciones) {
      updates.observaciones = observaciones
    }

    if (usuarioId) {
      updates.asignado_a = usuarioId
    }

    const { data, error } = await supabase!.from("tramites").update(updates).eq("id", tramiteId).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error actualizando estado del trámite:", error)
    throw error
  }
}

// Enviar comentario
export async function enviarComentario(
  tramiteId: string,
  contenido: string,
  usuarioId = "preview-user",
  tipo: "comentario" | "consulta" | "respuesta" | "observacion" = "comentario",
): Promise<Comentario | null> {
  if (!isSupabaseAvailable()) {
    // Return mock comment for preview
    return {
      id: Date.now().toString(),
      tramite_id: tramiteId,
      usuario_id: usuarioId,
      contenido,
      tipo,
      publico: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  try {
    const { data, error } = await supabase!
      .from("comentarios")
      .insert({
        tramite_id: tramiteId,
        usuario_id: usuarioId,
        contenido,
        tipo,
        publico: true,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error enviando comentario:", error)
    throw error
  }
}

// Subir documento adicional
export async function subirDocumento(
  tramiteId: string,
  nombreDocumento: string,
  archivo: File,
  usuarioId: string,
  requerido = false,
): Promise<Documento | null> {
  if (!isSupabaseAvailable()) {
    return null
  }

  try {
    const nombreArchivo = `${tramiteId}/${nombreDocumento}_${Date.now()}_${archivo.name}`

    // Subir archivo a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase!.storage
      .from("documentos-tramites")
      .upload(nombreArchivo, archivo)

    if (uploadError) throw uploadError

    // Obtener URL pública del archivo
    const { data: urlData } = supabase!.storage.from("documentos-tramites").getPublicUrl(nombreArchivo)

    // Guardar referencia del documento en la base de datos
    const { data: documento, error: docError } = await supabase!
      .from("documentos")
      .insert({
        tramite_id: tramiteId,
        nombre_documento: nombreDocumento,
        nombre_archivo: archivo.name,
        url_archivo: urlData.publicUrl,
        tipo_mime: archivo.type,
        tamaño_bytes: archivo.size,
        requerido,
        subido_por: usuarioId,
      })
      .select()
      .single()

    if (docError) throw docError
    return documento
  } catch (error) {
    console.error("Error subiendo documento:", error)
    throw error
  }
}

// Obtener estadísticas de trámites
export async function getEstadisticasTramites(fechaInicio?: string, fechaFin?: string) {
  if (!isSupabaseAvailable()) {
    return null
  }

  try {
    // Simplified statistics query
    const { data, error } = await supabase!.from("tramites").select("estado, prioridad, created_at")

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)
    throw error
  }
}

// Buscar trámites
export async function buscarTramites(
  termino: string,
  filtros?: {
    estado?: string
    tipo?: string
    prioridad?: string
    fechaInicio?: string
    fechaFin?: string
  },
): Promise<Tramite[]> {
  if (!isSupabaseAvailable()) {
    return []
  }

  try {
    let query = supabase!.from("tramites").select("*")

    // Filtro de búsqueda por término
    if (termino) {
      query = query.or(`numero_tramite.ilike.%${termino}%,descripcion.ilike.%${termino}%`)
    }

    // Aplicar filtros adicionales
    if (filtros?.estado) {
      query = query.eq("estado", filtros.estado)
    }
    if (filtros?.tipo) {
      query = query.eq("tipo_tramite_id", filtros.tipo)
    }
    if (filtros?.prioridad) {
      query = query.eq("prioridad", filtros.prioridad)
    }
    if (filtros?.fechaInicio) {
      query = query.gte("fecha_inicio", filtros.fechaInicio)
    }
    if (filtros?.fechaFin) {
      query = query.lte("fecha_inicio", filtros.fechaFin)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error buscando trámites:", error)
    throw error
  }
}
