import React from 'react';
import { User } from 'firebase/auth';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="bg-white border-b border-outline-variant fixed top-0 w-full z-50 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        {/* Logos Container */}
        <div className="flex items-center gap-4">
          <a 
            href="https://www.gitanos.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:opacity-95 transition-opacity"
          >
            <img 
              className="h-10 md:h-12 w-auto object-contain" 
              alt="Fundación Secretariado Gitano" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYfWixpCs9lASNQEH09CcnYscQ6LNDhV1maE89FRglt5K0vRXXzdBa8v1PrbgjAmmmZYLxtn-Bszt-l5oUXyWwJPMaGnISBJtxgeHuIU6W4cDKsLBQ40Y3MqGrfTtCSZFm8YCWkX-1iN2jKbRiUXfArQExbRRBJIjL63lehjw_n5aRX7EY0v230tRCar0skr-x_EgrmUHf3JD4iHIzz1BD4px9r6I_Iainy2lMyvifwzBf1XDcm6xPZsfFWWhqLg63dQg"
            />
          </a>
          <div className="h-8 w-px bg-outline-variant hidden sm:block"></div>
          <span className="text-xs text-on-surface-variant font-sans font-medium tracking-tight hidden sm:block">Created by</span>
          <a 
            href="https://www.bejob.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:opacity-95 transition-opacity flex items-center"
          >
            <img 
              alt="BeJob" 
              className="h-9 md:h-11 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA_1kWz79sAn1E-IIg8YaZ_kk3UTMr8uMzrah0_duTl7PiCv2qZHI-UAaXneo8PN55SXIvauHUot8S5gvII_AkVb3Ch3fiHfN59yNgVsR1_g4lrY4ys4MznenSz8FXJ93hDn81Eu4DYBn7sHGxqGOSs0kB79IcySXwIWPGd0t1_Vrbt4V3AFb3nWot38f_pqCYb9mIKuonve6d-EgGgV6ja2EffXlUOPWwDkDeTqHJkYvM5HFpsR5fnSwhu4vMVzD9UiM"
            />
          </a>
        </div>

        {/* Quick Nav (Desktop Only) */}
        <div className="flex items-center gap-2 md:gap-4">
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-1.5 rounded-full font-sans text-sm font-medium transition-all ${
                activeTab === 'landing' 
                  ? 'bg-secondary-container text-primary font-semibold' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setActiveTab('submission')}
              className={`px-3 py-1.5 rounded-full font-sans text-sm font-medium transition-all ${
                activeTab === 'submission' || activeTab === 'success'
                  ? 'bg-secondary-container text-primary font-semibold' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              Formulario de Recogida
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-3 py-1.5 rounded-full font-sans text-sm font-medium transition-all ${
                activeTab === 'support' 
                  ? 'bg-secondary-container text-primary font-semibold' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              Soporte Técnico
            </button>
          </nav>

          {/* Utility items */}
          <div className="flex items-center gap-2 border-l border-outline-variant pl-2 md:pl-4">

            {/* Support CTA link */}
            <button
              onClick={() => setActiveTab('support')}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs md:text-sm font-medium transition-all ${
                activeTab === 'support'
                  ? 'bg-primary text-white'
                  : 'border border-outline text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-base">help</span>
              <span className="hidden sm:inline">Soporte</span>
            </button>


          </div>
        </div>
      </div>
    </header>
  );
}
