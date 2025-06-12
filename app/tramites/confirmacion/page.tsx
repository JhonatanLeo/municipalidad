"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Home } from "lucide-react"

export default function ConfirmacionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tramiteId = searchParams.get("id")
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Si no hay ID de trámite, redirigir a la página de trámites
    if (!tramiteId) {
      router.push("/tramites")
      return
    }

    // Cuenta regresiva para redirección automática
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push(`/tramites/${tramiteId}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [tramiteId, router])

  if (!tramiteId) {
    return null // No renderizar nada mientras se redirecciona
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">¡Trámite Enviado Exitosamente!</CardTitle>
          <CardDescription>Su trámite ha sido registrado con el identificador:</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">{tramiteId}</p>
          <p className="mt-4 text-muted-foreground">
            Hemos enviado un correo electrónico con los detalles de su trámite. Puede consultar el estado en cualquier
            momento a través de nuestra plataforma.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" asChild>
            <Link href={`/tramites/${tramiteId}`}>
              Ver Detalle del Trámite
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/tramites">Ver Todos mis Trámites</Link>
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Link>
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Redireccionando automáticamente en {countdown} segundos...
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
