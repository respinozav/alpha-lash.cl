import React from 'react';

export default function CategoryPills({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
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
  );
}
