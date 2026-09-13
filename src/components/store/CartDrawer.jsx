import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldAlert } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCLP } from '../../services/formatters';

export default function CartDrawer({ onProceedToCheckout }) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    itemCount,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Fondo oscuro con desenfoque */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-dark-900 border-l border-dark-700 shadow-2xl flex flex-col">
          
          {/* ENCABEZADO DEL CARRITO */}
          <div className="p-6 border-b border-dark-700 flex items-center justify-between bg-dark-850">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gold-500/10 rounded-md3 text-gold-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-white">
                  Carrito de Compras
                </h2>
                <p className="text-xs text-gray-400">
                  {itemCount} {itemCount === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-white rounded-md3 hover:bg-dark-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* LISTADO DE ITEMS */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              cart.map(({ product, quantity }) => (
                <div
                  key={product.uid}
                  className="flex items-center gap-3 p-3 bg-dark-850 border border-dark-700 rounded-md3"
                >
                  {/* Imagen */}
                  <div className="w-16 h-16 bg-dark-900 rounded-md3 overflow-hidden flex-shrink-0 flex items-center justify-center border border-dark-700">
                    {product.imagen_base64 ? (
                      <img
                        src={product.imagen_base64}
                        alt={product.nombre_producto}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-[10px] font-mono text-gold-400">LASH</span>
                    )}
                  </div>

                  {/* Datos del producto */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-200 truncate">
                      {product.nombre_producto}
                    </p>
                    <p className="text-[10px] font-mono text-gold-400">
                      {product.sku}
                    </p>
                    <p className="text-xs font-bold text-gray-300 mt-1">
                      {formatCLP(product.precio)}
                    </p>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(product.uid)}
                      className="text-gray-500 hover:text-rose-400 p-1 transition-colors"
                      title="Eliminar del carrito"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-dark-700 rounded-md3 bg-dark-900">
                      <button
                        onClick={() => updateQuantity(product.uid, quantity - 1)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-gray-200">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.uid, quantity + 1)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto stroke-1" />
                <p className="text-sm font-semibold text-gray-300">
                  Tu carrito está vacío
                </p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explora nuestro catálogo y agrega las mejores extensiones y pegamentos de Santiago.
                </p>
              </div>
            )}
          </div>

          {/* RESUMEN Y BOTÓN FINALIZAR COMPRA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-dark-700 bg-dark-850 space-y-4">
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-200 font-semibold">{formatCLP(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío (San Bernardo & Regiones)</span>
                  <span className="text-gold-400 font-medium">Por coordinar</span>
                </div>
                <div className="pt-2 border-t border-dark-700 flex justify-between text-base font-bold text-white">
                  <span>Total</span>
                  <span className="text-gold-300">{formatCLP(cartTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-gold-gradient text-black font-extrabold text-sm rounded-md3 shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-gray-500 text-center">
                🔒 Autenticación protegida con Google OAuth 2.0
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
