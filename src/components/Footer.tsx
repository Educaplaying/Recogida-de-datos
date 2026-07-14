import React from 'react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  return (
    <footer className="bg-white border-t border-outline-variant w-full py-6 mt-12">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Branding & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <span className="font-bold text-primary text-sm font-display">Alianza Corporativa</span>
          <span className="hidden sm:inline text-outline-variant text-sm">|</span>
          <span className="text-caption text-xs md:text-sm text-on-surface-variant font-sans">
            © 2026 Fundación Secretariado Gitano & BeJob Empleabilidad. Todos los derechos reservados.
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveTab('support'); }}
            className="text-xs md:text-sm text-on-surface-variant hover:text-primary transition-colors hover:underline"
          >
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}
