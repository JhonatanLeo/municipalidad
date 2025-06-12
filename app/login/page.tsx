"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loginUser } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const userType = formData.get("userType") as string

    try {
      await loginUser(email, password, userType)

      // Redirect based on user type
      if (userType === "ciudadano") {
        router.push("/tramites")
      } else {
        router.push("/admin")
      }
    } catch (err) {
      setError("Error al iniciar sesión. Verifique sus credenciales.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">Volver</Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Iniciar Sesión</h1>
          <p className="text-sm text-muted-foreground">Ingrese sus credenciales para acceder al sistema</p>
        </div>
        <Tabs defaultValue="ciudadano" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ciudadano">Ciudadano</TabsTrigger>
            <TabsTrigger value="administrativo">Administrativo</TabsTrigger>
          </TabsList>
          <TabsContent value="ciudadano">
            <Card>
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="userType" value="ciudadano" />
                <CardHeader>
                  <CardTitle>Acceso Ciudadano</CardTitle>
                  <CardDescription>Acceda para gestionar sus trámites</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" name="email" type="email" placeholder="nombre@ejemplo.com" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Contraseña</Label>
                      <Link
                        href="/recuperar-contrasena"
                        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                      >
                        ¿Olvidó su contraseña?
                      </Link>
                    </div>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  {error && <div className="text-sm font-medium text-destructive">{error}</div>}
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                  <div className="mt-4 text-center text-sm">
                    ¿No tiene una cuenta?{" "}
                    <Link href="/registro" className="underline underline-offset-4 hover:text-primary">
                      Registrarse
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="administrativo">
            <Card>
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="userType" value="administrativo" />
                <CardHeader>
                  <CardTitle>Acceso Administrativo</CardTitle>
                  <CardDescription>Acceda al panel de administración</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Correo electrónico</Label>
                    <Input id="admin-email" name="email" type="email" placeholder="admin@municipalidad.gob" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="admin-password">Contraseña</Label>
                      <Link
                        href="/recuperar-contrasena"
                        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                      >
                        ¿Olvidó su contraseña?
                      </Link>
                    </div>
                    <Input id="admin-password" name="password" type="password" required />
                  </div>
                  {error && <div className="text-sm font-medium text-destructive">{error}</div>}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
