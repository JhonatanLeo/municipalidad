"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Clock, Filter, BarChart3, Users, LogOut, Eye, UserCheck, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAllTramites, actualizarEstadoTramite } from "@/lib/tramites"
import { getAllUsers } from "@/lib/auth"
import type { Tramite, Usuario } from "@/lib/supabase"

export default function AdminTramitesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tramites, setTramites] = useState<Tramite[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filteredTramites, setFilteredTramites] = useState<Tramite[]>([])
  const [statusFilter, setStatusFilter] = useState("todos")
  const [priorityFilter, setPriorityFilter] = useState("todos")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [tramitesData, usuariosData] = await Promise.all([getAllTramites(), getAllUsers()])
        setTramites(tramitesData)
        setUsuarios(usuariosData.filter((u) => u.tipo_usuario !== "ciudadano"))
        setFilteredTramites(tramitesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value
    setSearchTerm(term)
    filterTramites(term, statusFilter, priorityFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterTramites(searchTerm, status, priorityFilter)
  }

  const handlePriorityFilter = (priority: string) => {
    setPriorityFilter(priority)
    filterTramites(searchTerm, statusFilter, priority)
  }

  const filterTramites = (term: string, status: string, priority: string) => {
    let filtered = tramites

    if (term) {
      filtered = filtered.filter(
        (tramite) =>
          tramite.numero_tramite.toLowerCase().includes(term.toLowerCase()) ||
          tramite.tipo_tramite?.nombre.toLowerCase().includes(term.toLowerCase()) ||
          tramite.descripcion.toLowerCase().includes(term.toLowerCase()) ||
          tramite.usuario?.nombre.toLowerCase().includes(term.toLowerCase()) ||
          tramite.usuario?.apellido.toLowerCase().includes(term.toLowerCase()),
      )
    }

    if (status !== "todos") {
      filtered = filtered.filter((tramite) => tramite.estado === status)
    }

    if (priority !== "todos") {
      filtered = filtered.filter((tramite) => tramite.prioridad === priority)
    }

    setFilteredTramites(filtered)
  }

  const handleAsignarTramite = async (tramiteId: string, usuarioId: string) => {
    try {
      await actualizarEstadoTramite(tramiteId, "en_proceso", "Trámite asignado", usuarioId)

      // Actualizar el estado local
      const updatedTramites = tramites.map((t) =>
        t.id === tramiteId ? { ...t, estado: "en_proceso" as const, asignado_a: usuarioId } : t,
      )
      setTramites(updatedTramites)
      filterTramites(searchTerm, statusFilter, priorityFilter)
    } catch (error) {
      console.error("Error asignando trámite:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      recibido: { color: "bg-gray-50 text-gray-700 border-gray-200", label: "Recibido" },
      en_revision: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "En Revisión" },
      documentacion_incompleta: { color: "bg-orange-50 text-orange-700 border-orange-200", label: "Doc. Incompleta" },
      en_proceso: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "En Proceso" },
      aprobado: { color: "bg-green-50 text-green-700 border-green-200", label: "Aprobado" },
      rechazado: { color: "bg-red-50 text-red-700 border-red-200", label: "Rechazado" },
      completado: { color: "bg-green-50 text-green-700 border-green-200", label: "Completado" },
    }

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      label: status,
    }

    return (
      <Badge variant="outline" className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      baja: { color: "bg-green-100 text-green-800", label: "Baja" },
      media: { color: "bg-yellow-100 text-yellow-800", label: "Media" },
      alta: { color: "bg-red-100 text-red-800", label: "Alta" },
      urgente: { color: "bg-red-200 text-red-900", label: "Urgente" },
    }

    const priorityInfo = priorityMap[priority as keyof typeof priorityMap] || {
      color: "bg-gray-100 text-gray-800",
      label: priority,
    }

    return <Badge className={`${priorityInfo.color} hover:${priorityInfo.color}`}>{priorityInfo.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
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
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/tramites"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
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

        <div className="flex-1 md:pl-64">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <div className="flex-1">
              <h1 className="text-lg font-semibold md:text-xl">Gestión de Trámites</h1>
            </div>
          </header>
          <main className="flex items-center justify-center p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Cargando trámites...</p>
            </div>
          </main>
        </div>
      </div>
    )
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
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/tramites"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
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
            <h1 className="text-lg font-semibold md:text-xl">Gestión de Trámites</h1>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-4 p-6">
          {/* Estadísticas rápidas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trámites</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tramites.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tramites.filter((t) => ["recibido", "en_revision", "en_proceso"].includes(t.estado)).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sin Asignar</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    tramites.filter((t) => !t.asignado_a && t.estado !== "completado" && t.estado !== "rechazado")
                      .length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completados</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tramites.filter((t) => t.estado === "completado").length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
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
                  <SelectItem value="recibido">Recibido</SelectItem>
                  <SelectItem value="en_revision">En Revisión</SelectItem>
                  <SelectItem value="documentacion_incompleta">Doc. Incompleta</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="todos" onValueChange={handlePriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla de trámites */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Trámites</CardTitle>
              <CardDescription>Gestiona todos los trámites del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tipo</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Ciudadano
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Prioridad
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Asignado</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {filteredTramites.map((tramite) => (
                        <tr key={tramite.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle font-mono text-xs">{tramite.numero_tramite}</td>
                          <td className="p-4 align-middle">{tramite.tipo_tramite?.nombre}</td>
                          <td className="p-4 align-middle">
                            {tramite.usuario?.nombre} {tramite.usuario?.apellido}
                          </td>
                          <td className="p-4 align-middle">{getStatusBadge(tramite.estado)}</td>
                          <td className="p-4 align-middle">{getPriorityBadge(tramite.prioridad)}</td>
                          <td className="p-4 align-middle">{new Date(tramite.fecha_inicio).toLocaleDateString()}</td>
                          <td className="p-4 align-middle">
                            {tramite.asignado_a ? (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {usuarios.find((u) => u.id === tramite.asignado_a)?.nombre?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">
                                  {usuarios.find((u) => u.id === tramite.asignado_a)?.nombre}
                                </span>
                              </div>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                                Sin asignar
                              </Badge>
                            )}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/tramites/${tramite.numero_tramite}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              {!tramite.asignado_a && (
                                <Select onValueChange={(value) => handleAsignarTramite(tramite.id, value)}>
                                  <SelectTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <UserCheck className="h-4 w-4" />
                                    </Button>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {usuarios.map((usuario) => (
                                      <SelectItem key={usuario.id} value={usuario.id}>
                                        {usuario.nombre} {usuario.apellido}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
