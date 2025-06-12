"use client"

import { Input } from "@/components/ui/input"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, FileText, Clock, MessageSquare, Upload, Download } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { enviarComentario } from "@/lib/tramites"

// Datos de ejemplo para mostrar en la interfaz
const tramiteEjemplo = {
  id: "TRM-2025-001",
  tipo: "Licencia de Construcción",
  fechaInicio: "2025-05-01",
  estado: "En proceso",
  prioridad: "Alta",
  ultimaActualizacion: "2025-05-10",
  descripcion: "Solicitud de licencia para construcción residencial en Av. Principal 123",
  direccion: "Av. Principal 123",
  telefono: "555-123-4567",
  email: "usuario@ejemplo.com",
  documentos: [
    { nombre: "Planos arquitectónicos", url: "#", fechaSubida: "2025-05-01" },
    { nombre: "Título de propiedad", url: "#", fechaSubida: "2025-05-01" },
    { nombre: "Identificación del solicitante", url: "#", fechaSubida: "2025-05-01" },
  ],
  historial: [
    {
      fecha: "2025-05-01",
      estado: "Recibido",
      descripcion: "Trámite recibido y registrado en el sistema",
      usuario: "Sistema",
    },
    {
      fecha: "2025-05-03",
      estado: "En revisión",
      descripcion: "Documentación en revisión por el departamento de obras públicas",
      usuario: "Ana Martínez",
    },
    {
      fecha: "2025-05-07",
      estado: "Documentación incompleta",
      descripcion: "Se requiere plano adicional de instalaciones eléctricas",
      usuario: "Carlos Rodríguez",
    },
    {
      fecha: "2025-05-08",
      estado: "Documentación actualizada",
      descripcion: "Usuario ha subido el plano de instalaciones eléctricas",
      usuario: "Sistema",
    },
    {
      fecha: "2025-05-10",
      estado: "En proceso",
      descripcion: "Trámite en proceso de aprobación final",
      usuario: "Ana Martínez",
    },
  ],
  comentarios: [
    {
      id: 1,
      usuario: "Carlos Rodríguez",
      fecha: "2025-05-07",
      contenido: "Por favor, suba el plano de instalaciones eléctricas para continuar con el proceso.",
      rol: "administrativo",
    },
    {
      id: 2,
      usuario: "Juan Pérez",
      fecha: "2025-05-08",
      contenido: "He subido el plano solicitado. Por favor, confirmar si es correcto.",
      rol: "ciudadano",
    },
    {
      id: 3,
      usuario: "Ana Martínez",
      fecha: "2025-05-10",
      contenido: "El plano ha sido revisado y aprobado. Su trámite está en la fase final de aprobación.",
      rol: "administrativo",
    },
  ],
  predicciones: {
    tiempoEstimado: "7 días",
    probabilidadAprobacion: "85%",
    posiblesProblemas: ["Verificación de medidas en planos", "Validación de permisos zonales"],
    recomendaciones: ["Mantener documentación actualizada", "Responder rápidamente a solicitudes adicionales"],
  },
}

