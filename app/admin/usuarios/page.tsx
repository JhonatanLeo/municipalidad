"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Users, LogOut, BarChart3, UserCheck, UserX, Shield, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAllUsers, updateUserProfile } from "@/lib/auth"
import type { Usuario } from "@/lib/supabase"

export default function AdminUsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([])
  const [typeFilter, setTypeFilter] = useState("todos")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const usuariosData = await getAllUsers()
        setUsuarios(usuariosData)
        setFilteredUsuarios(usuariosData)
      } catch (error) {
        console.error("Error fetching usuarios:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsuarios()
  }, [])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value
    setSearchTerm(term)
    filterUsuarios(term, typeFilter, statusFilter)
  }

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type)
    filterUsuarios(searchTerm, type, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterUsuarios(searchTerm, typeFilter, status)
  }

  const filterUsuarios = (term: string, type: string, status: string) => {
    let filtered = usuarios

    if (term) {
      filtered = filtered.filter(
        (usuario) =>
          usuario.nombre.toLowerCase().includes(term.toLowerCase()) ||
          usuario.apellido.toLowerCase().includes(term.toLowerCase()) ||
          usuario.email.toLowerCase().includes(term.toLowerCase()) ||
          usuario.documento.toLowerCase().includes(term.toLowerCase()),
      )
    }

    if (type !== "todos") {
      filtered = filtered.filter((usuario) => usuario.tipo_usuario === type)
    }

    if (status !== "todos") {
      const isActive = status === "activo"
      filtered = filtered.filter((usuario) => usuario.activo === isActive)
    }

    setFilteredUsuarios(filtered)
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserProfile(userId, { activo: !currentStatus })

      // Actualizar el estado local
      const updatedUsuarios = usuarios.map((u) => (u.id === userId ? { ...u, activo: !currentStatus } : u))
      setUsuarios(updatedUsuarios)
      filterUsuarios(searchTerm, typeFilter, statusFilter)
    } catch (error) {
      console.error("Error updating user status:", error)
    }
  }

  const handleChangeUserType = async (userId: string, newType: string) => {
    try {
      await updateUserProfile(userId, { tipo_usuario: newType as "ciudadano" | "administrativo" | "supervisor" })

      // Actualizar el estado local
      const updatedUsuarios = usuarios.map((u) =>
        u.id === userId ? { ...u, tipo_usuario: newType as "ciudadano" | "administrativo" | "supervisor" } : u,
      )
      setUsuarios(updatedUsuarios)
      filterUsuarios(searchTerm, typeFilter, statusFilter)
    } catch (error) {
      console.error("Error updating user type:", error)
    }
  }

  const getUserTypeBadge = (type: string) => {
    const typeMap = {
      ciudadano: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Ciudadano", icon: User },
      administrativo: {
        color: "bg-green-50 text-green-700 border-green-200",
        label: "Administrativo",
        icon: UserCheck,
      },
      supervisor: { color: "bg-purple-50 text-purple-700 border-purple-200", label: "Supervisor", icon: Shield },
    }

    const typeInfo = typeMap[type as keyof typeof typeMap] || {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      label: type,
      icon: User,
    }
    const Icon = typeInfo.icon

    return (
      <Badge variant="outline" className={typeInfo.color}>
        <Icon className="h-3 w-3 mr-1" />
        {typeInfo.label}
      </Badge>
    )
  }

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactivo</Badge>
    )
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
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <FileText className="h-4 w-4" />
                Trámites
              </Link>
              <Link
                href="/admin/usuarios"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
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
              <h1 className="text-lg font-semibold md:text-xl">Gestión de Usuarios</h1>
            </div>
          </header>
          <main className="flex items-center justify-center p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Cargando usuarios...</p>
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
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <FileText className="h-4 w-4" />
              Trámites
            </Link>
            <Link
              href="/admin/usuarios"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
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
            <h1 className="text-lg font-semibold md:text-xl">Gestión de Usuarios</h1>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-4 p-6">
          {/* Estadísticas rápidas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usuarios.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ciudadanos</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {usuarios.filter((u) => u.tipo_usuario === "ciudadano").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrativos</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {usuarios.filter((u) => u.tipo_usuario === "administrativo").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activos</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usuarios.filter((u) => u.activo).length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre, email o documento..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="todos" onValueChange={handleTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="ciudadano">Ciudadanos</SelectItem>
                  <SelectItem value="administrativo">Administrativos</SelectItem>
                  <SelectItem value="supervisor">Supervisores</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="todos" onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activo">Activos</SelectItem>
                  <SelectItem value="inactivo">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla de usuarios */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>Gestiona todos los usuarios del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Usuario</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Documento
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tipo</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Registro</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {filteredUsuarios.map((usuario) => (
                        <tr key={usuario.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {usuario.nombre.charAt(0)}
                                  {usuario.apellido.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {usuario.nombre} {usuario.apellido}
                                </div>
                                {usuario.telefono && (
                                  <div className="text-xs text-muted-foreground">{usuario.telefono}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">{usuario.email}</td>
                          <td className="p-4 align-middle font-mono text-xs">{usuario.documento}</td>
                          <td className="p-4 align-middle">{getUserTypeBadge(usuario.tipo_usuario)}</td>
                          <td className="p-4 align-middle">{getStatusBadge(usuario.activo)}</td>
                          <td className="p-4 align-middle">{new Date(usuario.fecha_registro).toLocaleDateString()}</td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleUserStatus(usuario.id, usuario.activo)}
                              >
                                {usuario.activo ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </Button>
                              {usuario.tipo_usuario !== "supervisor" && (
                                <Select onValueChange={(value) => handleChangeUserType(usuario.id, value)}>
                                  <SelectTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Shield className="h-4 w-4" />
                                    </Button>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ciudadano">Ciudadano</SelectItem>
                                    <SelectItem value="administrativo">Administrativo</SelectItem>
                                    <SelectItem value="supervisor">Supervisor</SelectItem>
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
