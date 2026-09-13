import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';

export default function Hero() {
  const handleScrollCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-dark-900 via-dark-950 to-dark-900 border-b border-dark-700/50">
      {/* Resplandor decorativo de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Lash Studio & Insumos Profesionales • San Bernardo</span>
          </div>

          {/* Título Principal de Impacto */}
          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15]">
            Realza cada mirada con <br />
            <span className="text-gold-gradient">Alpha Lash By Jocce</span>
          </h1>

          {/* Subtítulo descriptivo */}
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Insumos de estética de alta gama para lashistas exigentes. Fibras tecnológicas de tacto cashmere, adhesivos con ultra retención y pinzas de calibración milimétrica en Santiago de Chile.
          </p>

          {/* Botones de Llamado a la Acción (CTA) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleScrollCatalog}
              className="w-full sm:w-auto px-7 py-3.5 bg-gold-gradient text-black font-bold text-sm rounded-md3 shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/56951156429?text=Hola%20Alpha%20Lash!%20Quiero%20asesor%C3%ADa%20sobre%20insumos%20profesionales"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-dark-800 hover:bg-dark-700 text-gold-300 hover:text-white border border-gold-500/30 hover:border-gold-500 rounded-md3 font-semibold text-sm transition-all flex items-center justify-center"
            >
              Asesoría Personalizada
            </a>
          </div>

          {/* Sellos de Confianza (MD3 Feature Chips) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 p-3 bg-dark-850/70 border border-dark-700 rounded-md3 text-xs text-gray-300">
              <Truck className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>Envíos en San Bernardo & Chile</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-dark-850/70 border border-dark-700 rounded-md3 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>Retención 6-8 Semanas</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 p-3 bg-dark-850/70 border border-dark-700 rounded-md3 text-xs text-gray-300">
              <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>Fibras 100% Cashmere</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
