import React, { useState } from 'react';
import { ShoppingBag, Check, Eye } from 'lucide-react';
import { formatCLP } from '../../services/formatters';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, categoryName }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.cantidad <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group relative flex flex-col bg-dark-850 border border-dark-700 hover:border-gold-500/50 rounded-md3-lg overflow-hidden shadow-md3-card hover:shadow-gold-glow transition-all duration-300">
      
      {/* CONTENEDOR DE IMAGEN */}
      <div className="relative w-full aspect-square bg-dark-900 overflow-hidden flex items-center justify-center p-3">
        {product.imagen_base64 ? (
          <img
            src={product.imagen_base64}
            alt={product.nombre_producto}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          /* Placeholder estilizado con temática de pestañas */
          <div className="w-full h-full flex flex-col items-center justify-center text-dark-600 bg-gradient-to-b from-dark-900 to-dark-850 rounded-md3 p-4">
            <svg
              className="w-16 h-16 text-gold-500/30 group-hover:text-gold-500/50 transition-colors"
              viewBox="0 0 100 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {/* Ojo y pestañas estilizadas */}
              <path d="M10 30 Q50 5 90 30 Q50 55 10 30 Z" opacity="0.3" />
              <path d="M20 20 L15 10" strokeLinecap="round" />
              <path d="M35 15 L32 4" strokeLinecap="round" />
              <path d="M50 13 L50 2" strokeLinecap="round" />
              <path d="M65 15 L68 4" strokeLinecap="round" />
              <path d="M80 20 L85 10" strokeLinecap="round" />
              <circle cx="50" cy="30" r="10" fill="currentColor" opacity="0.2" />
            </svg>
            <span className="text-[11px] text-gray-500 mt-2 font-medium tracking-wider">
              Alpha Lash
            </span>
          </div>
        )}

        {/* BADGE DE SKU */}
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-dark-950/80 backdrop-blur-sm border border-dark-700 text-[10px] font-mono text-gold-400 font-semibold rounded">
          {product.sku}
        </span>

        {/* BADGE DE DISPONIBILIDAD */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] font-bold rounded">
              Agotado
            </span>
          ) : product.cantidad <= 5 ? (
            <span className="px-2 py-0.5 bg-amber-950/80 border border-amber-800 text-amber-300 text-[10px] font-bold rounded">
              Últimas {product.cantidad} un.
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[10px] font-medium rounded">
              En Stock
            </span>
          )}
        </div>
      </div>

      {/* DETALLES DEL PRODUCTO */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {categoryName && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-400/80">
              {categoryName}
            </p>
          )}
          <h3 className="font-display font-semibold text-sm text-gray-100 line-clamp-2 mt-0.5 group-hover:text-gold-300 transition-colors">
            {product.nombre_producto}
          </h3>
          {product.descripcion && (
            <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
              {product.descripcion}
            </p>
          )}
        </div>

        {/* PRECIO Y BOTÓN AGREGAR */}
        <div className="pt-2 border-t border-dark-700/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
              Precio CLP
            </span>
            <span className="font-display font-bold text-base sm:text-lg text-white">
              {formatCLP(product.precio)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md3 text-xs font-bold transition-all ${
              isOutOfStock
                ? 'bg-dark-700 text-gray-500 cursor-not-allowed'
                : added
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-gold-gradient text-black hover:shadow-gold-glow hover:scale-105 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Listo</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
