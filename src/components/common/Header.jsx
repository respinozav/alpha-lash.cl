import React, { useState } from 'react';
import { ShoppingBag, Search, Shield, User, LogOut, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Header({
  searchTerm,
  setSearchTerm,
  onOpenAdminLogin,
  currentView,
  setCurrentView,
}) {
  const { itemCount, setIsCartOpen } = useCart();
  const { clientUser, logoutClient, adminUser, logoutAdmin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-dark-700/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* LOGO OFICIAL ALPHA LASH BY JOCCE */}
          <div
            onClick={() => setCurrentView('store')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-11 h-11 rounded-md3 bg-gradient-to-br from-gold-300 via-gold-500 to-amber-700 p-0.5 shadow-md group-hover:shadow-gold-glow transition-all">
              <div className="w-full h-full bg-dark-900 rounded-[14px] flex items-center justify-center">
                <span className="font-display font-black text-xl text-gold-400 group-hover:scale-110 transition-transform">
                  α
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg sm:text-xl tracking-wider text-gold-gradient">
                ALPHA LASH
              </span>
              <span className="text-[10px] tracking-[0.25em] text-gray-400 font-medium -mt-1">
                BY JOCCE
              </span>
            </div>
          </div>

          {/* BARRA DE BÚSQUEDA EN TIEMPO REAL */}
          {currentView === 'store' && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar extensiones, pegamentos, pinzas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-md3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/40 transition-all"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ACCIONES Y BOTONES */}
          <div className="flex items-center gap-3">
            
            {/* SWITCH TIENDA / PANEL ADMIN */}
            {adminUser ? (
              <button
                onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md3 text-xs font-semibold border transition-all ${
                  currentView === 'admin'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-dark-800 border-dark-700 text-gray-300 hover:border-gold-500/40'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-gold-400" />
                <span>{currentView === 'admin' ? 'Ir a Tienda' : 'Panel Admin'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                title="Acceso Administrador"
                className="p-2 text-gray-400 hover:text-gold-400 hover:bg-dark-800 rounded-md3 transition-colors text-xs"
              >
                <Shield className="w-4 h-4" />
              </button>
            )}

            {/* USUARIO CLIENTE (GOOGLE OAUTH) */}
            <div className="relative">
              {clientUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-dark-800 border border-gold-500/30 rounded-md3 text-xs text-gray-200 hover:border-gold-500 transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 font-bold flex items-center justify-center text-[10px]">
                      {clientUser.nombre ? clientUser.nombre.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                      {clientUser.nombre.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown del cliente */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-dark-850 border border-dark-700 rounded-md3 shadow-md3-floating py-2 z-50 animate-scale-up">
                      <div className="px-4 py-2 border-b border-dark-700">
                        <p className="text-xs font-semibold text-gold-300 truncate">
                          {clientUser.nombre}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {clientUser.correo}
                        </p>
                        {clientUser.direccion && (
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">
                            📍 {clientUser.direccion}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          logoutClient();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-dark-800 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 hover:text-gold-300 font-medium rounded-md3 hover:bg-dark-800 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Ingresar</span>
                </button>
              )}
            </div>

            {/* BOTÓN CARRITO DE COMPRAS */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir Carrito"
              className="relative flex items-center justify-center p-2.5 bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-gold-500/50 rounded-md3 transition-all group"
            >
              <ShoppingBag className="w-5 h-5 text-gray-200 group-hover:text-gold-400 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1 bg-gold-gradient text-black font-extrabold text-[11px] rounded-full shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* BARRA DE BÚSQUEDA MÓVIL */}
        {currentView === 'store' && (
          <div className="pb-3 md:hidden">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar extensiones, pegamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-md3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500/60"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
