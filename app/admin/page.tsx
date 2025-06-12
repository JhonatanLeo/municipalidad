"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Clock, Filter, BarChart3, Users, LogOut } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Datos de ejemplo para mostrar en la interfaz
const tramitesEjemplo = [
  {
    id: "TRM-2025-001",
    tipo: "Licencia de Construcción",
    fechaInicio: "2025-05-01",
    estado: "En proceso",
    prioridad: "Alta",
    ultimaActualizacion: "2025-05-10",
    ciudadano: "Juan Pérez",
    descripcion: "Solicitud de licencia para construcción residencial",
    asignado: "Ana Martínez",
  },
  {
    id: "TRM-2025-002",
    tipo: "Permiso Comercial",
    fechaInicio: "2025-04-15",
    estado: "Pendiente",
    prioridad: "Media",
    ultimaActualizacion: "2025-04-20",
    ciudadano: "María López",
    descripcion: "Solicitud de permiso para local comercial",
    asignado: null,
  },
  {
    id: "TRM-2025-003",
    tipo: "Certificado de Residencia",
    fechaInicio: "2025-05-05",
    estado: "Completado",
    prioridad: "Baja",
    ultimaActualizacion: "2025-05-07",
    ciudadano: "Pedro Gómez",
    descripcion: "Solicitud de certificado de residencia",
    asignado: "Carlos Rodríguez",
  },
  {
    id: "TRM-2025-004",
    tipo: "Reclamo por Servicios",
    fechaInicio: "2025-05-08",
    estado: "Rechazado",
    prioridad: "Alta",
    ultimaActualizacion: "2025-05-12",
    ciudadano: "Laura Torres",
    descripcion: "Reclamo por falta de recolección de residuos",
    asignado: "Ana Martínez",
  },
  {
    id: "TRM-2025-005",
    tipo: "Licencia de Construcción",
    fechaInicio: "2025-05-11",
    estado: "Documentación incompleta",
    prioridad: "Media",
    ultimaActualizacion: "2025-05-13",
    ciudadano: "Roberto Sánchez",
    descripcion: "Solicitud de licencia para ampliación de vivienda",
    asignado: "Carlos Rodríguez",
  },
  {
    id: "TRM-2025-006",
    tipo: "Permiso de Evento",
    fechaInicio: "2025-05-12",
    estado: "Pendiente",
    prioridad: "Alta",
    ultimaActualizacion: "2025-05-12",
    ciudadano: "Sofía Ramírez",
    descripcion: "Solicitud de permiso para evento cultural",
    asignado: null,
  },
]

