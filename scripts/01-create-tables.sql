-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE usuarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  documento VARCHAR(20) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  tipo_usuario VARCHAR(20) DEFAULT 'ciudadano' CHECK (tipo_usuario IN ('ciudadano', 'administrativo', 'supervisor')),
  activo BOOLEAN DEFAULT true,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultima_conexion TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de tipos de trámites
CREATE TABLE tipos_tramites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  documentos_requeridos JSONB,
  tiempo_estimado_dias INTEGER DEFAULT 5,
  costo DECIMAL(10,2) DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de trámites
CREATE TABLE tramites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  numero_tramite VARCHAR(20) UNIQUE NOT NULL,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo_tramite_id UUID REFERENCES tipos_tramites(id),
  estado VARCHAR(50) DEFAULT 'recibido' CHECK (estado IN ('recibido', 'en_revision', 'documentacion_incompleta', 'en_proceso', 'aprobado', 'rechazado', 'completado')),
  prioridad VARCHAR(20) DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
  descripcion TEXT NOT NULL,
  direccion_tramite TEXT,
  datos_adicionales JSONB,
  asignado_a UUID REFERENCES usuarios(id),
  fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_limite TIMESTAMP WITH TIME ZONE,
  fecha_completado TIMESTAMP WITH TIME ZONE,
  tiempo_resolucion_dias INTEGER,
  costo_total DECIMAL(10,2) DEFAULT 0,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de documentos
CREATE TABLE documentos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tramite_id UUID REFERENCES tramites(id) ON DELETE CASCADE,
  nombre_documento VARCHAR(200) NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  url_archivo TEXT NOT NULL,
  tipo_mime VARCHAR(100),
  tamaño_bytes BIGINT,
  requerido BOOLEAN DEFAULT false,
  aprobado BOOLEAN DEFAULT false,
  observaciones TEXT,
  subido_por UUID REFERENCES usuarios(id),
  fecha_subida TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de historial de trámites
CREATE TABLE historial_tramites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tramite_id UUID REFERENCES tramites(id) ON DELETE CASCADE,
  estado_anterior VARCHAR(50),
  estado_nuevo VARCHAR(50) NOT NULL,
  comentario TEXT,
  usuario_id UUID REFERENCES usuarios(id),
  fecha_cambio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  datos_adicionales JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de comentarios
CREATE TABLE comentarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tramite_id UUID REFERENCES tramites(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id),
  contenido TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'comentario' CHECK (tipo IN ('comentario', 'consulta', 'respuesta', 'observacion')),
  publico BOOLEAN DEFAULT true,
  fecha_comentario TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de notificaciones
CREATE TABLE notificaciones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tramite_id UUID REFERENCES tramites(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('estado_cambio', 'documento_requerido', 'aprobacion', 'rechazo', 'recordatorio', 'comentario')),
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  canal VARCHAR(20) DEFAULT 'plataforma' CHECK (canal IN ('email', 'sms', 'plataforma', 'push')),
  enviado BOOLEAN DEFAULT false,
  leida BOOLEAN DEFAULT false,
  fecha_envio TIMESTAMP WITH TIME ZONE,
  fecha_lectura TIMESTAMP WITH TIME ZONE,
  datos_adicionales JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de configuración del sistema
CREATE TABLE configuracion_sistema (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT,
  descripcion TEXT,
  tipo_dato VARCHAR(20) DEFAULT 'string' CHECK (tipo_dato IN ('string', 'number', 'boolean', 'json')),
  categoria VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de métricas y estadísticas
CREATE TABLE metricas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  fecha DATE NOT NULL,
  tipo_metrica VARCHAR(50) NOT NULL,
  valor DECIMAL(15,4) NOT NULL,
  unidad VARCHAR(20),
  categoria VARCHAR(50),
  datos_adicionales JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_tramites_usuario_id ON tramites(usuario_id);
CREATE INDEX idx_tramites_estado ON tramites(estado);
CREATE INDEX idx_tramites_prioridad ON tramites(prioridad);
CREATE INDEX idx_tramites_fecha_inicio ON tramites(fecha_inicio);
CREATE INDEX idx_tramites_numero ON tramites(numero_tramite);
CREATE INDEX idx_documentos_tramite_id ON documentos(tramite_id);
CREATE INDEX idx_historial_tramite_id ON historial_tramites(tramite_id);
CREATE INDEX idx_comentarios_tramite_id ON comentarios(tramite_id);
CREATE INDEX idx_notificaciones_usuario_id ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX idx_metricas_fecha ON metricas(fecha);
CREATE INDEX idx_metricas_tipo ON metricas(tipo_metrica);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tipos_tramites_updated_at BEFORE UPDATE ON tipos_tramites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tramites_updated_at BEFORE UPDATE ON tramites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documentos_updated_at BEFORE UPDATE ON documentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comentarios_updated_at BEFORE UPDATE ON comentarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notificaciones_updated_at BEFORE UPDATE ON notificaciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracion_sistema_updated_at BEFORE UPDATE ON configuracion_sistema FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
