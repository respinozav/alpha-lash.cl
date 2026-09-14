import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function CategoryPills({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full">
      {/* VISTA CELULAR / MÓVIL: INPUT SELECT CON BORDE DORADO */}
      <div className="md:hidden w-full py-2">
        <label
          htmlFor="mobile-category-select"
          className="block text-[11px] font-bold text-gold-400 mb-1.5 uppercase tracking-wider"
        >
          Categoría de Insumos
        </label>
        <div className="relative">
          <select
            id="mobile-category-select"
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="w-full appearance-none bg-dark-800 text-gray-100 font-semibold text-sm rounded-md3 pl-4 pr-10 py-3 border-2 border-gold-500/80 focus:border-gold-400 focus:ring-2 focus:ring-gold-500/30 shadow-[0_2px_12px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
          >
            <option value="all" className="bg-dark-850 text-gray-100 py-2">
              Todas las Categorías
            </option>
            {categories.map((cat) => (
              <option
                key={cat.uid}
                value={cat.uid}
                className="bg-dark-850 text-gray-100 py-2"
              >
                {cat.nombre_categoria}
              </option>
            ))}
          </select>

          {/* Flecha indicadora dorada */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gold-400">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* VISTA PC / ESCRITORIO: BOTONES HORIZONTALES */}
      <div className="hidden md:block w-full overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center gap-2 min-w-max">
          {/* Opción Todas */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              selectedCategory === 'all'
                ? 'bg-gold-gradient text-black shadow-gold-glow'
                : 'bg-dark-800 text-gray-300 border border-dark-700 hover:border-gold-500/50 hover:text-white'
            }`}
          >
            Todas las Categorías
          </button>

          {/* Categorías dinámicas */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.uid;
            return (
              <button
                key={cat.uid}
                onClick={() => onSelectCategory(cat.uid)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  isSelected
                    ? 'bg-gold-gradient text-black shadow-gold-glow'
                    : 'bg-dark-800 text-gray-300 border border-dark-700 hover:border-gold-500/50 hover:text-white'
                }`}
              >
                {cat.nombre_categoria}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