export default function DetalleTramitePage() {
  const params = useParams()
  const tramiteId = params.id as string
  const [comentario, setComentario] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [tramite, setTramite] = useState(tramiteEjemplo)

  // En una implementación real, aquí se cargarían los datos del trámite desde la API
  // usando el ID obtenido de los parámetros de la URL

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "en proceso":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            En proceso
          </Badge>
        )
      case "pendiente":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pendiente
          </Badge>
        )
      case "completado":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completado
          </Badge>
        )
      case "rechazado":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rechazado
          </Badge>
        )
      case "recibido":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Recibido
          </Badge>
        )
      case "en revisión":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            En revisión
          </Badge>
        )
      case "documentación incompleta":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Documentación incompleta
          </Badge>
        )
      case "documentación actualizada":
        return (
          <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
            Documentación actualizada
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "alta":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Alta</Badge>
      case "media":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Media</Badge>
      case "baja":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Baja</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  const handleComentarioSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comentario.trim()) return

    setEnviando(true)
    try {
      // En una implementación real, aquí se enviaría el comentario a la API
      await enviarComentario(tramiteId, comentario)

      // Simulamos la adición del comentario al estado local
      const nuevoComentario = {
        id: tramite.comentarios.length + 1,
        usuario: "Juan Pérez",
        fecha: new Date().toISOString().split("T")[0],
        contenido: comentario,
        rol: "ciudadano",
      }

      setTramite({
        ...tramite,
        comentarios: [...tramite.comentarios, nuevoComentario],
      })

      setComentario("")
    } catch (error) {
      console.error("Error al enviar comentario:", error)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link href="/tramites">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Volver a Trámites
          </Button>
        </Link>
        <h1 className="text-3xl font-bold ml-4">Detalle del Trámite</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{tramite.tipo}</CardTitle>
                  <CardDescription>{tramite.id}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(tramite.estado)}
                  {getPriorityBadge(tramite.prioridad)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Descripción</h3>
                <p className="text-sm text-muted-foreground">{tramite.descripcion}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Dirección</h3>
                  <p className="text-sm text-muted-foreground">{tramite.direccion}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Contacto</h3>
                  <p className="text-sm text-muted-foreground">
                    {tramite.telefono} | {tramite.email}
                  </p>
                </div>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <FileText className="mr-1 h-3 w-3" />
                  Iniciado: {new Date(tramite.fechaInicio).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  Última actualización: {new Date(tramite.ultimaActualizacion).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="historial">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="historial">Historial</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="comentarios">Comentarios</TabsTrigger>
            </TabsList>
            <TabsContent value="historial">
              <Card>
                <CardHeader>
                  <CardTitle>Historial del Trámite</CardTitle>
                  <CardDescription>Seguimiento cronológico del estado del trámite</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 border-l">
                    {tramite.historial.map((evento, index) => (
                      <div key={index} className="mb-6 relative">
                        <div className="absolute -left-[25px] mt-1.5 h-4 w-4 rounded-full bg-primary"></div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{evento.estado}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(evento.fecha).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{evento.descripcion}</p>
                          <span className="text-xs text-muted-foreground mt-1">Por: {evento.usuario}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="documentos">
              <Card>
                <CardHeader>
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>Documentos asociados al trámite</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tramite.documentos.map((documento, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{documento.nombre}</p>
                            <p className="text-xs text-muted-foreground">
                              Subido el {new Date(documento.fechaSubida).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={documento.url}>
                            <Download className="h-4 w-4 mr-1" />
                            Descargar
                          </Link>
                        </Button>
                      </div>
                    ))}

                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Subir documento adicional</h3>
                      <div className="flex gap-2">
                        <Input type="file" className="flex-1" />
                        <Button>
                          <Upload className="h-4 w-4 mr-1" />
                          Subir
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comentarios">
              <Card>
                <CardHeader>
                  <CardTitle>Comentarios</CardTitle>
                  <CardDescription>Comunicación relacionada con el trámite</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tramite.comentarios.map((comentario) => (
                      <div
                        key={comentario.id}
                        className={`p-4 rounded-lg ${
                          comentario.rol === "administrativo" ? "bg-muted" : "bg-primary/5"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {comentario.usuario
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{comentario.usuario}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comentario.fecha).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comentario.contenido}</p>
                      </div>
                    ))}

                    <Separator className="my-4" />

                    <form onSubmit={handleComentarioSubmit}>
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Escriba un comentario o consulta..."
                          value={comentario}
                          onChange={(e) => setComentario(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end">
                          <Button type="submit" disabled={enviando || !comentario.trim()}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {enviando ? "Enviando..." : "Enviar Comentario"}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Inteligente</CardTitle>
              <CardDescription>Predicciones basadas en Machine Learning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Tiempo estimado de resolución</h3>
                <p className="text-2xl font-bold">{tramite.predicciones.tiempoEstimado}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Probabilidad de aprobación</h3>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: tramite.predicciones.probabilidadAprobacion }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{tramite.predicciones.probabilidadAprobacion}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Posibles problemas detectados</h3>
                <ul className="text-sm space-y-1">
                  {tramite.predicciones.posiblesProblemas.map((problema, index) => (
                    <li key={index} className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive mr-2"></span>
                      {problema}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Recomendaciones</h3>
                <ul className="text-sm space-y-1">
                  {tramite.predicciones.recomendaciones.map((recomendacion, index) => (
                    <li key={index} className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                      {recomendacion}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Descargar todos los documentos
              </Button>
              <Button className="w-full" variant="outline">
                Solicitar actualización de estado
              </Button>
              {tramite.estado === "Documentación incompleta" && (
                <Button className="w-full">Subir documentos faltantes</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
