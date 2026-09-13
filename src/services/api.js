/**
 * Cliente de API para PostgREST (puerto 8005) sobre el esquema bdalpha-lash.
 * Incluye modo de respaldo reactivo (local cache / seed) para que la aplicación
 * funcione 100% interactiva en previsualizaciones y cuando la base de datos se esté levantando.
 */

const API_BASE_URL = import.meta.env.VITE_API_POSTGREST_URL || 'http://localhost:8005';

// Datos iniciales de respaldo alineados con el script SQL
const SEED_CATEGORIAS = [
  {
    uid: '11111111-1111-1111-1111-111111111101',
    nombre_categoria: 'Extensiones de Pestañas',
    descripcion: 'Fibras tecnológicas premium, curvaturas C, D, CC y efectos volumen ruso',
    activo: true,
  },
  {
    uid: '11111111-1111-1111-1111-111111111102',
    nombre_categoria: 'Adhesivos y Pegamentos',
    descripcion: 'Pegamentos de secado rápido, ultra retención e hipoalergénicos',
    activo: true,
  },
  {
    uid: '11111111-1111-1111-1111-111111111103',
    nombre_categoria: 'Pinzas y Herramientas',
    descripcion: 'Pinzas japonesas de alta precisión de aislamiento y volumen',
    activo: true,
  },
  {
    uid: '11111111-1111-1111-1111-111111111104',
    nombre_categoria: 'Cuidado y Limpieza',
    descripcion: 'Lash shampoo, primers, removedores en crema y selladores protectores',
    activo: true,
  },
];

const SEED_PRODUCTOS = [
  {
    uid: '33333333-3333-3333-3333-333333333301',
    uid_categoria: '11111111-1111-1111-1111-111111111101',
    sku: 'LASH-1001',
    nombre_producto: 'Caja Pestañas Cashmere 0.07 Curva D Mix',
    descripcion: 'Bandeja de 16 líneas de fibra aterciopelada ultraligera, acabado negro mate profundo sin reflejos azulados.',
    imagen_base64: '',
    precio: 14990,
    cantidad: 45,
    activo: true,
  },
  {
    uid: '33333333-3333-3333-3333-333333333302',
    uid_categoria: '11111111-1111-1111-1111-111111111101',
    sku: 'LASH-1002',
    nombre_producto: 'Pestañas Tecnológicas W 4D Efecto Volumen',
    descripcion: 'Extensiones en forma de W para aplicaciones de volumen express con densidad uniforme y base plana.',
    imagen_base64: '',
    precio: 16990,
    cantidad: 30,
    activo: true,
  },
  {
    uid: '33333333-3333-3333-3333-333333333303',
    uid_categoria: '11111111-1111-1111-1111-111111111102',
    sku: 'LASH-1003',
    nombre_producto: 'Adhesivo Alpha Gold Ultra Bond 5ml',
    descripcion: 'Secado instantáneo de 0.5 a 1 segundo, retención de 6 a 8 semanas, formulado especialmente para el clima de Santiago.',
    imagen_base64: '',
    precio: 22990,
    cantidad: 25,
    activo: true,
  },
  {
    uid: '33333333-3333-3333-3333-333333333304',
    uid_categoria: '11111111-1111-1111-1111-111111111103',
    sku: 'LASH-1004',
    nombre_producto: 'Pinza de Aislamiento Acero Japonés Dorado',
    descripcion: 'Pinza ergonómica con calibración milimétrica para evitar fatiga en muñecas durante jornadas intensivas de lashista.',
    imagen_base64: '',
    precio: 12500,
    cantidad: 18,
    activo: true,
  },
  {
    uid: '33333333-3333-3333-3333-333333333305',
    uid_categoria: '11111111-1111-1111-1111-111111111104',
    sku: 'LASH-1005',
    nombre_producto: 'Lash Shampoo Limpiador Espuma 60ml + Brocha',
    descripcion: 'Fórmula espumosa pH neutro sin aceites, remueve impurezas y oleosidad natural, prolongando la retención de extensiones.',
    imagen_base64: '',
    precio: 8990,
    cantidad: 50,
    activo: true,
  },
];

const SEED_USUARIOS = [
  {
    uid: '22222222-2222-2222-2222-222222222201',
    nombre_usuario: 'Administrador Alpha Lash',
    rol: 'admin',
    correo: 'admin@alpha-lash.cl',
    activo: true,
  },
];

