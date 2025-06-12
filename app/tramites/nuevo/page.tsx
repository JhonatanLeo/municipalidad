"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, FileText, AlertCircle } from "lucide-react"
import { crearTramite } from "@/lib/tramites"
import { supabase } from "@/lib/supabase"

// Tipos de trámites disponibles
const tiposTramites = [
  {
    id: "licencia-construccion",
    nombre: "Licencia de Construcción",
    descripcion: "Solicitud de licencia para construcción, ampliación o remodelación",
    documentos: ["Planos arquitectónicos", "Título de propiedad", "Identificación del solicitante"],
  },
  {
    id: "permiso-comercial",
    nombre: "Permiso Comercial",
    descripcion: "Solicitud de permiso para establecimiento comercial",
    documentos: ["Registro fiscal", "Identificación del propietario", "Contrato de arrendamiento"],
  },
  {
    id: "certificado-residencia",
    nombre: "Certificado de Residencia",
    descripcion: "Solicitud de certificado que acredita residencia en el municipio",
    documentos: ["Identificación", "Comprobante de domicilio"],
  },
  {
    id: "reclamo-servicios",
    nombre: "Reclamo por Servicios",
    descripcion: "Presentación de reclamo por servicios municipales",
    documentos: ["Identificación", "Comprobante de pago (si aplica)", "Evidencia del problema"],
  },
]

