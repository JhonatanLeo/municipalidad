-- Función para generar número de trámite único
CREATE OR REPLACE FUNCTION generar_numero_tramite()
RETURNS TEXT AS $$
DECLARE
    nuevo_numero TEXT;
    contador INTEGER;
BEGIN
    -- Obtener el contador actual del año
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_tramite FROM 10) AS INTEGER)), 0) + 1
    INTO contador
    FROM tramites
    WHERE numero_tramite LIKE 'TRM-' || EXTRACT(YEAR FROM NOW()) || '-%';
    
    -- Generar el nuevo número
    nuevo_numero := 'TRM-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(contador::TEXT, 3, '0');
    
    RETURN nuevo_numero;
END;
$$ LANGUAGE plpgsql;

-- Función para calcular tiempo de resolución
CREATE OR REPLACE FUNCTION calcular_tiempo_resolucion()
RETURNS TRIGGER AS $$
BEGIN
    -- Si el estado cambió a completado, calcular el tiempo de resolución
    IF NEW.estado = 'completado' AND OLD.estado != 'completado' THEN
        NEW.fecha_completado = NOW();
        NEW.tiempo_resolucion_dias = EXTRACT(DAY FROM (NOW() - NEW.fecha_inicio));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para calcular tiempo de resolución
CREATE TRIGGER trigger_calcular_tiempo_resolucion
    BEFORE UPDATE ON tramites
    FOR EACH ROW
    EXECUTE FUNCTION calcular_tiempo_resolucion();

-- Función para crear entrada en historial cuando cambia el estado
CREATE OR REPLACE FUNCTION crear_historial_cambio_estado()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo crear historial si el estado realmente cambió
    IF OLD.estado IS DISTINCT FROM NEW.estado THEN
        INSERT INTO historial_tramites (
            tramite_id,
            estado_anterior,
            estado_nuevo,
            comentario,
            usuario_id,
            datos_adicionales
        ) VALUES (
            NEW.id,
            OLD.estado,
            NEW.estado,
            CASE 
                WHEN NEW.estado = 'aprobado' THEN 'Trámite aprobado automáticamente'
                WHEN NEW.estado = 'rechazado' THEN 'Trámite rechazado - revisar observaciones'
                WHEN NEW.estado = 'completado' THEN 'Trámite completado exitosamente'
                ELSE 'Cambio de estado del trámite'
            END,
            COALESCE(NEW.asignado_a, OLD.asignado_a),
            jsonb_build_object(
                'fecha_cambio', NOW(),
                'estado_anterior', OLD.estado,
                'estado_nuevo', NEW.estado
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para historial de cambios de estado
CREATE TRIGGER trigger_crear_historial_cambio_estado
    AFTER UPDATE ON tramites
    FOR EACH ROW
    EXECUTE FUNCTION crear_historial_cambio_estado();

-- Función para obtener estadísticas de trámites
CREATE OR REPLACE FUNCTION obtener_estadisticas_tramites(
    fecha_inicio DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    fecha_fin DATE DEFAULT CURRENT_DATE
)
RETURNS JSON AS $$
DECLARE
    resultado JSON;
BEGIN
    SELECT json_build_object(
        'total_tramites', (
            SELECT COUNT(*) FROM tramites 
            WHERE fecha_inicio::DATE BETWEEN fecha_inicio AND fecha_fin
        ),
        'tramites_completados', (
            SELECT COUNT(*) FROM tramites 
            WHERE estado = 'completado' 
            AND fecha_inicio::DATE BETWEEN fecha_inicio AND fecha_fin
        ),
        'tiempo_promedio_resolucion', (
            SELECT ROUND(AVG(tiempo_resolucion_dias), 2) FROM tramites 
            WHERE estado = 'completado' 
            AND fecha_inicio::DATE BETWEEN fecha_inicio AND fecha_fin
        ),
        'tramites_por_estado', (
            SELECT json_object_agg(estado, cantidad)
            FROM (
                SELECT estado, COUNT(*) as cantidad
                FROM tramites 
                WHERE fecha_inicio::DATE BETWEEN fecha_inicio AND fecha_fin
                GROUP BY estado
            ) t
        ),
        'tramites_por_tipo', (
            SELECT json_object_agg(tt.nombre, t.cantidad)
            FROM (
                SELECT tipo_tramite_id, COUNT(*) as cantidad
                FROM tramites 
                WHERE fecha_inicio::DATE BETWEEN fecha_inicio AND fecha_fin
                GROUP BY tipo_tramite_id
            ) t
            JOIN tipos_tramites tt ON tt.id = t.tipo_tramite_id
        )
    ) INTO resultado;
    
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- Función para análisis de Machine Learning (simplificado)
CREATE OR REPLACE FUNCTION analizar_prioridad_tramite(
    tipo_tramite_codigo TEXT,
    descripcion TEXT,
    usuario_historial JSON DEFAULT '{}'::JSON
)
RETURNS TEXT AS $$
DECLARE
    score INTEGER := 0;
    prioridad TEXT;
BEGIN
    -- Análisis basado en tipo de trámite
    CASE tipo_tramite_codigo
        WHEN 'LIC_CONSTRUCCION' THEN score := score + 3;
        WHEN 'RECLAMO_SERVICIOS' THEN score := score + 3;
        WHEN 'PERM_COMERCIAL' THEN score := score + 2;
        WHEN 'PERM_EVENTO' THEN score := score + 2;
        WHEN 'CERT_RESIDENCIA' THEN score := score + 1;
        ELSE score := score + 1;
    END CASE;
    
    -- Análisis de palabras clave en descripción
    IF descripcion ILIKE '%urgente%' OR descripcion ILIKE '%emergencia%' THEN
        score := score + 2;
    END IF;
    
    IF descripcion ILIKE '%comercial%' OR descripcion ILIKE '%negocio%' THEN
        score := score + 1;
    END IF;
    
    -- Determinar prioridad final
    IF score >= 5 THEN
        prioridad := 'urgente';
    ELSIF score >= 3 THEN
        prioridad := 'alta';
    ELSIF score >= 2 THEN
        prioridad := 'media';
    ELSE
        prioridad := 'baja';
    END IF;
    
    RETURN prioridad;
END;
$$ LANGUAGE plpgsql;
