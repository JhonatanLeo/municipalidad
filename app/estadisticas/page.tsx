"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, BarChart3, PieChart, LineChart } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Datos de ejemplo para las estadísticas
const estadisticas = {
  tramitesPorTipo: [
    { tipo: "Licencia de Construcción", cantidad: 145, porcentaje: 28 },
    { tipo: "Permiso Comercial", cantidad: 102, porcentaje: 20 },
    { tipo: "Certificado de Residencia", cantidad: 88, porcentaje: 17 },
    { tipo: "Reclamo por Servicios", cantidad: 75, porcentaje: 15 },
    { tipo: "Permiso de Evento", cantidad: 58, porcentaje: 11 },
    { tipo: "Otros", cantidad: 45, porcentaje: 9 },
  ],
  tiempoPromedioPorTipo: [
    { tipo: "Licencia de Construcción", dias: 8.5 },
    { tipo: "Permiso Comercial", dias: 5.2 },
    { tipo: "Certificado de Residencia", dias: 2.1 },
    { tipo: "Reclamo por Servicios", dias: 4.7 },
    { tipo: "Permiso de Evento", dias: 3.8 },
    { tipo: "Otros", dias: 6.3 },
  ],
  tendenciaMensual: [
    { mes: "Enero", tramites: 78, completados: 65 },
    { mes: "Febrero", tramites: 82, completados: 70 },
    { mes: "Marzo", tramites: 90, completados: 75 },
    { mes: "Abril", tramites: 95, completados: 82 },
    { mes: "Mayo", tramites: 105, completados: 88 },
  ],
  erroresComunes: [
    { tipo: "Documentación incompleta", ocurrencias: 45, porcentaje: 38 },
    { tipo: "Información incorrecta", ocurrencias: 32, porcentaje: 27 },
    { tipo: "Formulario mal completado", ocurrencias: 25, porcentaje: 21 },
    { tipo: "Requisitos no cumplidos", ocurrencias: 18, porcentaje: 14 },
  ],
  cuellosDeBottella: [
    { fase: "Revisión de documentación", tiempoPromedio: "2.1 días", porcentaje: 40 },
    { fase: "Aprobación departamental", tiempoPromedio: "1.8 días", porcentaje: 34 },
    { fase: "Verificación final", tiempoPromedio: "1.4 días", porcentaje: 26 },
  ],
  satisfaccionUsuarios: {
    promedio: 4.2,
    totalEncuestas: 320,
    distribucion: [
      { estrellas: 5, porcentaje: 45 },
      { estrellas: 4, porcentaje: 35 },
      { estrellas: 3, porcentaje: 12 },
      { estrellas: 2, porcentaje: 5 },
      { estrellas: 1, porcentaje: 3 },
    ],
  },
}

