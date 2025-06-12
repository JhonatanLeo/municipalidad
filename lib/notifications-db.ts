import { supabase, type Notificacion } from "./supabase"

// Crear notificación en la base de datos
export async function crearNotificacion(
  usuarioId: string,
  tramiteId: string,
  tipo: Notificacion["tipo"],
  titulo: string,
  mensaje: string,
  canal: Notificacion["canal"] = "plataforma",
): Promise<Notificacion> {
  try {
    const { data, error } = await supabase
      .from("notificaciones")
      .insert({
        usuario_id: usuarioId,
        tramite_id: tramiteId,
        tipo,
        titulo,
        mensaje,
        canal,
        enviado: canal === "plataforma", // Las notificaciones de plataforma se marcan como enviadas inmediatamente
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creando notificación:", error)
    throw error
  }
}

// Obtener notificaciones de un usuario
export async function getNotificacionesUsuario(
  usuarioId: string,
  limite = 50,
  soloNoLeidas = false,
): Promise<Notificacion[]> {
  try {
    let query = supabase.from("notificaciones").select("*").eq("usuario_id", usuarioId)

    if (soloNoLeidas) {
      query = query.eq("leida", false)
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(limite)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error obteniendo notificaciones:", error)
    throw error
  }
}

// Marcar notificación como leída
export async function marcarNotificacionLeida(notificacionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notificaciones")
      .update({
        leida: true,
        fecha_lectura: new Date().toISOString(),
      })
      .eq("id", notificacionId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error marcando notificación como leída:", error)
    return false
  }
}

// Marcar todas las notificaciones como leídas
export async function marcarTodasNotificacionesLeidas(usuarioId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notificaciones")
      .update({
        leida: true,
        fecha_lectura: new Date().toISOString(),
      })
      .eq("usuario_id", usuarioId)
      .eq("leida", false)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error marcando todas las notificaciones como leídas:", error)
    return false
  }
}

// Obtener conteo de notificaciones no leídas
export async function getConteoNotificacionesNoLeidas(usuarioId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("notificaciones")
      .select("*", { count: "exact", head: true })
      .eq("usuario_id", usuarioId)
      .eq("leida", false)

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error("Error obteniendo conteo de notificaciones no leídas:", error)
    return 0
  }
}

// Eliminar notificación
export async function eliminarNotificacion(notificacionId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("notificaciones").delete().eq("id", notificacionId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error eliminando notificación:", error)
    return false
  }
}

// Notificar cambio de estado de trámite
export async function notificarCambioEstado(
  tramiteId: string,
  usuarioId: string,
  nuevoEstado: string,
  numeroTramite: string,
) {
  const mensajes = {
    recibido: "Su trámite ha sido recibido y está siendo procesado.",
    en_revision: "Su trámite está siendo revisado por nuestro equipo.",
    documentacion_incompleta: "Se requiere documentación adicional para continuar con su trámite.",
    en_proceso: "Su trámite está en proceso de aprobación.",
    aprobado: "¡Felicitaciones! Su trámite ha sido aprobado.",
    rechazado: "Su trámite ha sido rechazado. Revise los comentarios para más información.",
    completado: "Su trámite ha sido completado exitosamente.",
  }

  const mensaje = mensajes[nuevoEstado as keyof typeof mensajes] || "El estado de su trámite ha cambiado."
  const titulo = `Actualización de trámite ${numeroTramite}`

  try {
    // Crear notificación en la plataforma
    await crearNotificacion(usuarioId, tramiteId, "estado_cambio", titulo, mensaje, "plataforma")

    // Aquí se pueden agregar otros canales como email o SMS
    // await enviarNotificacionEmail(usuarioEmail, titulo, mensaje)
    // await enviarNotificacionSMS(usuarioTelefono, mensaje)

    return true
  } catch (error) {
    console.error("Error enviando notificación de cambio de estado:", error)
    return false
  }
}

// Notificar nuevo comentario
export async function notificarNuevoComentario(
  tramiteId: string,
  usuarioId: string,
  numeroTramite: string,
  autorComentario: string,
) {
  const titulo = `Nuevo comentario en trámite ${numeroTramite}`
  const mensaje = `${autorComentario} ha agregado un comentario a su trámite.`

  try {
    await crearNotificacion(usuarioId, tramiteId, "comentario", titulo, mensaje, "plataforma")
    return true
  } catch (error) {
    console.error("Error enviando notificación de nuevo comentario:", error)
    return false
  }
}

// Notificar documento requerido
export async function notificarDocumentoRequerido(
  tramiteId: string,
  usuarioId: string,
  numeroTramite: string,
  documentoRequerido: string,
) {
  const titulo = `Documento requerido - Trámite ${numeroTramite}`
  const mensaje = `Se requiere el siguiente documento para continuar con su trámite: ${documentoRequerido}`

  try {
    await crearNotificacion(usuarioId, tramiteId, "documento_requerido", titulo, mensaje, "plataforma")
    return true
  } catch (error) {
    console.error("Error enviando notificación de documento requerido:", error)
    return false
  }
}
