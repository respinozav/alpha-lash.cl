import React, { useState } from 'react';
import { UserPlus, Shield, Key, Mail, UserCheck, UserX } from 'lucide-react';
import Modal from '../common/Modal';

export default function UsuariosCRUD({ users, onRefresh, api }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    rol: 'editor',
    correo: '',
    clave: '',
    activo: true,
  });
  const [loading, setLoading] = useState(false);

  const handleOpenCreate = () => {
    setFormData({
      nombre_usuario: '',
      rol: 'editor',
      correo: '',
      clave: '',
      activo: true,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (user) => {
    await api.updateUsuario(user.uid, { activo: !user.activo });
    onRefresh();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createUsuario(formData);
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      alert('Error al procesar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">
            Equipo & Usuarios Administrativos
          </h2>
          <p className="text-xs text-gray-400">
            Control de acceso al panel de gestión y roles del personal.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gold-gradient text-black font-bold text-xs rounded-md3 shadow-md hover:scale-105 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Agregar Usuario</span>
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-dark-850 border border-dark-700 rounded-md3-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-900 border-b border-dark-700 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Nombre de Usuario</th>
                <th className="px-6 py-3.5">Correo</th>
                <th className="px-6 py-3.5">Rol</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750">
              {users.map((usr) => (
                <tr key={usr.uid} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-gold-400">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <span>{usr.nombre_usuario}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      <span>{usr.correo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-gold-500/10 border border-gold-500/30 text-gold-300">
                      {usr.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(usr)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 transition-all ${
                        usr.activo
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                          : 'bg-zinc-800 border border-zinc-700 text-gray-400'
                      }`}
                    >
                      {usr.activo ? <UserCheck className="w-3 h-3 text-emerald-400" /> : <UserX className="w-3 h-3 text-gray-500" />}
                      <span>{usr.activo ? 'Habilitado' : 'Bloqueado'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear Usuario */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Usuario de Administración">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Nombre Completo *</label>
            <input
              type="text"
              required
              value={formData.nombre_usuario}
              onChange={(e) => setFormData({ ...formData, nombre_usuario: e.target.value })}
              placeholder="ej. Jocce Administradora"
              className="w-full px-3.5 py-2 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Correo Electrónico *</label>
            <input
              type="email"
              required
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              placeholder="ej. contacto@alpha-lash.cl"
              className="w-full px-3.5 py-2 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Rol *</label>
            <select
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              className="w-full px-3.5 py-2 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white focus:outline-none focus:border-gold-500"
            >
              <option value="admin">Administrador (Acceso Total)</option>
              <option value="editor">Editor (Solo Catálogo e Inventario)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Contraseña *</label>
            <input
              type="password"
              required
              value={formData.clave}
              onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
              placeholder="Mínimo 8 caracteres"
              className="w-full px-3.5 py-2 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-dark-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-dark-750 hover:bg-dark-700 text-gray-300 rounded-md3 text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gold-gradient text-black font-bold rounded-md3 text-xs shadow-md"
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
