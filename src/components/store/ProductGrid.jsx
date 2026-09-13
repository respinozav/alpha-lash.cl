import React from 'react';
import ProductCard from './ProductCard';
import { Sparkles, PackageOpen } from 'lucide-react';

export default function ProductGrid({
  products,
  categories,
  searchTerm,
  selectedCategory,
  onResetFilters,
}) {
  // Mapa para resolver el nombre de la categoría por su UID
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.uid] = cat.nombre_categoria;
    return acc;
  }, {});

  // Filtrado reactivo por categoría y término de búsqueda
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.uid_categoria === selectedCategory;

    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      product.nombre_producto.toLowerCase().includes(term) ||
      (product.sku && product.sku.toLowerCase().includes(term)) ||
      (product.descripcion && product.descripcion.toLowerCase().includes(term));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="catalogo" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Encabezado del Catálogo */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-dark-700/60 gap-4">
        <div>
          <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Colección Profesional</span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Catálogo de Insumos y Pestañas
          </h2>
        </div>
        <p className="text-xs text-gray-400">
          Mostrando <span className="text-gold-300 font-semibold">{filteredProducts.length}</span> productos disponibles
        </p>
      </div>

      {/* Grid de Productos o Estado Vacío */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.uid}
              product={product}
              categoryName={categoryMap[product.uid_categoria]}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-dark-850/50 border border-dashed border-dark-700 rounded-md3-lg max-w-lg mx-auto p-8 space-y-4">
          <div className="w-14 h-14 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center mx-auto text-gray-400">
            <PackageOpen className="w-7 h-7" />
          </div>
          <h3 className="font-display font-semibold text-base text-gray-200">
            No se encontraron productos
          </h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            No hay insumos que coincidan con los filtros seleccionados actualmente.
          </p>
          <button
            onClick={onResetFilters}
            className="px-5 py-2 bg-dark-700 hover:bg-dark-600 text-gold-300 rounded-md3 text-xs font-semibold transition-colors"
          >
            Ver todos los productos
          </button>
        </div>
      )}
    </section>
  );
}
