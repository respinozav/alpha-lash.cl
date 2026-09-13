import React, { useState, useEffect } from 'react';
import {
  Package,
  Layers,
  Users,
  Shield,
  BarChart3,
  ArrowLeft,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import ProductosCRUD from './ProductosCRUD';
import CategoriasCRUD from './CategoriasCRUD';
import ClientesList from './ClientesList';
import UsuariosCRUD from './UsuariosCRUD';
import { formatCLP } from '../../services/formatters';

export default function AdminLayout({ onBackToStore }) {
  const { adminUser, logoutAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('productos');

  // Datos globales para el panel
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [p, c, cl, u] = await Promise.all([
        api.getProductos(false),
        api.getCategorias(false),
        api.getClientes(),
        api.getUsuarios(),
      ]);
      setProducts(p || []);
      setCategories(c || []);
      setClients(cl || []);
      setUsers(u || []);
    } catch (err) {
      console.error('Error cargando datos del panel admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalStockUnits = products.reduce((acc, p) => acc + (Number(p.cantidad) || 0), 0);
  const totalInventoryValue = products.reduce(
    (acc, p) => acc + (Number(p.precio) || 0) * (Number(p.cantidad) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col">
      {/* BARRA SUPERIOR DEL PANEL ADMIN */}
      <header className="bg-dark-900 border-b border-dark-700/80 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-gold-300 px-3 py-1.5 bg-dark-800 border border-dark-700 rounded-md3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la Tienda</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-dark-700 pl-3">
            <span className="font-display font-bold text-sm text-gold-gradient">
              PANEL ADMINISTRATIVO
            </span>
            <span className="text-[10px] bg-gold-500/10 border border-gold-500/30 text-gold-400 px-2 py-0.5 rounded font-mono">
              PostgREST :8005
            </span>
          </div>
        </div>

        {/* Datos del usuario admin */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">{adminUser?.nombre_usuario}</p>
            <p className="text-[10px] text-gold-400 font-mono uppercase">{adminUser?.rol}</p>
          </div>
          <button
            onClick={logoutAdmin}
            title="Cerrar Sesión de Administrador"
            className="p-2 text-rose-400 hover:text-rose-300 bg-rose-950/30 border border-rose-900/50 hover:bg-rose-950 rounded-md3 transition-colors text-xs flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* TARJETAS DE MÉTRICAS RÁPIDAS (MD3 CARDS) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-dark-900 border border-dark-700 rounded-md3-lg shadow-md3-card">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Productos Activos
            </p>
            <p className="font-display font-bold text-2xl text-white mt-1">
              {products.filter((p) => p.activo).length}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              Total catálogo: {products.length}
            </p>
          </div>

          <div className="p-4 bg-dark-900 border border-dark-700 rounded-md3-lg shadow-md3-card">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Stock Total (Unidades)
            </p>
            <p className="font-display font-bold text-2xl text-gold-300 mt-1">
              {totalStockUnits} un.
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              Valor inventario: {formatCLP(totalInventoryValue)}
            </p>
          </div>

          <div className="p-4 bg-dark-900 border border-dark-700 rounded-md3-lg shadow-md3-card">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Clientes Google OAuth
            </p>
            <p className="font-display font-bold text-2xl text-emerald-400 mt-1">
              {clients.length}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              {clients.filter((c) => c.activo).length} cuentas activas
            </p>
          </div>

          <div className="p-4 bg-dark-900 border border-dark-700 rounded-md3-lg shadow-md3-card">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Categorías
            </p>
            <p className="font-display font-bold text-2xl text-amber-400 mt-1">
              {categories.length}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              {categories.filter((c) => c.activo).length} visibles en tienda
            </p>
          </div>
        </div>

        {/* NAVEGACIÓN POR PESTAÑAS */}
        <div className="border-b border-dark-700">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('productos')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'productos'
                  ? 'border-gold-500 text-gold-300'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Productos & Insumos</span>
            </button>

            <button
              onClick={() => setActiveTab('categorias')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'categorias'
                  ? 'border-gold-500 text-gold-300'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categorías</span>
            </button>

            <button
              onClick={() => setActiveTab('clientes')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'clientes'
                  ? 'border-gold-500 text-gold-300'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clientes (Google OAuth)</span>
            </button>

            <button
              onClick={() => setActiveTab('usuarios')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'usuarios'
                  ? 'border-gold-500 text-gold-300'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Equipo & Usuarios</span>
            </button>
          </nav>
        </div>

        {/* CONTENIDO DE LA PESTAÑA ACTIVA */}
        <div className="pt-2">
          {activeTab === 'productos' && (
            <ProductosCRUD
              products={products}
              categories={categories}
              onRefresh={fetchData}
              api={api}
            />
          )}

          {activeTab === 'categorias' && (
            <CategoriasCRUD
              categories={categories}
              onRefresh={fetchData}
              api={api}
            />
          )}

          {activeTab === 'clientes' && (
            <ClientesList
              clients={clients}
              onRefresh={fetchData}
              api={api}
            />
          )}

          {activeTab === 'usuarios' && (
            <UsuariosCRUD
              users={users}
              onRefresh={fetchData}
              api={api}
            />
          )}
        </div>

      </div>
    </div>
  );
}
