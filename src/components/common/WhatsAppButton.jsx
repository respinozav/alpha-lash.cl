import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '56951156429';
  const message = encodeURIComponent(
    '¡Hola Alpha Lash By Jocce! Me gustaría consultar sobre sus productos y extensiones de pestañas en San Bernardo.'
  );
  const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip flotante */}
      <div
        className={`mr-3 px-3 py-1.5 bg-dark-850 border border-gold-500/30 text-xs font-medium text-gold-300 rounded-md3 shadow-md3-2 transition-all duration-300 pointer-events-none ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span>¿Dudas? Chatea con Jocce</span>
      </div>

      {/* Botón flotante */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp a Alpha Lash"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-emerald-600 via-green-500 to-emerald-400 text-white rounded-full shadow-lg hover:shadow-gold-glow hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {/* Anillo de pulso sutil */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-white/20" />
      </a>
    </div>
  );
}
