-- ==============================================================================
-- ALPHA LASH BY JOCCE - ESQUEMA DE BASE DE DATOS POSTGRESQL & POSTGREST
-- Esquema: bdalpha-lash
-- Dominio: https://alpha-lash.cl
-- ==============================================================================

-- 1. Habilitar extensión para UUIDs criptográficos
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Crear esquema exclusivo
CREATE SCHEMA IF NOT EXISTS "bdalpha-lash";

-- Establecer esquema para las operaciones siguientes
SET search_path TO "bdalpha-lash", public;

-- ==============================================================================
-- TABLA: categorias
-- ==============================================================================
CREATE TABLE IF NOT EXISTS "bdalpha-lash".categorias (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- TABLA: productos
-- ==============================================================================
CREATE TABLE IF NOT EXISTS "bdalpha-lash".productos (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uid_categoria UUID NOT NULL REFERENCES "bdalpha-lash".categorias(uid) ON DELETE RESTRICT,
    sku VARCHAR(30) UNIQUE NOT NULL,
    nombre_producto VARCHAR(200) NOT NULL,
    descripcion TEXT,
    imagen_base64 TEXT, -- Almacenada en formato data:image/jpeg;base64,... optimizada (<100KB)
    precio NUMERIC(12, 2) NOT NULL CHECK (precio >= 0),
    cantidad INTEGER NOT NULL DEFAULT 0 CHECK (cantidad >= 0),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Secuencia y Función/Trigger para generación automática de SKU (ej. LASH-1001)
CREATE SEQUENCE IF NOT EXISTS "bdalpha-lash".seq_sku_productos START WITH 1001;

CREATE OR REPLACE FUNCTION "bdalpha-lash".generar_sku_producto()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sku IS NULL OR NEW.sku = '' THEN
        NEW.sku := 'LASH-' || nextval('"bdalpha-lash".seq_sku_productos')::TEXT;
    END IF;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generar_sku_producto ON "bdalpha-lash".productos;
CREATE TRIGGER trg_generar_sku_producto
BEFORE INSERT OR UPDATE ON "bdalpha-lash".productos
FOR EACH ROW
EXECUTE FUNCTION "bdalpha-lash".generar_sku_producto();

-- ==============================================================================
-- TABLA: usuarios (Administradores y Personal)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS "bdalpha-lash".usuarios (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_usuario VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'editor', -- 'admin', 'editor'
    correo VARCHAR(150) UNIQUE NOT NULL,
    clave VARCHAR(255) NOT NULL, -- Contraseña hasheada (bcrypt / pgcrypto)
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- TABLA: clientes (Registrados exclusivamente mediante Google OAuth 2.0)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS "bdalpha-lash".clientes (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    celular VARCHAR(30),
    correo VARCHAR(150) NOT NULL,
    direccion TEXT, -- Ubicación (ej: San Bernardo, Santiago)
    activo BOOLEAN NOT NULL DEFAULT TRUE, -- Control de activación por parte del administrador
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- TABLA: ordenes (Historial de compras / simulación de pedidos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS "bdalpha-lash".ordenes (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_orden VARCHAR(30) UNIQUE NOT NULL,
    uid_cliente UUID REFERENCES "bdalpha-lash".clientes(uid) ON DELETE SET NULL,
    total NUMERIC(12, 2) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'confirmada', 'entregada', 'cancelada'
    detalles JSONB NOT NULL, -- Lista de items, precios unitarios, subtotales
    direccion_envio TEXT,
    celular_contacto VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- CONFIGURACIÓN DE ROLES Y PERMISOS PARA POSTGREST (PUERTO 8005)
-- ==============================================================================

-- Rol anónimo de PostgREST
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'web_anon') THEN
        CREATE ROLE web_anon NOLOGIN;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticator') THEN
        CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'tu_clave_segura_postgrest';
    END IF;
END
$$;

GRANT web_anon TO authenticator;

-- Conceder permisos de uso sobre el esquema
GRANT USAGE ON SCHEMA "bdalpha-lash" TO web_anon;

-- Permisos de lectura pública para catálogo y categorías
GRANT SELECT ON "bdalpha-lash".categorias TO web_anon;
GRANT SELECT ON "bdalpha-lash".productos TO web_anon;

-- Permisos para registro de clientes y pedidos anónimos/autenticados vía web
GRANT INSERT, UPDATE, SELECT ON "bdalpha-lash".clientes TO web_anon;
GRANT INSERT, SELECT ON "bdalpha-lash".ordenes TO web_anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA "bdalpha-lash" TO web_anon;

-- Rol para operaciones de administración (CRUD completo)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'alpha_admin') THEN
        CREATE ROLE alpha_admin NOLOGIN;
    END IF;
END
$$;
GRANT alpha_admin TO authenticator;
GRANT ALL PRIVILEGES ON SCHEMA "bdalpha-lash" TO alpha_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "bdalpha-lash" TO alpha_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "bdalpha-lash" TO alpha_admin;

-- ==============================================================================
-- DATOS INICIALES (SEED DATA)
-- ==============================================================================

-- 1. Categorías de Insumos y Extensiones de Pestañas
INSERT INTO "bdalpha-lash".categorias (uid, nombre_categoria, descripcion, activo)
VALUES 
    ('11111111-1111-1111-1111-111111111101', 'Extensiones de Pestañas', 'Fibras tecnológicas premium, curvaturas C, D, CC y efectos volumen ruso', TRUE),
    ('11111111-1111-1111-1111-111111111102', 'Adhesivos y Pegamentos', 'Pegamentos de secado rápido, ultra retención e hipoalergénicos', TRUE),
    ('11111111-1111-1111-1111-111111111103', 'Pinzas y Herramientas', 'Pinzas japonesas de alta precisión de aislamiento y volumen', TRUE),
    ('11111111-1111-1111-1111-111111111104', 'Cuidado y Limpieza', 'Lash shampoo, primers, removedores en crema y selladores protectores', TRUE)
ON CONFLICT (uid) DO NOTHING;

-- 2. Usuario Administrador Inicial
-- Clave por defecto: Admin2026! (hasheada con blowfish crypt)
INSERT INTO "bdalpha-lash".usuarios (uid, nombre_usuario, rol, correo, clave, activo)
VALUES 
    ('22222222-2222-2222-2222-222222222201', 'Administrador Alpha Lash', 'admin', 'admin@alpha-lash.cl', crypt('Admin2026!', gen_salt('bf', 8)), TRUE)
ON CONFLICT (correo) DO NOTHING;

-- 3. Productos Iniciales de Demostración
INSERT INTO "bdalpha-lash".productos (uid, uid_categoria, sku, nombre_producto, descripcion, precio, cantidad, activo)
VALUES 
    ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101', 'LASH-1001', 'Caja Pestañas Cashmere 0.07 Curva D Mix', 'Bandeja de 16 líneas de fibra aterciopelada ultraligera, acabado negro mate profundo sin reflejos azulados.', 14990, 45, TRUE),
    ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111101', 'LASH-1002', 'Pestañas Tecnológicas W 4D Efecto Volumen', 'Extensiones en forma de W para aplicaciones de volumen express con densidad uniforme.', 16990, 30, TRUE),
    ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111102', 'LASH-1003', 'Adhesivo Alpha Gold Ultra Bond 5ml', 'Secado de 0.5 a 1 segundo, retención garantizada de 6 a 8 semanas, ideal para clima de Santiago.', 22990, 25, TRUE),
    ('33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111103', 'LASH-1004', 'Pinza de Aislamiento Acero Japonés Dorado', 'Pinza ergonómica con calibración milimétrica para evitar fatiga en jornadas de aplicación.', 12500, 18, TRUE),
    ('33333333-3333-3333-3333-333333333305', '11111111-1111-1111-1111-111111111104', 'LASH-1005', 'Lash Shampoo Limpiador Espuma 60ml + Brocha', 'Fórmula pH neutro sin aceites, diseñada para prolongar la vida útil de las extensiones.', 8990, 50, TRUE)
ON CONFLICT (uid) DO NOTHING;
