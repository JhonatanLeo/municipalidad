# Sistema Municipal de Gestión de Trámites

![Vista aérea de la Municipalidad](https://sjc.microlink.io/HfAHoCTpfrOqhNixV91LnwNMYT8DlKhdYaGKlj-ORKmd7CdnEQkX9V-_8CnUhYAfSjBBUaZd4HMzMv3EHH0Snw.jpeg)

## Descripción del Problema

Las municipalidades enfrentan desafíos significativos en la gestión de trámites administrativos:

- **Procesos manuales y burocráticos**: Los ciudadanos deben acudir presencialmente a las oficinas municipales, enfrentando largas filas y tiempos de espera.
- **Falta de transparencia**: Los ciudadanos no tienen visibilidad sobre el estado de sus trámites.
- **Ineficiencia administrativa**: El personal municipal dedica gran parte de su tiempo a tareas repetitivas y manuales.
- **Documentación física**: El manejo de documentos en papel genera problemas de almacenamiento, pérdida de información y dificultad para el seguimiento.
- **Comunicación deficiente**: La notificación sobre el avance de los trámites es inconsistente.

## Solución Propuesta

El Sistema Municipal de Gestión de Trámites es una plataforma digital integral que optimiza y moderniza la gestión de trámites municipales mediante:

- **Digitalización completa**: Permite iniciar y dar seguimiento a trámites 100% en línea.
- **Inteligencia artificial**: Implementa algoritmos de ML para priorización, detección de errores y optimización de procesos.
- **Base de datos centralizada**: Almacena toda la información de manera segura y estructurada.
- **Notificaciones en tiempo real**: Mantiene informados a los ciudadanos sobre el estado de sus trámites.
- **Panel administrativo**: Facilita la gestión eficiente por parte del personal municipal.
- **Análisis de datos**: Genera estadísticas y reportes para la mejora continua del servicio.

## Arquitectura del Sistema

### Tecnologías Utilizadas

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Serverless con Next.js API Routes y Server Actions
- **Base de Datos**: PostgreSQL (alojada en Supabase)
- **Autenticación**: Supabase Auth
- **Almacenamiento**: Supabase Storage para documentos
- **Análisis de Datos**: Funciones SQL personalizadas para estadísticas y ML

### Estructura de la Base de Datos

El sistema utiliza una base de datos PostgreSQL con las siguientes tablas principales:

- `usuarios`: Almacena información de ciudadanos y personal administrativo
- `tipos_tramites`: Catálogo de trámites disponibles
- `tramites`: Registro de todos los trámites iniciados
- `documentos`: Archivos asociados a cada trámite
- `historial_tramites`: Seguimiento de cambios de estado
- `comentarios`: Comunicación entre ciudadanos y personal municipal
- `notificaciones`: Sistema de alertas para usuarios
- `metricas`: Datos para análisis estadístico

## ⚠️ Problemas Conocidos y Soluciones

### Errores Comunes de Conexión con Supabase

#### 1. "SUPABASE_SERVICE_ROLE_KEY cannot be accessed on the client"
**Causa**: Intento de usar la clave de servicio en el lado del cliente.
**Solución**: 
- ✅ **Ya corregido**: Removida la clave de servicio del cliente
- Solo usar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el frontend

#### 2. "Multiple GoTrueClient instances detected"
**Causa**: Múltiples instancias del cliente Supabase.
**Solución**: 
- ✅ **Ya corregido**: Implementado patrón singleton para el cliente
- Una sola instancia compartida en toda la aplicación

#### 3. "Infinite recursion detected in policy for relation 'usuarios'"
**Causa**: Políticas RLS circulares que se referencian a sí mismas.
**Solución**: 
- ✅ **Ya corregido**: Políticas RLS simplificadas
- Deshabilitado RLS temporalmente para desarrollo
- Para producción, implementar políticas más simples

#### 4. "Could not find a relationship between tables"
**Causa**: Nombres de tablas incorrectos o relaciones mal configuradas.
**Solución**: 
- ✅ **Ya corregido**: Consultas separadas y combinación manual
- Evitar consultas complejas con joins hasta que las relaciones estén bien configuradas

### Estado Actual del Sistema

🟢 **Funcionando Correctamente:**
- Interfaz de usuario completa
- Datos de ejemplo para desarrollo
- Filtros y búsquedas
- Navegación entre páginas
- Diseño responsivo

🟡 **En Desarrollo:**
- Conexión con Supabase (configuración manual requerida)
- Autenticación de usuarios
- Políticas de seguridad (RLS)

🔴 **Pendiente:**
- Carga de documentos
- Notificaciones en tiempo real
- Panel administrativo completo

## Requisitos de Instalación

### Prerrequisitos

- Node.js 18.x o superior
- npm 9.x o superior
- Cuenta en [Supabase](https://supabase.com)

### Pasos de Instalación

1. **Clonar el repositorio**

\`\`\`bash
git clone https://github.com/su-organizacion/sistema-municipal-tramites.git
cd sistema-municipal-tramites
\`\`\`

2. **Instalar dependencias**

\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**

Copia el archivo `.env.example` a `.env.local` y completa las variables:

\`\`\`bash
cp app/env.example .env.local
\`\`\`

Edita el archivo `.env.local` con tus credenciales de Supabase:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

⚠️ **Importante**: NO incluyas `SUPABASE_SERVICE_ROLE_KEY` en el archivo `.env.local` para evitar errores de seguridad.

4. **Configurar la base de datos en Supabase**

- Crea un nuevo proyecto en [Supabase](https://supabase.com)
- Ve a SQL Editor en el panel de Supabase
- Ejecuta los scripts SQL en el siguiente orden:
  1. `scripts/01-create-tables.sql`: Crea las tablas principales
  2. `scripts/02-insert-initial-data.sql`: Inserta datos iniciales
  3. ⚠️ **Omite temporalmente**: `scripts/03-create-rls-policies.sql` (causa errores de recursión)
  4. `scripts/04-create-functions.sql`: Crea funciones para análisis

5. **Verificar la conexión**

\`\`\`bash
npm run dev
\`\`\`

- Si ves "🟢 Conectado a la Base de Datos" = ¡Perfecto!
- Si ves "🟡 Modo de Vista Previa" = Variables de entorno no configuradas
- Si ves "🔴 Error de Conexión" = Problema con Supabase o credenciales

6. **Acceder a la aplicación**

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Solución de Problemas

### Si el sistema muestra "Modo de Vista Previa"

1. **Verifica las variables de entorno:**
   \`\`\`bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   \`\`\`

2. **Reinicia el servidor de desarrollo:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Verifica en Supabase:**
   - Proyecto activo
   - API keys correctas
   - Tablas creadas

### Si hay errores de RLS (Row Level Security)

1. **Deshabilita RLS temporalmente:**
   \`\`\`sql
   ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
   ALTER TABLE tramites DISABLE ROW LEVEL SECURITY;
   ALTER TABLE tipos_tramites DISABLE ROW LEVEL SECURITY;
   \`\`\`

2. **Para producción, habilita RLS con políticas simples:**
   \`\`\`sql
   ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Users can view own profile" ON usuarios FOR SELECT USING (auth.uid()::text = id);
   \`\`\`

### Si persisten los errores

1. **Revisa los logs del navegador** (F12 → Console)
2. **Verifica la configuración de Supabase** en el panel web
3. **Usa los datos de ejemplo** mientras solucionas la conexión
4. **Contacta soporte** si el problema persiste

## Despliegue en Producción

Para desplegar la aplicación en un entorno de producción:

1. **Construir la aplicación**

\`\`\`bash
npm run build
\`\`\`

2. **Desplegar en Vercel (recomendado)**

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

3. **Configurar variables de entorno en Vercel:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

También puedes configurar el despliegue automático conectando tu repositorio a Vercel.

## Funcionalidades Principales

### Para Ciudadanos

- ✅ Registro e inicio de sesión (en desarrollo)
- ✅ Visualización de trámites
- ✅ Filtros y búsqueda avanzada
- ⏳ Inicio de nuevos trámites
- ⏳ Carga de documentos
- ⏳ Seguimiento del estado de trámites
- ⏳ Recepción de notificaciones

### Para Personal Administrativo

- ⏳ Panel de administración de trámites
- ⏳ Asignación y gestión de tareas
- ⏳ Actualización de estados
- ⏳ Comunicación con ciudadanos
- ✅ Generación de reportes y estadísticas

## Integración con Supabase

El sistema utiliza Supabase como plataforma principal para:

1. **Autenticación**: Gestión de usuarios y sesiones (en desarrollo)
2. **Base de datos**: Almacenamiento y consulta de datos mediante PostgreSQL
3. **Almacenamiento**: Gestión de documentos y archivos (pendiente)
4. **Seguridad**: Políticas de Row Level Security (RLS) - temporalmente deshabilitadas
5. **Funciones**: Procesamiento de datos y análisis mediante funciones SQL

## Mantenimiento y Soporte

Para mantener el sistema funcionando correctamente:

1. **Actualizar regularmente las dependencias:**
\`\`\`bash
npm update
\`\`\`

2. **Monitorear los logs de errores** en la consola del navegador y Supabase
3. **Realizar copias de seguridad periódicas** de la base de datos
4. **Revisar y optimizar las consultas SQL** para mejorar el rendimiento
5. **Probar la conexión regularmente** usando el botón "Reintentar Conexión"

## Roadmap de Desarrollo

### Versión 1.1 (Próxima)
- 🔧 Arreglar políticas RLS
- 🔐 Implementar autenticación completa
- 📄 Sistema de carga de documentos

### Versión 1.2
- 🔔 Notificaciones en tiempo real
- 📊 Dashboard administrativo completo
- 📱 Aplicación móvil

### Versión 2.0
- 🤖 Integración con IA para clasificación automática
- 📈 Analytics avanzados
- 🌐 API pública para integraciones

## Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).

## Contacto

Para soporte técnico o consultas, contactar a:
- Email: soporte@municipalidad.gob
- Teléfono: (123) 456-7890
- GitHub Issues: Para reportar bugs o solicitar características

---

**Nota**: Este sistema está en desarrollo activo. Algunas funcionalidades pueden no estar completamente implementadas. Consulta la sección "Estado Actual del Sistema" para conocer qué funciona y qué está en desarrollo.