// Estadísticas para el dashboard
const estadisticas = {
  tramitesActivos: 42,
  tramitesCompletados: 128,
  tiempoPromedioResolucion: "5.3 días",
  tasaAprobacion: "78%",
  tramitesPorTipo: [
    { tipo: "Licencia de Construcción", cantidad: 45, porcentaje: 28 },
    { tipo: "Permiso Comercial", cantidad: 32, porcentaje: 20 },
    { tipo: "Certificado de Residencia", cantidad: 28, porcentaje: 17 },
    { tipo: "Reclamo por Servicios", cantidad: 25, porcentaje: 15 },
    { tipo: "Permiso de Evento", cantidad: 18, porcentaje: 11 },
    { tipo: "Otros", cantidad: 15, porcentaje: 9 },
  ],
  cuellosDeBottella: [
    { fase: "Revisión de documentación", tiempoPromedio: "2.1 días" },
    { fase: "Aprobación departamental", tiempoPromedio: "1.8 días" },
    { fase: "Verificación final", tiempoPromedio: "1.4 días" },
  ],
}

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTramites, setFilteredTramites] = useState(tramitesEjemplo)
  const [statusFilter, setStatusFilter] = useState("todos")

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value
    setSearchTerm(term)

    // Filtrar por término de búsqueda y estado
    filterTramites(term, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)

    // Filtrar por término de búsqueda y nuevo estado
    filterTramites(searchTerm, status)
  }

  const filterTramites = (term: string, status: string) => {
    let filtered = tramitesEjemplo

    // Filtrar por término de búsqueda
    if (term) {
      filtered = filtered.filter(
        (tramite) =>
          tramite.id.toLowerCase().includes(term.toLowerCase()) ||
          tramite.tipo.toLowerCase().includes(term.toLowerCase()) ||
          tramite.descripcion.toLowerCase().includes(term.toLowerCase()) ||
          tramite.ciudadano.toLowerCase().includes(term.toLowerCase()),
      )
    }

    // Filtrar por estado
    if (status !== "todos") {
      filtered = filtered.filter((tramite) => tramite.estado.toLowerCase() === status.toLowerCase())
    }

    setFilteredTramites(filtered)
  }

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
      case "documentación incompleta":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Documentación incompleta
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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r bg-background z-30">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <FileText className="h-5 w-5" />
            <span>Panel Administrativo</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/tramites"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <FileText className="h-4 w-4" />
              Trámites
            </Link>
            <Link
              href="/admin/usuarios"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Usuarios
            </Link>
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">Ana Martínez</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-1 mt-2" asChild>
            <Link href="/login">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex-1">
            <h1 className="text-lg font-semibold md:text-xl">Dashboard</h1>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-4 p-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="tramites">Trámites</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Trámites Activos</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{estadisticas.tramitesActivos}</div>
                    <p className="text-xs text-muted-foreground">+5% respecto al mes anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Trámites Completados</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{estadisticas.tramitesCompletados}</div>
                    <p className="text-xs text-muted-foreground">+12% respecto al mes anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{estadisticas.tiempoPromedioResolucion}</div>
                    <p className="text-xs text-muted-foreground">-0.8 días respecto al mes anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasa de Aprobación</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{estadisticas.tasaAprobacion}</div>
                    <p className="text-xs text-muted-foreground">+3% respecto al mes anterior</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Distribución por Tipo de Trámite</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {estadisticas.tramitesPorTipo.map((item) => (
                        <div key={item.tipo} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                              <span className="text-sm font-medium">{item.tipo}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {item.cantidad} ({item.porcentaje}%)
                            </span>
                          </div>
                          <Progress value={item.porcentaje} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Cuellos de Botella Identificados</CardTitle>
                    <CardDescription>Fases con mayor tiempo de procesamiento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {estadisticas.cuellosDeBottella.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{item.fase}</p>
                            <p className="text-sm text-muted-foreground">Tiempo promedio: {item.tiempoPromedio}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Generar Reporte Completo</Button>
                  </CardFooter>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Trámites Recientes</CardTitle>
                  <CardDescription>Últimos trámites ingresados al sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tramitesEjemplo.slice(0, 5).map((tramite) => (
                      <div key={tramite.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{tramite.tipo}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">{tramite.id}</p>
                              <p className="text-xs text-muted-foreground">•</p>
                              <p className="text-xs text-muted-foreground">{tramite.ciudadano}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(tramite.estado)}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/tramites/${tramite.id}`}>Ver</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/admin/tramites">Ver Todos los Trámites</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="tramites" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por ID, tipo, descripción o ciudadano..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Select defaultValue="todos" onValueChange={handleStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="en proceso">En proceso</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="completado">Completado</SelectItem>
                      <SelectItem value="rechazado">Rechazado</SelectItem>
                      <SelectItem value="documentación incompleta">Documentación incompleta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Tipo de Trámite
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Ciudadano
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Prioridad
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Fecha de Inicio
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Asignado a
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {filteredTramites.map((tramite) => (
                        <tr
                          key={tramite.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">{tramite.id}</td>
                          <td className="p-4 align-middle">{tramite.tipo}</td>
                          <td className="p-4 align-middle">{tramite.ciudadano}</td>
                          <td className="p-4 align-middle">{getStatusBadge(tramite.estado)}</td>
                          <td className="p-4 align-middle">{getPriorityBadge(tramite.prioridad)}</td>
                          <td className="p-4 align-middle">{new Date(tramite.fechaInicio).toLocaleDateString()}</td>
                          <td className="p-4 align-middle">
                            {tramite.asignado ? (
                              tramite.asignado
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                                Sin asignar
                              </Badge>
                            )}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/tramites/${tramite.id}`}>Ver</Link>
                              </Button>
                              <Button variant="outline" size="sm">
                                Asignar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
