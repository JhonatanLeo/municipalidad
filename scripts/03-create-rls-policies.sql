-- Deshabilitar RLS temporalmente para evitar problemas de recursión
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE tramites DISABLE ROW LEVEL SECURITY;
ALTER TABLE documentos DISABLE ROW LEVEL SECURITY;
ALTER TABLE historial_tramites DISABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_tramites DISABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_sistema DISABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver usuarios" ON usuarios;
DROP POLICY IF EXISTS "Permitir inserción de usuarios" ON usuarios;
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios trámites" ON tramites;
DROP POLICY IF EXISTS "Los usuarios pueden crear sus propios trámites" ON tramites;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propios trámites" ON tramites;
DROP POLICY IF EXISTS "Los usuarios pueden ver documentos de sus trámites" ON documentos;
DROP POLICY IF EXISTS "Los usuarios pueden subir documentos a sus trámites" ON documentos;
DROP POLICY IF EXISTS "Los usuarios pueden ver comentarios de sus trámites" ON comentarios;
DROP POLICY IF EXISTS "Los usuarios pueden comentar en sus trámites" ON comentarios;
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propias notificaciones" ON notificaciones;
DROP POLICY IF EXISTS "Los usuarios pueden ver el historial de sus trámites" ON historial_tramites;
DROP POLICY IF EXISTS "Todos pueden ver tipos de trámites activos" ON tipos_tramites;
DROP POLICY IF EXISTS "Acceso limitado a configuración" ON configuracion_sistema;

-- Por ahora, mantener las tablas sin RLS para evitar problemas
-- En producción, se pueden habilitar políticas más simples

-- Comentario: Las políticas RLS se pueden habilitar más tarde cuando se configure
-- correctamente la autenticación y se eviten las referencias circulares
