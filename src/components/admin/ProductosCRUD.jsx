import React, { useState } from 'react';
import { Plus, Edit2, Upload, Image as ImageIcon, Sparkles, Check, X, Search } from 'lucide-react';
import Modal from '../common/Modal';
import { formatCLP } from '../../services/formatters';
import { compressImageToJpegBase64, getBase64SizeInKB } from '../../services/imageCompressor';

export default function ProductosCRUD({ products, categories, onRefresh, api }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const [formData, setFormData] = useState({
    uid_categoria: '',
    nombre_producto: '',
    descripcion: '',
    precio: '',
    cantidad: 10,
    imagen_base64: '',
    activo: true,
  });

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.uid] = cat.nombre_categoria;
    return acc;
  }, {});

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      uid_categoria: categories[0]?.uid || '',
      nombre_producto: '',
      descripcion: '',
      precio: '',
      cantidad: 15,
      imagen_base64: '',
      activo: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      uid_categoria: prod.uid_categoria,
      nombre_producto: prod.nombre_producto,
      descripcion: prod.descripcion || '',
      precio: prod.precio,
      cantidad: prod.cantidad,
      imagen_base64: prod.imagen_base64 || '',
      activo: prod.activo,
    });
    setIsModalOpen(true);
  };

  // Manejo de carga y compresión a JPG Base64
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      // Comprime a un máximo de 800px y formato JPG con calidad 78%
      const base64Jpg = await compressImageToJpegBase64(file, 800, 0.78);
      setFormData((prev) => ({ ...prev, imagen_base64: base64Jpg }));
    } catch (err) {
      alert('Error al optimizar imagen: ' + err.message);
    } finally {
      setCompressing(false);
    }
  };

  const handleToggleActive = async (prod) => {
    await api.updateProducto(prod.uid, { activo: !prod.activo });
    onRefresh();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProduct) {
        await api.updateProducto(editingProduct.uid, formData);
      } else {
        await api.createProducto(formData);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.nombre_producto.toLowerCase().includes(term) ||
      p.sku?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Encabezado y Barra de Búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">
            Gestión de Productos e Insumos
          </h2>
          <p className="text-xs text-gray-400">
            Administra catálogo, inventario, precios y compresión de imágenes JPG base64.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gold-gradient text-black font-bold text-xs rounded-md3 shadow-md hover:scale-105 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Buscador de inventario */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Buscar por SKU o nombre de producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-dark-850 border border-dark-700 rounded-md3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
        />
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
      </div>

      {/* Tabla de Productos */}
      <div className="bg-dark-850 border border-dark-700 rounded-md3-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-900 border-b border-dark-700 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Producto</th>
                <th className="px-5 py-3.5">SKU</th>
                <th className="px-5 py-3.5">Categoría</th>
                <th className="px-5 py-3.5">Precio CLP</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750">
              {filtered.map((prod) => (
                <tr key={prod.uid} className="hover:bg-dark-800/50 transition-colors">
                  {/* Foto + Nombre */}
                  <td className="px-5 py-3.5 font-medium text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md3 bg-dark-900 border border-dark-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {prod.imagen_base64 ? (
                          <img
                            src={prod.imagen_base64}
                            alt={prod.nombre_producto}
                            className="w-full h-full object-contain p-0.5"
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <span className="truncate max-w-[200px]">{prod.nombre_producto}</span>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-5 py-3.5 font-mono text-gold-400 font-semibold">
                    {prod.sku}
                  </td>

                  {/* Categoría */}
                  <td className="px-5 py-3.5 text-gray-400">
                    {categoryMap[prod.uid_categoria] || 'General'}
                  </td>

                  {/* Precio */}
                  <td className="px-5 py-3.5 font-bold text-gray-200">
                    {formatCLP(prod.precio)}
                  </td>

                  {/* Stock */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.cantidad <= 0
                          ? 'bg-rose-950 text-rose-300'
                          : prod.cantidad <= 5
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-emerald-950 text-emerald-300'
                      }`}
                    >
                      {prod.cantidad} un.
                    </span>
                  </td>

                  {/* Estado Activo */}
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggleActive(prod)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        prod.activo
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                          : 'bg-zinc-800 border border-zinc-700 text-gray-400'
                      }`}
                    >
                      {prod.activo ? 'Activo' : 'Pausado'}
                    </button>
                  </td>

                  {/* Acciones */}
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="p-1.5 text-gray-400 hover:text-gold-300 rounded hover:bg-dark-700 transition-colors"
                      title="Editar Producto"
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

      {/* Modal Crear / Editar Producto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Editar Producto (${editingProduct.sku})` : 'Nuevo Producto'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Categoría */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-300">
                Categoría *
              </label>
              <select
                required
                value={formData.uid_categoria}
                onChange={(e) => setFormData({ ...formData, uid_categoria: e.target.value })}
                className="w-full px-3.5 py-2 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white focus:outline-none focus:border-gold-500"
              >
                {categories.map((c) => (
                  <option key={c.uid} value={c.uid}>
                    {c.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-300">
                Nombre del Producto *
              </label>
              <input
                type="text"
                required
                value={formData.nombre_producto}
                onChange={(e) =>
                  setFormData({ ...formData, nombre_producto: e.target.value })
                }
                placeholder="ej. Adhesivo Alpha Ultra Bond 5ml"
                className="w-full px-3.5 py-2 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Precio en CLP */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">
                Precio (CLP) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="10"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                placeholder="14990"
                className="w-full px-3.5 py-2 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Cantidad (Stock) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">
                Stock Disponible *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                placeholder="20"
                className="w-full px-3.5 py-2 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-300">
                Descripción Técnica
              </label>
              <textarea
                rows={2}
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Características, curvaturas, tiempo de secado o recomendaciones..."
                className="w-full px-3.5 py-2 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* CARGADOR Y COMPRESOR DE IMAGEN A JPG BASE64 */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                <span>Fotografía del Producto (Conversión Automática a JPG Base64)</span>
                {formData.imagen_base64 && (
                  <span className="text-[10px] text-gold-400 font-mono">
                    Peso optimizado: {getBase64SizeInKB(formData.imagen_base64)} KB
                  </span>
                )}
              </label>

              <div className="flex items-center gap-3 p-3 bg-dark-900 border border-dark-700 rounded-md3">
                {/* Previsualización */}
                <div className="w-16 h-16 rounded-md3 bg-dark-950 border border-dark-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {formData.imagen_base64 ? (
                    <img
                      src={formData.imagen_base64}
                      alt="Preview"
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-600" />
                  )}
                </div>

                {/* Botón de carga */}
                <div className="flex-1">
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-600 rounded-md3 text-xs font-medium cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-gold-400" />
                    <span>{compressing ? 'Optimizando...' : 'Seleccionar Imagen'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={compressing}
                    />
                  </label>
                  <p className="text-[10px] text-gray-500 mt-1">
                    PNG, JPG o WebP. Se convertirá automáticamente a JPG ligero para almacenamiento en base de datos.
                  </p>
                </div>

                {formData.imagen_base64 && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imagen_base64: '' })}
                    className="text-gray-500 hover:text-rose-400 text-xs p-1"
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>

            {/* Activo switch */}
            <div className="flex items-center gap-2 pt-1 sm:col-span-2">
              <input
                type="checkbox"
                id="prodActivo"
                checked={formData.activo}
                onChange={(e) =>
                  setFormData({ ...formData, activo: e.target.checked })
                }
                className="w-4 h-4 accent-gold-500 rounded bg-dark-900 border-dark-700"
              />
              <label htmlFor="prodActivo" className="text-xs text-gray-300 font-medium">
                Producto Activo (Visible en tienda y catálogo)
              </label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4 border-t border-dark-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-dark-750 hover:bg-dark-700 text-gray-300 rounded-md3 text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || compressing}
              className="px-5 py-2 bg-gold-gradient text-black font-bold rounded-md3 text-xs shadow-md"
            >
              {loading ? 'Guardando...' : editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