export default function EstadisticasPage() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("ultimo-mes")

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver al Inicio
            </Button>
          </Link>
          <h1 className="text-3xl font-bold ml-4">Estadísticas y Análisis</h1>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ultimo-mes">Último mes</SelectItem>
              <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
              <SelectItem value="ultimo-anio">Último año</SelectItem>
              <SelectItem value="personalizado">Período personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="tiempos">Tiempos de Procesamiento</TabsTrigger>
          <TabsTrigger value="errores">Errores y Cuellos de Botella</TabsTrigger>
          <TabsTrigger value="satisfaccion">Satisfacción</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Distribución por Tipo de Trámite</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estadisticas.tramitesPorTipo.map((item) => (
                    <div key={item.tipo} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Tendencia Mensual</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between gap-2">
                  {estadisticas.tendenciaMensual.map((item) => (
                    <div key={item.mes} className="flex flex-col items-center gap-2">
                      <div className="flex gap-1">
                        <div
                          className="w-8 bg-primary rounded-t"
                          style={{ height: `${(item.tramites / 120) * 200}px` }}
                        ></div>
                        <div
                          className="w-8 bg-primary/30 rounded-t"
                          style={{ height: `${(item.completados / 120) * 200}px` }}
                        ></div>
                      </div>
                      <span className="text-xs">{item.mes}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                    <span className="text-xs">Trámites Iniciados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary/30"></div>
                    <span className="text-xs">Trámites Completados</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumen General</CardTitle>
              <CardDescription>Métricas clave del período seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total de Trámites</p>
                  <p className="text-3xl font-bold">513</p>
                  <p className="text-xs text-muted-foreground">+8% respecto al período anterior</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Trámites Completados</p>
                  <p className="text-3xl font-bold">380</p>
                  <p className="text-xs text-muted-foreground">+12% respecto al período anterior</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Tiempo Promedio</p>
                  <p className="text-3xl font-bold">5.3 días</p>
                  <p className="text-xs text-muted-foreground">-0.8 días respecto al período anterior</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Tasa de Aprobación</p>
                  <p className="text-3xl font-bold">78%</p>
                  <p className="text-xs text-muted-foreground">+3% respecto al período anterior</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver Reporte Detallado
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tiempos" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Tiempo Promedio por Tipo de Trámite</CardTitle>
                <CardDescription>Días promedio para completar cada tipo de trámite</CardDescription>
              </div>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {estadisticas.tiempoPromedioPorTipo.map((item) => (
                  <div key={item.tipo} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.tipo}</span>
                      <span className="font-medium">{item.dias} días</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${(item.dias / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Evolución de Tiempos de Procesamiento</CardTitle>
                <CardDescription>Tendencia en los últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <LineChart className="mx-auto h-16 w-16" />
                  <p className="mt-2">Gráfico de evolución temporal</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Tiempos</CardTitle>
                <CardDescription>Cantidad de trámites por rango de tiempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Menos de 3 días</span>
                      <span className="text-sm font-medium">142 trámites (28%)</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">3-7 días</span>
                      <span className="text-sm font-medium">205 trámites (40%)</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">7-14 días</span>
                      <span className="text-sm font-medium">128 trámites (25%)</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Más de 14 días</span>
                      <span className="text-sm font-medium">38 trámites (7%)</span>
                    </div>
                    <Progress value={7} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errores" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Errores Más Comunes</CardTitle>
                <CardDescription>Principales causas de rechazo o retraso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estadisticas.erroresComunes.map((error) => (
                    <div key={error.tipo} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{error.tipo}</span>
                        <span className="text-sm text-muted-foreground">
                          {error.ocurrencias} casos ({error.porcentaje}%)
                        </span>
                      </div>
                      <Progress value={error.porcentaje} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver Detalles de Errores
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cuellos de Botella Identificados</CardTitle>
                <CardDescription>Fases que generan mayor demora</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estadisticas.cuellosDeBottella.map((cuello, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{cuello.fase}</span>
                        <span className="text-sm text-muted-foreground">{cuello.tiempoPromedio}</span>
                      </div>
                      <Progress value={cuello.porcentaje} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Representa el {cuello.porcentaje}% del tiempo total de procesamiento
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Generar Plan de Mejora
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones de Optimización</CardTitle>
              <CardDescription>Sugerencias basadas en análisis de Machine Learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-medium">Automatizar validación de documentos</h3>
                  <p className="text-sm text-muted-foreground">
                    Implementar validación automática de documentos comunes podría reducir el tiempo de revisión en un
                    35%.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-medium">Mejorar formularios de solicitud</h3>
                  <p className="text-sm text-muted-foreground">
                    Rediseñar formularios con validación en tiempo real podría reducir errores de información incorrecta
                    en un 40%.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-medium">Redistribuir carga de trabajo</h3>
                  <p className="text-sm text-muted-foreground">
                    Balancear la asignación de trámites entre departamentos podría reducir cuellos de botella en un 25%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaccion" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Satisfacción General</CardTitle>
                <CardDescription>
                  Promedio basado en {estadisticas.satisfaccionUsuarios.totalEncuestas} encuestas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold">{estadisticas.satisfaccionUsuarios.promedio}</div>
                  <div className="flex justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`h-6 w-6 ${
                          star <= Math.floor(estadisticas.satisfaccionUsuarios.promedio)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">de 5 estrellas</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Calificaciones</CardTitle>
                <CardDescription>Desglose por número de estrellas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estadisticas.satisfaccionUsuarios.distribucion.map((item) => (
                    <div key={item.estrellas} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.estrellas} estrellas</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`h-3 w-3 ${star <= item.estrellas ? "text-yellow-400" : "text-gray-300"}`}
                              >
                                ★
                              </div>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.porcentaje}%</span>
                      </div>
                      <Progress value={item.porcentaje} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Comentarios Recientes</CardTitle>
              <CardDescription>Feedback de usuarios sobre el servicio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">María López</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="h-3 w-3 text-yellow-400">
                          ★
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Excelente servicio, muy rápido y eficiente. El proceso fue muy claro y fácil de seguir."
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Carlos Rodríguez</span>
                    <div className="flex">
                      {[1, 2, 3, 4].map((star) => (
                        <div key={star} className="h-3 w-3 text-yellow-400">
                          ★
                        </div>
                      ))}
                      <div className="h-3 w-3 text-gray-300">★</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Buen servicio en general, aunque el tiempo de respuesta podría mejorar un poco."
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Ana Martínez</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="h-3 w-3 text-yellow-400">
                          ★
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Me encanta poder hacer todo online. Las notificaciones por correo son muy útiles."
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver Todos los Comentarios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
