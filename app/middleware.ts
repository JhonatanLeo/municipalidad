import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verificar sesión del usuario
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rutas que requieren autenticación
  const protectedRoutes = ["/tramites", "/admin", "/perfil"]
  const adminRoutes = ["/admin"]

  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  const isAdminRoute = adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Redirigir a login si no hay sesión en ruta protegida
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Verificar permisos de administrador
  if (isAdminRoute && session) {
    const { data: usuario } = await supabase.from("usuarios").select("tipo_usuario").eq("id", session.user.id).single()

    if (!usuario || !["administrativo", "supervisor"].includes(usuario.tipo_usuario)) {
      return NextResponse.redirect(new URL("/tramites", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
