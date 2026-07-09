import React, { useState } from 'react';
import { ActiveTab } from '../types';

interface LandingViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function LandingView({ setActiveTab }: LandingViewProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      num: 1,
      title: "DETECTAMOS TU NECESIDAD",
      desc: "Analizamos el perfil y las competencias exactas que requiere tu puesto de trabajo en logística.",
      icon: "search"
    },
    {
      num: 2,
      title: "DISEÑAMOS LA SOLUCIÓN",
      desc: "Creamos una formación a medida para preparar exactamente el talento que necesitas.",
      icon: "design_services"
    },
    {
      num: 3,
      title: "FORMAMOS A LAS PERSONAS",
      desc: "Impartimos formación técnica y habilidades clave adaptadas para tu entorno de trabajo.",
      icon: "school"
    },
    {
      num: 4,
      title: "REALIZAN PRÁCTICAS",
      desc: "Prácticas no laborales en tu empresa con tutorización experta y acompañamiento continuo.",
      icon: "engineering"
    },
    {
      num: 5,
      title: "INCORPORACIÓN EXITOSA",
      desc: "Tú decides si el participante se incorpora. Nosotros te apoyamos y acompañamos en todo momento.",
      icon: "handshake"
    }
  ];

  const benefits = [
    {
      title: "Acceso a talento cualificado",
      desc: "Profesionales formados a medida en logística, motivados, preparados y listos para aportar.",
      icon: "verified_user"
    },
    {
      title: "Reducción de tiempos y costes",
      desc: "Minimiza los costes de selección, adaptación y onboarding inicial de nuevos empleados.",
      icon: "trending_down"
    },
    {
      title: "Impacto social y diversidad",
      desc: "Mejora la diversidad y cohesión social de tu plantilla impulsando de forma activa tus políticas de RSC.",
      icon: "diversity_3"
    },
    {
      title: "Sin coste para la empresa",
      desc: "Toda la colaboración técnica, diseño del programa y formación es completamente gratuita para tu empresa.",
      icon: "payments"
    }
  ];

  const contents = [
    {
      title: "Operaciones auxiliares de almacén",
      desc: "Recepción de mercancías, ubicación inteligente, preparación de pedidos (picking), embalaje, expedición, y técnicas de cargas y descargas seguras.",
      icon: "inventory_2"
    },
    {
      title: "Nuevas tecnologías aplicadas",
      desc: "Sistemas informáticos de Gestión de Almacén (SGA), terminales de radiofrecuencia, trazabilidad, datos básicos e IA aplicada a logística.",
      icon: "devices"
    },
    {
      title: "Habilidades clave (Soft Skills)",
      desc: "Trabajo en equipo, comunicación profesional eficaz, asunción activa de responsabilidades, adaptabilidad a turnos y resolución inteligente de imprevistos.",
      icon: "groups"
    },
    {
      title: "Seguridad y prevención de riesgos",
      desc: "Normativa vigente en seguridad y salud, ergonomía postural en almacén, uso adecuado de EPIs y prevención de riesgos laborales aplicados.",
      icon: "gavel"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Redesigned Hero matching the layout of the second Infographic but retaining previous brand colors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-outline-variant rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        {/* Decorative corner background brand accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-accent/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Left Side Content Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-secondary-container text-primary px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            Fundación Secretariado Gitano + BeJob Formación y Empleo
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-on-surface tracking-tight leading-[1.12]">
            IMPULSA TU EMPRESA. <br />
            <span className="text-primary">TRANSFORMA VIDAS.</span>
          </h1>
          
          <h2 className="text-lg font-bold text-on-surface-variant leading-snug">
            Colabora sin coste con una Organización Social especializada en empleo.
          </h2>

          <p className="text-body-lg text-on-surface-variant font-sans max-w-xl leading-relaxed">
            Unimos fuerzas para conectar a tu empresa con talento motivado y rigurosamente formado en logística, contribuyendo al desarrollo de una sociedad más justa, integrada y cohesionada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => setActiveTab('submission')}
              className="px-6 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Dar de alta colaboración (Empresa)</span>
              <span className="material-symbols-outlined text-lg">add_circle</span>
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('details-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 border border-outline text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-low transition-all active:scale-[0.98] flex items-center justify-center"
            >
              Ver Propuesta
            </button>
          </div>

          {/* Program Overview Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-outline-variant/60">
            <div className="bg-surface-container-low p-3.5 rounded-2xl text-center">
              <div className="text-2xl font-extrabold font-display text-primary">70 h</div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Formación Técnica</div>
            </div>
            <div className="bg-surface-container-low p-3.5 rounded-2xl text-center">
              <div className="text-2xl font-extrabold font-display text-accent">10 h</div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Esp. Empresa</div>
            </div>
            <div className="bg-surface-container-low p-3.5 rounded-2xl text-center">
              <div className="text-2xl font-extrabold font-display text-primary">80 h</div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Prácticas N.L.</div>
            </div>
            <div className="bg-surface-container-low p-3.5 rounded-2xl text-center">
              <div className="text-2xl font-extrabold font-display text-accent">8 Sem.</div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Duración Total</div>
            </div>
          </div>
        </div>

        {/* Right Side Image Column with Operator and smart overlays */}
        <div className="lg:col-span-5 relative">
          <div className="rounded-3xl overflow-hidden shadow-md border border-outline-variant h-[410px] w-full relative">
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
              alt="Operario de Almacén con terminal inteligente" 
              className="w-full h-full object-cover"
            />
            {/* Ambient Red/Dark Gradient Layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            {/* Bottom Floating Card inside Image */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-outline-variant/30 flex items-start gap-3 shadow-md">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-primary font-sans uppercase tracking-wider">Sin Coste para la Empresa</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Toda la formación técnica, diseño de soluciones y selección de talento son completamente gratuitos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tu aliado para un empleo más inclusivo y efectivo (Infographic section 2) */}
      <div id="details-section" className="bg-white border border-outline-variant rounded-3xl p-6 md:p-10 space-y-10 shadow-sm relative">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary">Nuestro Propósito</span>
          <h2 className="text-2xl md:text-3xl font-black font-display text-on-surface">
            Tu Aliado para un Empleo más Inclusivo y Efectivo
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
            En <strong>BeJob</strong> y la <strong>Fundación Secretariado Gitano</strong> conectamos a tu empresa con talento altamente motivado y formado de forma práctica en logística.
          </p>
        </div>

        {/* Pillars Layout from Infographic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: EMPLEABILIDAD */}
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-base font-display text-on-surface uppercase tracking-wide">Empleabilidad</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Que el participante esté plenamente preparado para trabajar con soltura desde el primer día en tu almacén.
              </p>
            </div>
          </div>

          {/* Pillar 2: VALOR PARA LA EMPRESA */}
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-3xl">domain</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-base font-display text-on-surface uppercase tracking-wide">Valor para la Empresa</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Que tu empresa perciba valor positivo e inmediato en la incorporación de talento capacitado y acompañado.
              </p>
            </div>
          </div>

          {/* Pillar 3: IMPACTO SOCIAL */}
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-3xl">groups</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-base font-display text-on-surface uppercase tracking-wide">Impacto Social</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Que se genere una relación laboral sostenible en el tiempo que impulse la cohesión social y transforme realidades.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cómo Colaboramos Contigo (Infographic Section 3) */}
      <div className="space-y-8">
        <div className="border-l-4 border-primary pl-4">
          <h2 className="text-2xl font-black font-display text-on-surface uppercase tracking-tight">Cómo Colaboramos Contigo</h2>
          <p className="text-xs text-on-surface-variant mt-1">Metodología ágil y adaptada a las necesidades reales de tu cadena de distribución.</p>
        </div>

        <div className="relative">
          {/* Decorative Connecting line on desktop */}
          <div className="absolute top-1/2 left-4 md:left-1/2 w-0.5 md:w-full h-full md:h-0.5 bg-outline-variant -translate-y-1/2 -translate-x-1/2 pointer-events-none hidden md:block" style={{ height: '2px' }} />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {steps.map((step) => (
              <div 
                key={step.num}
                className={`bg-white border transition-all duration-300 rounded-2xl p-5 space-y-4 relative ${
                  hoveredStep === step.num 
                    ? 'border-primary shadow-lg -translate-y-1' 
                    : 'border-outline-variant shadow-sm'
                }`}
                onMouseEnter={() => setHoveredStep(step.num)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Step badge */}
                <div className="absolute -top-3 left-4 bg-primary text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md">
                  Fase {step.num}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    hoveredStep === step.num ? 'bg-primary text-white' : 'bg-surface-container-low text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-xl">{step.icon}</span>
                  </div>
                  <span className="text-3xl font-black text-outline/25">0{step.num}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-on-surface font-sans">{step.title}</h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Collaborate & Course Contents Grid (Infographic Sections 4 & 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ¿Por qué colaborar con nosotros? (Left Column) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border-l-4 border-accent pl-4">
            <h3 className="text-xl font-bold font-display text-on-surface uppercase tracking-tight">¿Por Qué Colaborar con Nosotros?</h3>
            <p className="text-xs text-on-surface-variant mt-1">Ventajas estratégicas para potenciar las operaciones y el valor social de tu empresa.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white border border-outline-variant rounded-2xl p-5 space-y-3 shadow-sm hover:border-primary transition-colors">
                <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">{benefit.icon}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-on-surface tracking-tight">{benefit.title}</h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formamos en logística: Contenidos clave (Right Column) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border-l-4 border-primary pl-4">
            <h3 className="text-xl font-bold font-display text-on-surface uppercase tracking-tight">Formamos en Logística: Contenidos Clave</h3>
            <p className="text-xs text-on-surface-variant mt-1">Programa formativo robusto y alineado con los requerimientos técnicos de la industria.</p>
          </div>

          <div className="space-y-3.5">
            {contents.map((content, i) => (
              <div key={i} className="bg-[#FAF9F6] border border-outline-variant/60 rounded-xl p-4 flex gap-4 items-start hover:bg-white transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-xl">{content.icon}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-on-surface tracking-tight uppercase tracking-wider text-primary">{content.title}</h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {content.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Cómo Generamos Impacto Juntos Checklist (Infographic Section 6) */}
      <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-5">
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-black font-display text-on-surface">
              Cómo Generamos Impacto Juntos
            </h3>
            <p className="text-xs text-on-surface-variant">
              Cada alianza es un paso hacia un modelo empresarial ético, socialmente responsable y económicamente competitivo.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span><strong>Facilitamos oportunidades:</strong> Damos acceso real a un empleo de calidad y con acompañamiento constante a personas con dificultades de inserción social.</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span><strong>Desarrollo territorial:</strong> Contribuyes directamente al crecimiento económico, cohesión y desarrollo de tu comunidad local.</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span><strong>RSC de Valor:</strong> Refuerzas, documentas y consolidas de forma transparente tu compromiso con la Responsabilidad Social Corporativa (RSC).</span>
            </div>
          </div>
        </div>

        {/* Worker visual and beautiful motivational block */}
        <div className="md:col-span-5 relative">
          <div className="rounded-2xl overflow-hidden border border-outline-variant/60 h-44 w-full relative shadow-inner">
            <img 
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80" 
              alt="Colaboradores en almacén logístico"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 backdrop-filter backdrop-saturate-150"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
              <p className="text-[11px] text-white font-medium italic">
                "Juntos, creamos empleo, fortalecemos tu empresa y construimos una sociedad más inclusiva."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Final Banner Action (Section 7) */}
      <div className="bg-gradient-to-r from-primary to-accent text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-md">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="text-lg md:text-xl font-bold font-display uppercase tracking-wide">
            SUMA VALOR A TU EMPRESA. TRANSFORMA FUTUROS.
          </h3>
          <p className="text-xs text-white/90">
            Hablemos hoy y construyamos juntos el talento logístico de alta calidad que tu negocio necesita.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('submission')}
          className="px-6 py-3.5 bg-white text-primary hover:bg-white/95 font-bold rounded-xl transition-all shadow-md text-xs uppercase tracking-wider flex items-center gap-2 flex-shrink-0"
        >
          <span>Dar de alta colaboración</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
