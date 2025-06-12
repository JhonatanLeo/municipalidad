"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, FileText, Clock, AlertCircle, CheckCircle, XCircle, Filter, Wifi, WifiOff } from "lucide-react"
import { getTramitesUsuario } from "@/lib/tramites"
import { isSupabaseAvailable, testSupabaseConnection } from "@/lib/supabase"

// Datos de ejemplo actualizados a 2025
const tramitesEjemplo = [
  {
    id: "1",
    numero_tramite: "TRM-2025-001",
    tipo_tramite: {
      nombre: "Licencia de Construcción",
      codigo: "LIC_CONSTRUCCION",
    },
    descripcion: "Solicitud de licencia para construcción residencial en Av. Principal 123",
    estado: "En proceso",
    prioridad: "Alta",
    fecha_inicio: "2025-01-15",
    fecha_limite: "2025-02-15",
    costo_total: 150.0,
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-20T14:30:00Z",
  },
  {
    id: "2",
    numero_tramite: "TRM-2025-002",
    tipo_tramite: {
      nombre: "Certificado de Residencia",
      codigo: "CERT_RESIDENCIA",
    },
    descripcion: "Solicitud de certificado de residencia para trámites bancarios",
    estado: "Completado",
    prioridad: "Media",
    fecha_inicio: "2025-01-10",
    fecha_limite: "2025-01-13",
    costo_total: 25.0,
    created_at: "2025-01-10T09:00:00Z",
    updated_at: "2025-01-12T16:45:00Z",
  },
  {
    id: "3",
    numero_tramite: "TRM-2025-003",
    tipo_tramite: {
      nombre: "Permiso Comercial",
      codigo: "PERM_COMERCIAL",
    },
    descripcion: "Permiso para apertura de local comercial - Restaurante",
    estado: "Pendiente",
    prioridad: "Media",
    fecha_inicio: "2025-01-18",
    fecha_limite: "2025-01-25",
    costo_total: 75.0,
    created_at: "2025-01-18T11:30:00Z",
    updated_at: "2025-01-18T11:30:00Z",
  },
  {
    id: "4",
    numero_tramite: "TRM-2025-004",
    tipo_tramite: {
      nombre: "Reclamo por Servicios",
      codigo: "RECLAMO_SERVICIOS",
    },
    descripcion: "Reclamo por falta de recolección de basura en Calle 5 #123",
    estado: "En revisión",
    prioridad: "Alta",
    fecha_inicio: "2025-01-20",
    fecha_limite: "2025-01-25",
    costo_total: 0.0,
    created_at: "2025-01-20T08:15:00Z",
    updated_at: "2025-01-21T10:20:00Z",
  },
]