export default function NuevoTramitePage() {
  const router = useRouter()
  const [selectedTipoTramite, setSelectedTipoTramite] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    tipoTramite: "",
    descripcion: "",
    direccion: "",
    telefono: "",
    email: "",
    urgencia: "normal",
  })
  const [files, setFiles] = useState<{ [key: string]: File | null }>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleTipoTramiteChange = (value: string) => {
    setSelectedTipoTramite(value)
    setFormData({
      ...formData,
      tipoTramite: value,
    })

    // Inicializar los archivos requeridos para este tipo de trámite
    const tramiteSeleccionado = tiposTramites.find((t) => t.id === value)
    if (tramiteSeleccionado) {
      const newFiles: { [key: string]: File | null } = {}
      tramiteSeleccionado.documentos.forEach((doc) => {
        newFiles[doc] = null
      })
      setFiles(newFiles)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpiar error si el campo se está completando
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleFileChange = (documentName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({
        ...files,
        [documentName]: e.target.files[0],
      })

      // Limpiar error si el archivo se está subiendo
      if (errors[`file-${documentName}`]) {
        setErrors({
          ...errors,
          [`file-${documentName}`]: "",
        })
      }
    }
  }

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {}

    if (step === 1) {
      if (!formData.tipoTramite) {
        newErrors.tipoTramite = "Debe seleccionar un tipo de trámite"
      }
      if (!formData.descripcion) {
        newErrors.descripcion = "La descripción es requerida"
      }
    } else if (step === 2) {
      if (!formData.direccion) {
        newErrors.direccion = "La dirección es requerida"
      }
      if (!formData.telefono) {
        newErrors.telefono = "El teléfono es requerido"
      }
      if (!formData.email) {
        newErrors.email = "El correo electrónico es requerido"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "El correo electrónico no es válido"
      }
    } else if (step === 3) {
      // Validar que todos los documentos requeridos estén subidos
      const tramiteSeleccionado = tiposTramites.find((t) => t.id === formData.tipoTramite)
      if (tramiteSeleccionado) {
        tramiteSeleccionado.documentos.forEach((doc) => {
          if (!files[doc]) {
            newErrors[`file-${doc}`] = `El documento ${doc} es requerido`
          }
        })
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      return
    }

    setLoading(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("Usuario no autenticado")
      }

      // Create the tramite using the real function
      const tramiteId = await crearTramite(formData, files, user.id)

      // Redirect to confirmation page
      router.push(`/tramites/confirmacion?id=${tramiteId}`)
    } catch (error) {
      console.error("Error al crear el trámite:", error)
      setErrors({
        submit: "Ocurrió un error al crear el trámite. Por favor, intente nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  const tramiteSeleccionado = tiposTramites.find((t) => t.id === selectedTipoTramite)

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link href="/tramites">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Volver a Trámites
          </Button>
        </Link>
        <h1 className="text-3xl font-bold ml-4">Nuevo Trámite</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Iniciar un nuevo trámite</CardTitle>
          <CardDescription>
            Complete el formulario para iniciar su trámite. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <div className="flex space-x-2">
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  1
                </div>
                <div className={`h-0.5 w-10 self-center ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`} />
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  2
                </div>
                <div className={`h-0.5 w-10 self-center ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`} />
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  3
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Paso {currentStep} de 3</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoTramite">Tipo de Trámite *</Label>
                  <Select value={formData.tipoTramite} onValueChange={handleTipoTramiteChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un tipo de trámite" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposTramites.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tipoTramite && <p className="text-sm text-destructive">{errors.tipoTramite}</p>}
                </div>

                {tramiteSeleccionado && (
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium">{tramiteSeleccionado.nombre}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{tramiteSeleccionado.descripcion}</p>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Documentos requeridos:</h4>
                      <ul className="text-sm mt-1 space-y-1">
                        {tramiteSeleccionado.documentos.map((doc) => (
                          <li key={doc} className="flex items-center">
                            <FileText className="h-3 w-3 mr-2 text-muted-foreground" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción del Trámite *</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    placeholder="Describa brevemente el motivo de su trámite"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                  />
                  {errors.descripcion && <p className="text-sm text-destructive">{errors.descripcion}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgencia">Nivel de Urgencia</Label>
                  <RadioGroup
                    defaultValue="normal"
                    value={formData.urgencia}
                    onValueChange={(value) => setFormData({ ...formData, urgencia: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="baja" id="urgencia-baja" />
                      <Label htmlFor="urgencia-baja">Baja</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="urgencia-normal" />
                      <Label htmlFor="urgencia-normal">Normal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="alta" id="urgencia-alta" />
                      <Label htmlFor="urgencia-alta">Alta</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input
                    id="direccion"
                    name="direccion"
                    placeholder="Ingrese su dirección completa"
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                  {errors.direccion && <p className="text-sm text-destructive">{errors.direccion}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono de Contacto *</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    placeholder="Ingrese su número telefónico"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                  {errors.telefono && <p className="text-sm text-destructive">{errors.telefono}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="bg-muted p-4 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Información de contacto</p>
                    <p className="text-muted-foreground">
                      Estos datos serán utilizados para notificarle sobre el estado de su trámite. Asegúrese de
                      proporcionar información de contacto válida.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-medium">Documentos Requeridos</h3>
                <p className="text-sm text-muted-foreground">
                  Suba los documentos necesarios para procesar su trámite. Formatos aceptados: PDF, JPG, PNG.
                </p>

                {tramiteSeleccionado &&
                  tramiteSeleccionado.documentos.map((doc) => (
                    <div key={doc} className="space-y-2">
                      <Label htmlFor={`file-${doc}`}>{doc} *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`file-${doc}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(doc, e)}
                          className="flex-1"
                        />
                        {files[doc] && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFiles({ ...files, [doc]: null })}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                      {errors[`file-${doc}`] && <p className="text-sm text-destructive">{errors[`file-${doc}`]}</p>}
                      {files[doc] && (
                        <p className="text-xs text-muted-foreground">
                          Archivo seleccionado: {files[doc]?.name} ({Math.round(files[doc]?.size / 1024)} KB)
                        </p>
                      )}
                    </div>
                  ))}

                <div className="bg-muted p-4 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Información importante</p>
                    <p className="text-muted-foreground">
                      Todos los documentos deben ser legibles y estar completos. Los archivos no deben exceder los 5MB
                      cada uno.
                    </p>
                  </div>
                </div>

                {errors.submit && (
                  <div className="bg-destructive/10 p-4 rounded-md text-destructive">{errors.submit}</div>
                )}
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handlePrevStep}>
              Anterior
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <Button onClick={handleNextStep}>Siguiente</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Enviando..." : "Enviar Trámite"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
