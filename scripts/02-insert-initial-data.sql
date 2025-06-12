-- Insertar tipos de trámites iniciales - Updated to 2025
INSERT INTO tipos_tramites (codigo, nombre, descripcion, documentos_requeridos, tiempo_estimado_dias, costo) VALUES
('LIC_CONSTRUCCION', 'Licencia de Construcción', 'Solicitud de licencia para construcción, ampliación o remodelación', 
 '["Planos arquitectónicos", "Título de propiedad", "Identificación del solicitante", "Certificado de zonificación"]', 
 10, 150.00),
('PERM_COMERCIAL', 'Permiso Comercial', 'Solicitud de permiso para establecimiento comercial',
 '["Registro fiscal", "Identificación del propietario", "Contrato de arrendamiento", "Certificado de bomberos"]',
 7, 75.00),
('CERT_RESIDENCIA', 'Certificado de Residencia', 'Solicitud de certificado que acredita residencia en el municipio',
 '["Identificación", "Comprobante de domicilio"]',
 3, 10.00),
('RECLAMO_SERVICIOS', 'Reclamo por Servicios', 'Presentación de reclamo por servicios municipales',
 '["Identificación", "Comprobante de pago", "Evidencia del problema"]',
 5, 0.00),
('PERM_EVENTO', 'Permiso de Evento', 'Solicitud de permiso para eventos públicos o privados',
 '["Identificación del organizador", "Plan del evento", "Seguro de responsabilidad civil"]',
 5, 50.00);

-- Insertar usuarios administrativos iniciales - Updated to 2025
INSERT INTO usuarios (email, nombre, apellido, documento, telefono, tipo_usuario) VALUES
('admin@municipalidad.gob', 'Ana', 'Martínez', 'ADM001', '555-0001', 'administrativo'),
('supervisor@municipalidad.gob', 'Carlos', 'Rodríguez', 'SUP001', '555-0002', 'supervisor'),
('revisor@municipalidad.gob', 'María', 'González', 'REV001', '555-0003', 'administrativo');

-- Insertar configuración inicial del sistema - Updated to 2025
INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo_dato, categoria) VALUES
('tiempo_maximo_respuesta_dias', '15', 'Tiempo máximo en días para responder a un trámite', 'number', 'tramites'),
('notificaciones_email_activas', 'true', 'Activar notificaciones por email', 'boolean', 'notificaciones'),
('notificaciones_sms_activas', 'true', 'Activar notificaciones por SMS', 'boolean', 'notificaciones'),
('costo_tramite_urgente_multiplicador', '2.0', 'Multiplicador de costo para trámites urgentes', 'number', 'costos'),
('horario_atencion', '{"inicio": "08:00", "fin": "17:00", "dias": ["lunes", "martes", "miercoles", "jueves", "viernes"]}', 'Horario de atención al público', 'json', 'general');

-- Insertar métricas iniciales (datos de ejemplo) - Updated to 2025
INSERT INTO metricas (fecha, tipo_metrica, valor, unidad, categoria) VALUES
(CURRENT_DATE - INTERVAL '30 days', 'tramites_iniciados', 45, 'cantidad', 'tramites'),
(CURRENT_DATE - INTERVAL '30 days', 'tramites_completados', 38, 'cantidad', 'tramites'),
(CURRENT_DATE - INTERVAL '30 days', 'tiempo_promedio_resolucion', 6.5, 'dias', 'rendimiento'),
(CURRENT_DATE - INTERVAL '29 days', 'tramites_iniciados', 52, 'cantidad', 'tramites'),
(CURRENT_DATE - INTERVAL '29 days', 'tramites_completados', 41, 'cantidad', 'tramites'),
(CURRENT_DATE - INTERVAL '29 days', 'tiempo_promedio_resolucion', 6.2, 'dias', 'rendimiento'),
(CURRENT_DATE - INTERVAL '28 days', 'tramites_iniciados', 48, 'cantidad', 'tramites'),
(CURRENT_DATE - INTERVAL '28 days', 'tramites_completados', 44, 'cantidad', 'tramites'),
(CURRENT_DATE - INTERVAL '28 days', 'tiempo_promedio_resolucion', 5.8, 'dias', 'rendimiento'),
(CURRENT_DATE - INTERVAL '27 days', 'tramites_iniciados', 55, 'cantidad', 'tramites'),
(CURRENT_DATE - INTERVAL '27 days', 'tramites_completados', 47, 'cantidad', 'tramites'),
(CURRENT_DATE - INTERVAL '27 days', 'tiempo_promedio_resolucion', 6.1, 'dias', 'rendimiento');

-- Insertar algunos trámites de ejemplo para 2025
INSERT INTO tramites (numero_tramite, usuario_id, tipo_tramite_id, descripcion, estado, prioridad, fecha_inicio, fecha_limite, costo_total, direccion_tramite, datos_adicionales) VALUES
('TRM-2025-001', 'user-example-1', (SELECT id FROM tipos_tramites WHERE codigo = 'LIC_CONSTRUCCION'), 'Construcción de vivienda unifamiliar en zona residencial', 'En proceso', 'Alta', '2025-01-15', '2025-01-25', 150.00, 'Av. Principal 123', '{"telefono": "555-1234", "email": "usuario1@ejemplo.com"}'),
('TRM-2025-002', 'user-example-2', (SELECT id FROM tipos_tramites WHERE codigo = 'CERT_RESIDENCIA'), 'Certificado de residencia para trámites bancarios', 'Completado', 'Media', '2025-01-10', '2025-01-13', 10.00, 'Calle 5 #456', '{"telefono": "555-5678", "email": "usuario2@ejemplo.com"}'),
('TRM-2025-003', 'user-example-3', (SELECT id FROM tipos_tramites WHERE codigo = 'PERM_COMERCIAL'), 'Apertura de restaurante familiar', 'Pendiente', 'Media', '2025-01-18', '2025-01-25', 75.00, 'Plaza Central Local 3', '{"telefono": "555-9012", "email": "usuario3@ejemplo.com"}'),
('TRM-2025-004', 'user-example-4', (SELECT id FROM tipos_tramites WHERE codigo = 'RECLAMO_SERVICIOS'), 'Falta de recolección de basura', 'En revisión', 'Alta', '2025-01-20', '2025-01-25', 0.00, 'Barrio Norte Mz. 5', '{"telefono": "555-3456", "email": "usuario4@ejemplo.com"}');
