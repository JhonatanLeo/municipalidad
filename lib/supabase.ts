import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have valid Supabase configuration
const hasValidConfig =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("placeholder") &&
  !supabaseAnonKey.includes("placeholder") &&
  supabaseUrl.startsWith("https://") &&
  supabaseUrl.includes("supabase.co")

// Create Supabase client only if we have valid configuration
export const supabase = hasValidConfig ? createClient(supabaseUrl, supabaseAnonKey) : null

// Helper function to check if Supabase is available and working
export const isSupabaseAvailable = () => {
  return hasValidConfig && supabase !== null
}

// Helper function to test Supabase connection
export const testSupabaseConnection = async () => {
  if (!isSupabaseAvailable()) {
    return { success: false, error: "Supabase not configured" }
  }

  try {
    // Test connection by trying to fetch from a simple table
    const { data, error } = await supabase!.from("tipos_tramites").select("count").limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Supabase connection test error:", error)
    return { success: false, error: "Connection failed" }
  }
}

// Tipos de base de datos
export interface Usuario {
  id: string
  email: string
  nombre: string
  apellido: string
  documento: string
  telefono?: string
  direccion?: string
  tipo_usuario: "ciudadano" | "administrativo" | "supervisor"
  activo: boolean
  fecha_registro: string
  ultima_conexion?: string
  created_at: string
  updated_at: string
}

export interface TipoTramite {
  id: string
  codigo: string
  nombre: string
  descripcion?: string
  documentos_requeridos: string[]
  tiempo_estimado_dias: number
  costo: number
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Tramite {
  id: string
  numero_tramite: string
  usuario_id: string
  tipo_tramite_id: string
  estado:
    | "recibido"
    | "en_revision"
    | "documentacion_incompleta"
    | "en_proceso"
    | "aprobado"
    | "rechazado"
    | "completado"
  prioridad: "baja" | "media" | "alta" | "urgente"
  descripcion: string
  direccion_tramite?: string
  datos_adicionales?: any
  asignado_a?: string
  fecha_inicio: string
  fecha_limite?: string
  fecha_completado?: string
  tiempo_resolucion_dias?: number
  costo_total: number
  observaciones?: string
  created_at: string
  updated_at: string
  // Relaciones
  usuario?: Usuario
  tipo_tramite?: TipoTramite
  documentos?: Documento[]
  comentarios?: Comentario[]
  historial?: HistorialTramite[]
}

export interface Documento {
  id: string
  tramite_id: string
  nombre_documento: string
  nombre_archivo: string
  url_archivo: string
  tipo_mime?: string
  tamaño_bytes?: number
  requerido: boolean
  aprobado: boolean
  observaciones?: string
  subido_por: string
  fecha_subida: string
  created_at: string
  updated_at: string
}

export interface HistorialTramite {
  id: string
  tramite_id: string
  estado_anterior?: string
  estado_nuevo: string
  comentario?: string
  usuario_id?: string
  fecha_cambio: string
  datos_adicionales?: any
  created_at: string
  // Relaciones
  usuario?: Usuario
}

export interface Comentario {
  id: string
  tramite_id: string
  usuario_id: string
  contenido: string
  tipo: "comentario" | "consulta" | "respuesta" | "observacion"
  publico: boolean
  fecha_comentario: string
  created_at: string
  updated_at: string
  // Relaciones
  usuario?: Usuario
}

export interface Notificacion {
  id: string
  usuario_id: string
  tramite_id: string
  tipo: "estado_cambio" | "documento_requerido" | "aprobacion" | "rechazo" | "recordatorio" | "comentario"
  titulo: string
  mensaje: string
  canal: "email" | "sms" | "plataforma" | "push"
  enviado: boolean
  leida: boolean
  fecha_envio?: string
  fecha_lectura?: string
  datos_adicionales?: any
  created_at: string
  updated_at: string
}

export interface Metrica {
  id: string
  fecha: string
  tipo_metrica: string
  valor: number
  unidad?: string
  categoria?: string
  datos_adicionales?: any
  created_at: string
}
