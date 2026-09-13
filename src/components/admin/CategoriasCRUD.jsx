import React, { useState } from 'react';
import { Plus, Edit2, Check, X, Tag } from 'lucide-react';
import Modal from '../common/Modal';

export default function CategoriasCRUD({ categories, onRefresh, api }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    nombre_categoria: '',
    descripcion: '',
    activo: true,
  });
  const [loading, setLoading] = useState(false);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ nombre_categoria: '', descripcion: '', activo: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      nombre_categoria: cat.nombre_categoria,
      descripcion: cat.descripcion || '',
      activo: cat.activo,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (cat) => {
    await api.updateCategoria(cat.uid, { activo: !cat.activo });
    onRefresh();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        await api.updateCategoria(editingCategory.uid, formData);
      } else {
        await api.createCategoria(formData);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      console.error('Error al guardar categoría:', err);
      alert('Error al procesar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Acción Crear */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">
            Gestión de Categorías
          </h2>
          <p className="text-xs text-gray-400">
            Organiza los insumos y extensiones para el catálogo de clientes.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gold-gradient text-black font-bold text-xs rounded-md3 shadow-md hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Tabla de Categorías */}
      <div className="bg-dark-850 border border-dark-700 rounded-md3-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-900 border-b border-dark-700 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Nombre de Categoría</th>
                <th className="px-6 py-3.5">Descripción</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750">
              {categories.map((cat) => (
                <tr key={cat.uid} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-gold-400" />
                      <span>{cat.nombre_categoria}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 max-w-xs truncate">
                    {cat.descripcion || 'Sin descripción'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        cat.activo
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-400 hover:bg-emerald-900'
                          : 'bg-zinc-800 border border-zinc-700 text-gray-400 hover:bg-zinc-700'
                      }`}
                    >
                      {cat.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-gray-400 hover:text-gold-300 rounded hover:bg-dark-700 transition-colors"
                      title="Editar Categoría"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar Categoría */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              required
              value={formData.nombre_categoria}
              onChange={(e) =>
                setFormData({ ...formData, nombre_categoria: e.target.value })
              }
              placeholder="ej. Pestañas Tecnológicas W"
              className="w-full px-3.5 py-2 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">
              Descripción
            </label>
            <textarea
              rows={3}
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              placeholder="Breve detalle de los insumos pertenecientes a este grupo..."
              className="w-full px-3.5 py-2 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="catActivo"
              checked={formData.activo}
              onChange={(e) =>
                setFormData({ ...formData, activo: e.target.checked })
              }
              className="w-4 h-4 accent-gold-500 rounded bg-dark-900 border-dark-700"
            />
            <label htmlFor="catActivo" className="text-xs text-gray-300 font-medium">
              Categoría Activa (Visible en la tienda)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-dark-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-dark-750 hover:bg-dark-700 text-gray-300 rounded-md3 text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gold-gradient text-black font-bold rounded-md3 text-xs shadow-md"
            >
              {loading ? 'Guardando...' : editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