export default function TramitesPage() {
  const [tramites, setTramites] = useState(tramitesEjemplo)
  const [filteredTramites, setFilteredTramites] = useState(tramitesEjemplo)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [priorityFilter, setPriorityFilter] = useState("todos")
  const [connectionStatus, setConnectionStatus] = useState<{
    isConnected: boolean
    error?: string
    isConfigured: boolean
  }>({
    isConnected: false,
    isConfigured: false,
  })

  useEffect(() => {
    checkConnectionAndFetchTramites()
  }, [])

  useEffect(() => {
    filterTramites()
  }, [searchTerm, statusFilter, priorityFilter, tramites])

  const checkConnectionAndFetchTramites = async () => {
    setLoading(true)

    // Check if Supabase is configured
    const isConfigured = isSupabaseAvailable()

    if (!isConfigured) {
      setConnectionStatus({
        isConnected: false,
        isConfigured: false,
        error: "Variables de entorno de Supabase no configuradas",
      })
      setTramites(tramitesEjemplo)
      setFilteredTramites(tramitesEjemplo)
      setLoading(false)
      return
    }

    // Test the connection
    try {
      const connectionTest = await testSupabaseConnection()

      if (!connectionTest.success) {
        setConnectionStatus({
          isConnected: false,
          isConfigured: true,
          error: connectionTest.error,
        })
        setTramites(tramitesEjemplo)
        setFilteredTramites(tramitesEjemplo)
        setLoading(false)
        return
      }

      // Connection successful, try to fetch real data
      setConnectionStatus({
        isConnected: true,
        isConfigured: true,
      })

      // En una implementación real, obtendríamos el ID del usuario autenticado
      const usuarioId = "user-example-id"
      const data = await getTramitesUsuario(usuarioId)

      if (data && data.length > 0) {
        setTramites(data)
        setFilteredTramites(data)
      } else {
        // No data found, use example data
        setTramites(tramitesEjemplo)
        setFilteredTramites(tramitesEjemplo)
      }
    } catch (error) {
      console.error("Error connecting to database:", error)
      setConnectionStatus({
        isConnected: false,
        isConfigured: true,
        error: "Error de conexión con la base de datos",
      })
      setTramites(tramitesEjemplo)
      setFilteredTramites(tramitesEjemplo)
    } finally {
      setLoading(false)
    }
  }

  const filterTramites = () => {
    let filtered = tramites

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (tramite) =>
          tramite.numero_tramite.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tramite.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tramite.tipo_tramite?.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por estado
    if (statusFilter !== "todos") {
      filtered = filtered.filter((tramite) => tramite.estado.toLowerCase() === statusFilter.toLowerCase())
    }

    // Filtro por prioridad
    if (priorityFilter !== "todos") {
      filtered = filtered.filter((tramite) => tramite.prioridad.toLowerCase() === priorityFilter.toLowerCase())
    }

    setFilteredTramites(filtered)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "en proceso": { variant: "default", icon: Clock, className: "bg-blue-50 text-blue-700 border-blue-200" },
      pendiente: {
        variant: "secondary",
        icon: AlertCircle,
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      },
      completado: { variant: "default", icon: CheckCircle, className: "bg-green-50 text-green-700 border-green-200" },
      "en revisión": {
        variant: "outline",
        icon: FileText,
        className: "bg-purple-50 text-purple-700 border-purple-200",
      },
      rechazado: { variant: "destructive", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200" },
    }

    const config = statusConfig[status.toLowerCase()] || { variant: "outline", icon: FileText, className: "" }
    const Icon = config.icon

    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      alta: "bg-red-100 text-red-800 hover:bg-red-100",
      media: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      baja: "bg-green-100 text-green-800 hover:bg-green-100",
    }

    return <Badge className={priorityConfig[priority.toLowerCase()] || "bg-gray-100 text-gray-800"}>{priority}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getConnectionStatusCard = () => {
    if (connectionStatus.isConnected) {
      return (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <Wifi className="w-5 h-5" />
              <span className="font-medium">Conectado a la Base de Datos</span>
            </div>
            <p className="text-green-700 mt-1">Sistema funcionando con datos en tiempo real desde Supabase.</p>
          </CardContent>
        </Card>
      )
    }

    if (!connectionStatus.isConfigured) {
      return (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-blue-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Modo de Vista Previa</span>
            </div>
            <p className="text-blue-700 mt-1">
              Variables de entorno de Supabase no configuradas. Mostrando datos de ejemplo.
            </p>
            <details className="mt-2">
              <summary className="text-blue-800 cursor-pointer font-medium">Ver instrucciones</summary>
              <div className="mt-2 text-sm text-blue-700">
                <p>Para conectar con la base de datos real:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Configura NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>Configura NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li>Ejecuta los scripts SQL en Supabase</li>
                </ol>
              </div>
            </details>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-800">
            <WifiOff className="w-5 h-5" />
            <span className="font-medium">Error de Conexión</span>
          </div>
          <p className="text-red-700 mt-1">No se pudo conectar a la base de datos. Mostrando datos de ejemplo.</p>
          {connectionStatus.error && (
            <details className="mt-2">
              <summary className="text-red-800 cursor-pointer font-medium">Ver detalles del error</summary>
              <p className="mt-1 text-sm text-red-700 font-mono bg-red-100 p-2 rounded">{connectionStatus.error}</p>
            </details>
          )}
          <Button
            variant="outline"
            size="sm"
            className="mt-3 text-red-700 border-red-300 hover:bg-red-100"
            onClick={checkConnectionAndFetchTramites}
          >
            Reintentar Conexión
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verificando conexión y cargando trámites...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Trámites</h1>
          <p className="text-muted-foreground">Gestiona y consulta el estado de tus trámites municipales</p>
        </div>
        <Link href="/tramites/nuevo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Trámite
          </Button>
        </Link>
      </div>

      {/* Connection Status */}
      {getConnectionStatusCard()}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Número de trámite, descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en proceso">En proceso</SelectItem>
                  <SelectItem value="en revisión">En revisión</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prioridad</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las prioridades</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{tramites.length}</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En Proceso</p>
                <p className="text-2xl font-bold text-blue-600">
                  {tramites.filter((t) => t.estado.toLowerCase() === "en proceso").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold text-green-600">
                  {tramites.filter((t) => t.estado.toLowerCase() === "completado").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tramites.filter((t) => t.estado.toLowerCase() === "pendiente").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tramites List */}
      <div className="space-y-4">
        {filteredTramites.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No se encontraron trámites</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "todos" || priorityFilter !== "todos"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Aún no tienes trámites registrados"}
                </p>
                <Link href="/tramites/nuevo">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Trámite
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTramites.map((tramite) => (
            <Card key={tramite.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      <Link href={`/tramites/${tramite.id}`} className="hover:text-primary transition-colors">
                        {tramite.numero_tramite}
                      </Link>
                    </CardTitle>
                    <CardDescription className="font-medium">{tramite.tipo_tramite?.nombre}</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    {getStatusBadge(tramite.estado)}
                    {getPriorityBadge(tramite.prioridad)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tramite.descripcion}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Fecha de inicio:</span>
                    <br />
                    <span className="text-muted-foreground">{formatDate(tramite.fecha_inicio)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Fecha límite:</span>
                    <br />
                    <span className="text-muted-foreground">{formatDate(tramite.fecha_limite)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Costo:</span>
                    <br />
                    <span className="text-muted-foreground">{formatCurrency(tramite.costo_total)}</span>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Link href={`/tramites/${tramite.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
