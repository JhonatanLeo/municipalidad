import { supabase, type Usuario } from "./supabase"

// Registrar nuevo usuario
export async function registerUser(userData: {
  nombre: string
  apellido: string
  documento: string
  email: string
  password: string
}) {
  try {
    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    })

    if (authError) throw authError

    if (!authData.user) {
      throw new Error("No se pudo crear el usuario")
    }

    // 2. Crear perfil de usuario en la tabla usuarios
    const { data: usuario, error: userError } = await supabase
      .from("usuarios")
      .insert({
        id: authData.user.id,
        email: userData.email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        documento: userData.documento,
        tipo_usuario: "ciudadano",
      })
      .select()
      .single()

    if (userError) throw userError

    return usuario
  } catch (error) {
    console.error("Error en registro:", error)
    throw error
  }
}

// Iniciar sesión
export async function loginUser(email: string, password: string, userType?: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Obtener datos del usuario desde la tabla usuarios
    const { data: usuario, error: userError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (userError) throw userError

    // Verificar tipo de usuario si se especificó
    if (userType && userType !== "ciudadano" && usuario.tipo_usuario === "ciudadano") {
      throw new Error("No tiene permisos para acceder como administrativo")
    }

    // Actualizar última conexión
    await supabase.from("usuarios").update({ ultima_conexion: new Date().toISOString() }).eq("id", data.user.id)

    return { user: data.user, profile: usuario }
  } catch (error) {
    console.error("Error en login:", error)
    throw error
  }
}

// Obtener usuario actual
export async function getCurrentUser(): Promise<{ user: any; profile: Usuario } | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile, error } = await supabase.from("usuarios").select("*").eq("id", user.id).single()

    if (error) throw error

    return { user, profile }
  } catch (error) {
    console.error("Error obteniendo usuario actual:", error)
    return null
  }
}

// Cerrar sesión
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Actualizar perfil de usuario
export async function updateUserProfile(userId: string, updates: Partial<Usuario>) {
  try {
    const { data, error } = await supabase.from("usuarios").update(updates).eq("id", userId).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error actualizando perfil:", error)
    throw error
  }
}

// Verificar si el usuario es administrador
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("usuarios").select("tipo_usuario").eq("id", userId).single()

    if (error) return false
    return ["administrativo", "supervisor"].includes(data.tipo_usuario)
  } catch (error) {
    return false
  }
}

// Obtener todos los usuarios (solo para administradores)
export async function getAllUsers(): Promise<Usuario[]> {
  try {
    const { data, error } = await supabase.from("usuarios").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error obteniendo usuarios:", error)
    throw error
  }
}
