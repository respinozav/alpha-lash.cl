import React, { useState } from 'react';
import { Users, Search, Phone, MapPin, Mail, ShieldAlert, CheckCircle } from 'lucide-react';
import { formatDate } from '../../services/formatters';

export default function ClientesList({ clients, onRefresh, api }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleActive = async (client) => {
    try {
      await api.updateCliente(client.uid, { activo: !client.activo });
      onRefresh();
    } catch (err) {
      console.error('Error al actualizar estado del cliente:', err);
      alert('Error al actualizar cliente');
    }
  };

  const filtered = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.nombre?.toLowerCase().includes(term) ||
      c.correo?.toLowerCase().includes(term) ||
      c.celular?.toLowerCase().includes(term) ||
      c.direccion?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">
            Clientes Registrados (Google OAuth 2.0)
          </h2>
          <p className="text-xs text-gray-400">
            Base de clientas registradas en alpha-lash.cl con sus datos de contacto y despacho en San Bernardo.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Buscar por nombre, correo o celular..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-dark-850 border border-dark-700 rounded-md3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-dark-850 border border-dark-700 rounded-md3-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-900 border-b border-dark-700 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Cliente</th>
                <th className="px-6 py-3.5">Contacto</th>
                <th className="px-6 py-3.5">Dirección de Despacho</th>
                <th className="px-6 py-3.5">Fecha Registro</th>
                <th className="px-6 py-3.5 text-center">Estado (Activo / Desactivado)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750">
              {filtered.map((client) => (
                <tr key={client.uid} className="hover:bg-dark-800/50 transition-colors">
                  {/* Nombre + Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {client.nombre?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{client.nombre}</p>
                        <p className="text-[10px] font-mono text-gray-500">
                          ID: {client.google_id || 'Google Auth'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Correo y Teléfono */}
                  <td className="px-6 py-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Mail className="w-3 h-3 text-gold-400" />
                      <span>{client.correo}</span>
                    </div>
                    {client.celular && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{client.celular}</span>
                      </div>
                    )}
                  </td>

                  {/* Dirección San Bernardo */}
                  <td className="px-6 py-4 text-gray-300 max-w-xs">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3 h-3 text-gold-400 flex-shrink-0 mt-0.5" />
                      <span className="truncate">{client.direccion || 'Sin dirección registrada'}</span>
                    </div>
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4 text-gray-400 text-[11px]">
                    {formatDate(client.created_at)}
                  </td>

                  {/* Switch de activación */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(client)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 transition-all ${
                        client.activo
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                          : 'bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900'
                      }`}
                    >
                      {client.activo ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>Activo</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                          <span>Desactivado</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
