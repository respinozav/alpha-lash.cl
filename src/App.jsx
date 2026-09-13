import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import CategoryPills from './components/store/CategoryPills';
import ProductGrid from './components/store/ProductGrid';
import CartDrawer from './components/store/CartDrawer';
import CheckoutModal from './components/store/CheckoutModal';
import AdminLoginModal from './components/auth/AdminLoginModal';
import AdminLayout from './components/admin/AdminLayout';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';

export default function App() {
  const { adminUser } = useAuth();
  const [currentView, setCurrentView] = useState('store'); // 'store' o 'admin'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modales
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Datos públicos de la tienda
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStoreData = async () => {
    try {
      const [prodList, catList] = await Promise.all([
        api.getProductos(true),
        api.getCategorias(true),
      ]);
      setProducts(prodList || []);
      setCategories(catList || []);
    } catch (err) {
      console.error('Error cargando catálogo de Alpha Lash:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoreData();
  }, [currentView]);

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col selection:bg-gold-500 selection:text-black">
      {/* VISTA 1: PANEL ADMINISTRATIVO */}
      {currentView === 'admin' && adminUser ? (
        <AdminLayout onBackToStore={() => setCurrentView('store')} />
      ) : (
        /* VISTA 2: TIENDA PÚBLICA / E-COMMERCE */
        <>
          <Header
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />

          <main className="flex-1">
            {/* Barra de Filtro de Categorías */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <CategoryPills
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Grid de Productos */}
            <ProductGrid
              products={products}
              categories={categories}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onResetFilters={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            />
          </main>

          {/* Pie de Página */}
          <Footer />

          {/* Carrito Desplegable */}
          <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

          {/* Modal de Finalización de Compra (Google Auth + Despacho) */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />

          {/* Modal de Acceso de Administrador */}
          <AdminLoginModal
            isOpen={isAdminLoginOpen}
            onClose={() => setIsAdminLoginOpen(false)}
            onSuccess={() => {
              setIsAdminLoginOpen(false);
              setCurrentView('admin');
            }}
          />

          {/* Botón Flotante de WhatsApp */}
          <WhatsAppButton />
        </>
      )}
    </div>
  );
}