const SEED_CLIENTES = [
  {
    uid: '44444444-4444-4444-4444-444444444401',
    google_id: 'google_demo_101',
    nombre: 'Valentina Henríquez',
    celular: '+56 9 8765 4321',
    correo: 'valentina.lash@gmail.com',
    direccion: 'Avenida América 450, San Bernardo',
    activo: true,
    created_at: new Date().toISOString(),
  },
];

// Almacenamiento local para asegurar persistencia cuando no hay conexión con PostgREST
function getStorage(key, fallback) {
  try {
    const item = localStorage.getItem(`alpha_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, data) {
  try {
    localStorage.setItem(`alpha_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error guardando ${key} en localStorage:`, e);
  }
}

// Inicializar almacenamiento si está vacío
if (!localStorage.getItem('alpha_categorias')) setStorage('categorias', SEED_CATEGORIAS);
if (!localStorage.getItem('alpha_productos')) setStorage('productos', SEED_PRODUCTOS);
if (!localStorage.getItem('alpha_usuarios')) setStorage('usuarios', SEED_USUARIOS);
if (!localStorage.getItem('alpha_clientes')) setStorage('clientes', SEED_CLIENTES);
if (!localStorage.getItem('alpha_ordenes')) setStorage('ordenes', []);

// Helper genérico para peticiones a PostgREST con fallback
async function fetchPostgREST(endpoint, options = {}, storageKey = null) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5 segundos de timeout

    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      if (res.status === 204) return null;
      return await res.json();
    }
  } catch (err) {
    // Si la conexión falla (puerto 8005 no disponible todavía), caemos al almacenamiento local reactivo
    // console.info(`PostgREST ${endpoint} offline, utilizando almacenamiento local.`);
  }

  return null;
}

export const api = {
  // ==================== CATEGORÍAS ====================
  async getCategorias(soloActivas = true) {
    const res = await fetchPostgREST(`categorias?${soloActivas ? 'activo=eq.true&' : ''}order=nombre_categoria.asc`);
    if (res && Array.isArray(res)) return res;

    const list = getStorage('categorias', SEED_CATEGORIAS);
    return soloActivas ? list.filter((c) => c.activo) : list;
  },

  async createCategoria(data) {
    const newCat = {
      uid: crypto.randomUUID ? crypto.randomUUID() : `cat-${Date.now()}`,
      nombre_categoria: data.nombre_categoria,
      descripcion: data.descripcion || '',
      activo: data.activo !== undefined ? data.activo : true,
    };

    const res = await fetchPostgREST('categorias', {
      method: 'POST',
      body: JSON.stringify(newCat),
    });

    // Actualizar siempre localmente para consistencia inmediata
    const list = getStorage('categorias', SEED_CATEGORIAS);
    list.push(newCat);
    setStorage('categorias', list);

    return res || newCat;
  },

  async updateCategoria(uid, data) {
    await fetchPostgREST(`categorias?uid=eq.${uid}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    const list = getStorage('categorias', SEED_CATEGORIAS);
    const index = list.findIndex((c) => c.uid === uid);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      setStorage('categorias', list);
    }
    return list[index];
  },

  // ==================== PRODUCTOS ====================
  async getProductos(soloActivos = true) {
    const res = await fetchPostgREST(`productos?${soloActivos ? 'activo=eq.true&' : ''}order=created_at.desc`);
    if (res && Array.isArray(res)) return res;

    const list = getStorage('productos', SEED_PRODUCTOS);
    return soloActivos ? list.filter((p) => p.activo) : list;
  },

  async createProducto(data) {
    const list = getStorage('productos', SEED_PRODUCTOS);
    const nextSeq = 1000 + list.length + 1;
    const skuGenerado = data.sku || `LASH-${nextSeq}`;

    const newProd = {
      uid: crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`,
      uid_categoria: data.uid_categoria,
      sku: skuGenerado,
      nombre_producto: data.nombre_producto,
      descripcion: data.descripcion || '',
      imagen_base64: data.imagen_base64 || '',
      precio: Number(data.precio) || 0,
      cantidad: Number(data.cantidad) || 0,
      activo: data.activo !== undefined ? data.activo : true,
      created_at: new Date().toISOString(),
    };

    await fetchPostgREST('productos', {
      method: 'POST',
      body: JSON.stringify(newProd),
    });

    list.unshift(newProd);
    setStorage('productos', list);
    return newProd;
  },

  async updateProducto(uid, data) {
    await fetchPostgREST(`productos?uid=eq.${uid}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    const list = getStorage('productos', SEED_PRODUCTOS);
    const index = list.findIndex((p) => p.uid === uid);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      setStorage('productos', list);
    }
    return list[index];
  },

  // ==================== CLIENTES (GOOGLE OAUTH) ====================
  async getClientes() {
    const res = await fetchPostgREST('clientes?order=created_at.desc');
    if (res && Array.isArray(res)) return res;
    return getStorage('clientes', SEED_CLIENTES);
  },

  async syncClienteGoogle(googleUser) {
    // googleUser: { google_id, nombre, correo, celular, direccion }
    const list = getStorage('clientes', SEED_CLIENTES);
    let cliente = list.find((c) => c.google_id === googleUser.google_id || c.correo === googleUser.correo);

    if (cliente) {
      // Actualizar datos existentes si se proporcionan
      const updated = {
        ...cliente,
        nombre: googleUser.nombre || cliente.nombre,
        celular: googleUser.celular || cliente.celular || '',
        direccion: googleUser.direccion || cliente.direccion || '',
      };
      await this.updateCliente(cliente.uid, updated);
      return updated;
    } else {
      // Registrar nuevo cliente Google
      const nuevoCliente = {
        uid: crypto.randomUUID ? crypto.randomUUID() : `cli-${Date.now()}`,
        google_id: googleUser.google_id,
        nombre: googleUser.nombre,
        correo: googleUser.correo,
        celular: googleUser.celular || '',
        direccion: googleUser.direccion || 'San Bernardo, Santiago',
        activo: true,
        created_at: new Date().toISOString(),
      };

      await fetchPostgREST('clientes', {
        method: 'POST',
        body: JSON.stringify(nuevoCliente),
      });

      list.unshift(nuevoCliente);
      setStorage('clientes', list);
      return nuevoCliente;
    }
  },

  async updateCliente(uid, data) {
    await fetchPostgREST(`clientes?uid=eq.${uid}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    const list = getStorage('clientes', SEED_CLIENTES);
    const index = list.findIndex((c) => c.uid === uid);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      setStorage('clientes', list);
    }
    return list[index];
  },

  // ==================== USUARIOS (ADMINISTRACIÓN) ====================
  async getUsuarios() {
    const res = await fetchPostgREST('usuarios?order=nombre_usuario.asc');
    if (res && Array.isArray(res)) return res;
    return getStorage('usuarios', SEED_USUARIOS);
  },

  async createUsuario(data) {
    const newUsr = {
      uid: crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
      nombre_usuario: data.nombre_usuario,
      rol: data.rol || 'editor',
      correo: data.correo,
      clave: data.clave || 'Admin2026!',
      activo: data.activo !== undefined ? data.activo : true,
    };

    await fetchPostgREST('usuarios', {
      method: 'POST',
      body: JSON.stringify(newUsr),
    });

    const list = getStorage('usuarios', SEED_USUARIOS);
    list.push(newUsr);
    setStorage('usuarios', list);
    return newUsr;
  },

  async updateUsuario(uid, data) {
    await fetchPostgREST(`usuarios?uid=eq.${uid}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    const list = getStorage('usuarios', SEED_USUARIOS);
    const index = list.findIndex((u) => u.uid === uid);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      setStorage('usuarios', list);
    }
    return list[index];
  },

  // ==================== ÓRDENES ====================
  async createOrden(orderData) {
    const numeroOrden = `AL-${Date.now().toString().slice(-6)}`;
    const orden = {
      uid: crypto.randomUUID ? crypto.randomUUID() : `ord-${Date.now()}`,
      numero_orden: numeroOrden,
      uid_cliente: orderData.uid_cliente || null,
      total: orderData.total,
      estado: 'confirmada',
      detalles: orderData.items,
      direccion_envio: orderData.direccion_envio,
      celular_contacto: orderData.celular_contacto,
      created_at: new Date().toISOString(),
    };

    await fetchPostgREST('ordenes', {
      method: 'POST',
      body: JSON.stringify(orden),
    });

    const list = getStorage('ordenes', []);
    list.unshift(orden);
    setStorage('ordenes', list);

    return orden;
  },
};
