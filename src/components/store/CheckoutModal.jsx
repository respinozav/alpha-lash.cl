import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatCLP } from '../../services/formatters';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, MapPin, Phone, User, ShoppingBag } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose }) {
  const { clientUser, loginGoogle, updateClientData } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();

  // Estados del formulario de datos
  const [celular, setCelular] = useState(clientUser?.celular || '');
  const [direccion, setDireccion] = useState(
    clientUser?.direccion || 'Avenida América, San Bernardo, Santiago'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Simulación de Google OAuth (cuando no hay Client ID real o para pruebas locales)
  const handleSimulatedGoogleLogin = async () => {
    const demoGoogleProfile = {
      google_id: `google_${Date.now()}`,
      nombre: 'Cliente Google Alpha',
      correo: 'cliente.google@alpha-lash.cl',
      celular: '+56 9 5115 6429',
      direccion: 'San Bernardo Centro, Santiago',
    };
    await loginGoogle(demoGoogleProfile);
    setCelular(demoGoogleProfile.celular);
    setDireccion(demoGoogleProfile.direccion);
  };

  // Confirmar y simular orden de compra
  const handleFinalizarPedido = async (e) => {
    e.preventDefault();
    if (!celular || !direccion) {
      alert('Por favor completa tu número de celular y dirección de despacho.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Actualizar datos del cliente en PostgreSQL / Local
      await updateClientData({ celular, direccion });

      // Crear orden
      const orderPayload = {
        uid_cliente: clientUser?.uid || null,
        total: cartTotal,
        direccion_envio: direccion,
        celular_contacto: celular,
        items: cart.map((item) => ({
          sku: item.product.sku,
          nombre: item.product.nombre_producto,
          precio: item.product.precio,
          cantidad: item.quantity,
          subtotal: item.product.precio * item.quantity,
        })),
      };

      const orden = await api.createOrden(orderPayload);
      setCompletedOrder(orden);

      // Lanzar confeti celebratorio
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E5C158', '#FFFFFF'],
      });

      clearCart();
    } catch (err) {
      console.error('Error al procesar orden:', err);
      alert('Hubo un error al procesar tu pedido. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enlace directo de confirmación por WhatsApp
  const generateWhatsAppOrderLink = () => {
    if (!completedOrder) return '#';
    const itemsText = completedOrder.detalles
      .map((i) => `• ${i.cantidad}x ${i.nombre} (${formatCLP(i.subtotal)})`)
      .join('\n');

    const msg = encodeURIComponent(
      `¡Hola Alpha Lash By Jocce! He realizado el pedido #${completedOrder.numero_orden}\n\n` +
      `Cliente: ${clientUser?.nombre || 'Cliente'}\n` +
      `Celular: ${completedOrder.celular_contacto}\n` +
      `Dirección: ${completedOrder.direccion_envio}\n\n` +
      `Detalle:\n${itemsText}\n\n` +
      `Total: ${formatCLP(completedOrder.total)}\n\n` +
      `¿Cómo procedemos con el pago y despacho en San Bernardo?`
    );

    return `https://wa.me/56951156429?text=${msg}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setCompletedOrder(null);
        onClose();
      }}
      title={
        completedOrder
          ? '¡Orden Confirmada con Éxito!'
          : !clientUser
          ? 'Identifícate con Google para Continuar'
          : 'Datos de Despacho y Contacto'
      }
      maxWidth="max-w-lg"
    >
      {/* 1. CASO ORDEN CONFIRMADA */}
      {completedOrder ? (
        <div className="text-center py-4 space-y-5">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono text-gold-400 font-bold uppercase tracking-wider">
              Nº de Pedido: {completedOrder.numero_orden}
            </span>
            <h4 className="font-display font-bold text-xl text-white mt-1">
              ¡Gracias por tu compra, {clientUser?.nombre}!
            </h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 leading-relaxed">
              Tu orden ha sido registrada en el sistema. Puedes coordinar tu despacho en San Bernardo o pago mediante WhatsApp inmediato.
            </p>
          </div>

          <div className="p-4 bg-dark-900 border border-dark-700 rounded-md3 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total a pagar:</span>
              <span className="font-bold text-gold-300">{formatCLP(completedOrder.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Entrega en:</span>
              <span className="text-gray-200 truncate max-w-[220px]">{completedOrder.direccion_envio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Teléfono:</span>
              <span className="text-gray-200">{completedOrder.celular_contacto}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href={generateWhatsAppOrderLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-xs rounded-md3 shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirmar Pedido por WhatsApp (+56 9 5115 6429)</span>
            </a>

            <button
              onClick={() => {
                setCompletedOrder(null);
                onClose();
              }}
              className="w-full py-2.5 bg-dark-800 hover:bg-dark-700 text-gray-300 rounded-md3 text-xs font-semibold transition-colors"
            >
              Volver a la Tienda
            </button>
          </div>
        </div>
      ) : !clientUser ? (
        /* 2. CASO USUARIO NO AUTENTICADO (GOOGLE OAUTH) */
        <div className="text-center py-4 space-y-5">
          <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto text-gold-400">
            <User className="w-6 h-6" />
          </div>

          <div>
            <h4 className="font-display font-semibold text-base text-white">
              Inicio de Sesión Exclusivo con Google
            </h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
              Para garantizar compras seguras en <strong>alpha-lash.cl</strong>, identifícate con tu cuenta de Google.
            </p>
          </div>

          {/* Botón de Google OAuth */}
          <div className="space-y-3 max-w-xs mx-auto">
            <button
              onClick={handleSimulatedGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold text-xs rounded-md3 shadow-md transition-all active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>
            <p className="text-[10px] text-gray-500">
              Configurado para el dominio oficial https://alpha-lash.cl
            </p>
          </div>
        </div>
      ) : (
        /* 3. CASO VALIDACIÓN / EDICIÓN DE DATOS DE ENVÍO (CELULAR Y DIRECCIÓN) */
        <form onSubmit={handleFinalizarPedido} className="space-y-4">
          <div className="p-3 bg-dark-900 border border-dark-700 rounded-md3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 font-bold flex items-center justify-center text-xs">
              {clientUser.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{clientUser.nombre}</p>
              <p className="text-[11px] text-gray-400 truncate">{clientUser.correo}</p>
            </div>
          </div>

          {/* Campo Celular */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>Número Celular / WhatsApp (Chile)</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+56 9 1234 5678"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Campo Dirección (San Bernardo / RM) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              <span>Dirección de Despacho (San Bernardo / RM)</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="Calle, número, depto o villa (ej. Av. América 450, San Bernardo)"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-dark-900 border border-dark-700 rounded-md3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Resumen Total */}
          <div className="p-3 bg-dark-900/60 border border-dark-700 rounded-md3 flex items-center justify-between text-xs">
            <span className="text-gray-400">Total a pagar:</span>
            <span className="text-base font-bold text-gold-300">{formatCLP(cartTotal)}</span>
          </div>

          {/* Botón de Confirmación */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gold-gradient text-black font-extrabold text-xs rounded-md3 shadow-gold-glow hover:shadow-gold-glow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Procesando pedido...</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Confirmar Orden de Compra</span>
              </>
            )}
          </button>
        </form>
      )}
    </Modal>
  );
}
