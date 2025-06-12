import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, FileText, BarChart3, Bell, Database, Brain } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">Sistema Municipal de Trámites</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/tramites" className="transition-colors hover:text-foreground/80">
                Trámites
              </Link>
              <Link href="/consulta" className="transition-colors hover:text-foreground/80">
                Consultar Estado
              </Link>
              <Link href="/admin" className="transition-colors hover:text-foreground/80">
                Administración
              </Link>
              <Link href="/estadisticas" className="transition-colors hover:text-foreground/80">
                Estadísticas
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/registro">
                <Button>Registrarse</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Gestión Inteligente de Trámites Municipales
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Optimice los procesos administrativos con nuestra plataforma digital impulsada por inteligencia
                    artificial.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/tramites/nuevo">
                    <Button size="lg" className="gap-1">
                      Iniciar Trámite
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/consulta">
                    <Button size="lg" variant="outline">
                      Consultar Estado
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="Vista aérea de la Municipalidad"
                  className="rounded-lg object-cover"
                  src="https://sjc.microlink.io/HfAHoCTpfrOqhNixV91LnwNMYT8DlKhdYaGKlj-ORKmd7CdnEQkX9V-_8CnUhYAfSjBBUaZd4HMzMv3EHH0Snw.jpeg"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Características Principales
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nuestra plataforma ofrece soluciones completas para la gestión eficiente de trámites municipales.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <FileText className="h-10 w-10 mb-2" />
                  <CardTitle>Digitalización de Trámites</CardTitle>
                  <CardDescription>
                    Inicie trámites en línea, cargue documentos y complete formularios electrónicamente.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Acceso 24/7 a todos los servicios municipales desde cualquier dispositivo.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/tramites">
                    <Button variant="outline" size="sm">
                      Explorar Trámites
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <Brain className="h-10 w-10 mb-2" />
                  <CardTitle>Inteligencia Artificial</CardTitle>
                  <CardDescription>Optimización de procesos mediante algoritmos de Machine Learning.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Priorización inteligente, detección de errores y análisis de cuellos de botella.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/ia-beneficios">
                    <Button variant="outline" size="sm">
                      Ver Beneficios
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <Bell className="h-10 w-10 mb-2" />
                  <CardTitle>Notificaciones en Tiempo Real</CardTitle>
                  <CardDescription>
                    Reciba alertas sobre el estado de sus trámites vía SMS, correo o en la plataforma.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Seguimiento transparente y comunicación efectiva durante todo el proceso.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/notificaciones">
                    <Button variant="outline" size="sm">
                      Configurar Alertas
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <Database className="h-10 w-10 mb-2" />
                  <CardTitle>Base de Datos Centralizada</CardTitle>
                  <CardDescription>
                    Almacenamiento seguro y estructurado de toda la información de trámites.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Protección de datos personales y confidencialidad garantizada.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/seguridad">
                    <Button variant="outline" size="sm">
                      Políticas de Seguridad
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="h-10 w-10 mb-2" />
                  <CardTitle>Análisis y Reportes</CardTitle>
                  <CardDescription>
                    Visualización de métricas clave y generación de reportes personalizables.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Toma de decisiones basada en datos para la mejora continua del servicio.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/estadisticas">
                    <Button variant="outline" size="sm">
                      Ver Estadísticas
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <FileText className="h-10 w-10 mb-2" />
                  <CardTitle>Panel Administrativo</CardTitle>
                  <CardDescription>
                    Interfaz intuitiva para el personal municipal que permite gestionar trámites eficientemente.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Actualización de estados, asignación de tareas y seguimiento de procesos.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Acceder al Panel
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 Sistema Municipal de Gestión de Trámites. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
