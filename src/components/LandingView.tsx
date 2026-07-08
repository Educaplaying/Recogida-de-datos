import React from 'react';
import { ActiveTab } from '../types';

interface LandingViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function LandingView({ setActiveTab }: LandingViewProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side Content Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-secondary-container text-primary px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            Portal de Colaboración Corporativa
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-on-surface tracking-tight leading-[1.15]">
            Bienvenido al Portal de <span className="text-primary">Colaboración</span>
          </h1>

          <p className="text-body-lg text-on-surface-variant font-sans max-w-xl leading-relaxed">
            Gracias por formar parte de esta iniciativa para impulsar el talento y la integración social. 
            Este espacio está dedicado a la gestión eficiente de datos de nuestras entidades colaboradoras.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => setActiveTab('submission')}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-container transition-all hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Empezar ahora</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('features-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 border border-outline text-on-surface-variant font-semibold rounded-xl hover:bg-surface-container-low transition-all active:scale-[0.98] flex items-center justify-center"
            >
              Saber más
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-outline-variant">
            <div className="space-y-1">
              <div className="text-3xl font-extrabold font-display text-primary">+500</div>
              <div className="text-xs font-bold font-sans tracking-wider text-outline uppercase">Empresas Aliadas</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold font-display text-primary">100%</div>
              <div className="text-xs font-bold font-sans tracking-wider text-outline uppercase">Compromiso Social</div>
            </div>
          </div>
        </div>

        {/* Right Side Image & Overlay Column */}
        <div className="lg:col-span-5 relative">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-outline-variant h-[380px] w-full relative">
            <img 
              src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80"
              alt="Workspace collaboration" 
              className="w-full h-full object-cover"
            />
            {/* Ambient Dark Gradient Layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent"></div>

            {/* Bottom Floating Card inside Image */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-outline-variant/30 flex items-start gap-3 shadow-md">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_good</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-on-surface font-sans">Integridad de Datos</h4>
                <p className="text-xs text-on-surface-variant leading-normal">
                  Su información está protegida bajo los más altos estándares de seguridad y privacidad corporativa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bento Cards Section */}
      <div id="features-section" className="space-y-6 pt-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold font-display text-on-surface">Cómo funciona la Alianza</h2>
          <p className="text-sm text-on-surface-variant">
            Ponemos a su disposición un sistema ágil y transparente para maximizar el impacto de su colaboración.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-outline-variant rounded-2xl p-6 hover:shadow-md transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">domain</span>
            </div>
            <h3 className="text-lg font-bold font-display text-on-surface mb-2">Registro Ágil</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Centralice la información de su empresa en una plataforma intuitiva y optimizada para la eficiencia, permitiéndonos actuar con rapidez.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-outline-variant rounded-2xl p-6 hover:shadow-md transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">diversity_3</span>
            </div>
            <h3 className="text-lg font-bold font-display text-on-surface mb-2">Impacto Social</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Contribuya directamente a la inclusión sociolaboral mediante la formalización de convenios estratégicos y formación de colectivos prioritarios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
