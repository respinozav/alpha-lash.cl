import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { Shield, KeyRound, Mail, AlertCircle } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const { loginAdmin } = useAuth();
  const [correo, setCorreo] = useState('admin@alpha-lash.cl');
  const [clave, setClave] = useState('Admin2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginAdmin(correo, clave);
      if (res.success) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError(res.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Acceso al Panel de Administración" maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center pb-2">
          <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400 mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <p className="text-xs text-gray-400">
            Ingreso exclusivo para administradores y personal de <strong>Alpha Lash By Jocce</strong>.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-md3 flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-gold-400" />
            <span>Correo Corporativo</span>
          </label>
          <input
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="admin@alpha-lash.cl"
            className="w-full px-3.5 py-2.5 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-gold-400" />
            <span>Contraseña</span>
          </label>
          <input
            type="password"
            required
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gold-gradient text-black font-extrabold text-xs rounded-md3 shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
        >
          {loading ? 'Validando credenciales...' : 'Ingresar al Panel'}
        </button>

        <div className="p-2.5 bg-dark-900/80 rounded-md3 border border-dark-700 text-[11px] text-gray-400 text-center">
          <p className="text-gray-300 font-medium">Credenciales iniciales demo:</p>
          <p className="font-mono text-gold-400 text-[10px] mt-0.5">
            admin@alpha-lash.cl / Admin2026!
          </p>
        </div>
      </form>
    </Modal>
  );
}
