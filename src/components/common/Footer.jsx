import React from 'react';
import { MapPin, Phone, Clock, Instagram, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-dark-950 border-t border-dark-700/80 pt-14 pb-8 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-dark-800">
          
          {/* COLUMNA 1: Identidad y Marca */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl text-gold-gradient tracking-wider">
                ALPHA LASH
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Estudio especializado en extensiones de pestañas de alta gama y tienda de insumos técnicos para lashistas profesionales en Santiago de Chile.
            </p>
            <div className="flex items-center gap-2 text-xs text-gold-400 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-gold-500" />
              <span>Garantía de Calidad Profesional</span>
            </div>
          </div>

          {/* COLUMNA 2: Ubicación y Horarios (SEO Local San Bernardo) */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-gray-200 tracking-wide">
              Ubicación & Atención
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span>San Bernardo Centro, Santiago, Región Metropolitana, Chile</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Lunes a Sábado: 09:30 - 19:30 hrs</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a
                  href="tel:+56951156429"
                  className="hover:text-gold-300 transition-colors"
                >
                  +56 9 5115 6429
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: Enlaces Rápidos y Categorías */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-gray-200 tracking-wide">
              Categorías de Insumos
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#catalogo" className="hover:text-gold-300 transition-colors">
                  Pestañas Tecnológicas & Volumen
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-gold-300 transition-colors">
                  Adhesivos de Alta Retención
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-gold-300 transition-colors">
                  Pinzas de Precisión Japonesa
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-gold-300 transition-colors">
                  Lash Shampoos y Limpieza
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: Envíos y Redes Sociales */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm text-gray-200 tracking-wide">
              Despachos & Redes
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Envíos rápidos a San Bernardo, Santiago y todo Chile mediante Starken, Correos de Chile y Chilexpress.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/alphalash.cl/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Alpha Lash"
                className="p-2 bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-gold-400 rounded-md3 border border-dark-700 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/56951156429"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Alpha Lash"
                className="p-2 bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-emerald-400 rounded-md3 border border-dark-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* PIE DE PÁGINA INFERIOR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Alpha Lash By Jocce. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Diseñado para lashistas profesionales con <Heart className="w-3.5 h-3.5 text-gold-500 fill-gold-500" /> en San Bernardo, Chile
          </p>
        </div>
      </div>
    </footer>
  );
}
