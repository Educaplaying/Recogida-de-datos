import React, { useState } from 'react';
import { ActiveTab } from '../types';

interface InfoViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function InfoView({ setActiveTab }: InfoViewProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      num: 1,
      title: "Detectamos tu necesidad",
      desc: "Analizamos el perfil y las competencias exactas que requiere tu puesto de trabajo en logística.",
      icon: "search"
    },
    {
      num: 2,
      title: "Diseñamos la solución",
      desc: "Creamos una formación técnica a medida para preparar exactamente el talento que necesitas.",
      icon: "design_services"
    },
    {
      num: 3,
      title: "Formamos a las personas",
      desc: "Impartimos formación técnica de vanguardia y habilidades clave adaptadas para tu entorno de trabajo.",
      icon: "school"
    },
    {
      num: 4,
      title: "Realizan prácticas",
      desc: "Prácticas profesionales no laborales en tu empresa con tutorización experta y acompañamiento continuo.",
      icon: "engineering"
    },
    {
      num: 5,
      title: "Incorporación exitosa",
      desc: "Tú decides si el participante se incorpora. Nosotros te apoyamos y acompañamos en todo lo que necesites.",
      icon: "handshake"
    }
  ];

  const benefits = [
    {
      title: "Acceso a talento cualificado",
      desc: "Profesionales formados a medida en logística, motivados, preparados y con acompañamiento constante.",
      icon: "group_add"
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
      icon: "inventory"
    },
    {
      title: "Nuevas tecnologías aplicadas",
      desc: "Sistemas informáticos de Gestión de Almacén (SGA), terminales de radiofrecuencia, trazabilidad, control de stock y bases de datos e Inteligencia Artificial en logística.",
      icon: "robot"
    },
    {
      title: "Habilidades clave (Soft Skills)",
      desc: "Trabajo en equipo, comunicación profesional eficaz, asunción activa de responsabilidades, adaptabilidad a turnos y resolución inteligente de imprevistos.",
      icon: "psychology"
    },
    {
      title: "Seguridad y prevención de riesgos",
      desc: "Normativa vigente en seguridad y salud, ergonomía postural en almacén, uso adecuado de EPIs y prevención de riesgos laborales aplicados.",
      icon: "health_and_safety"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Infographic Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0E1B2E] via-[#1A2E44] to-[#2B4560] text-white p-8 md:p-12 overflow-hidden border border-outline-variant shadow-md">
        {/* Floating background blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-accent/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
            Propuesta de Valor BeJob
          </div>

          <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-tight">
            IMPULSA TU EMPRESA. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">TRANSFORMA VIDAS.</span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 font-sans max-w-2xl leading-relaxed">
            Colabora sin coste con una Organización Social especializada en empleo para impulsar tu negocio logístico y generar un impacto real en la sociedad.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setActiveTab('submission')}
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all hover:shadow-lg active:scale-[0.98] flex items-center gap-2"
            >
              <span>Colaborar con BeJob</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
            <a
              href="#infografia"
              className="px-6 py-3 border border-slate-500 hover:border-white text-slate-200 hover:text-white font-medium rounded-xl transition-all flex items-center justify-center"
            >
              Explorar Detalle
            </a>
          </div>
        </div>
      </div>

      {/* Aliado Section */}
      <div id="infografia" className="bg-white border border-outline-variant rounded-3xl p-6 md:p-10 space-y-10 shadow-sm relative">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-black font-display text-on-surface">
            Tu Aliado para un Empleo más Inclusivo y Efectivo
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
            En <strong>BeJob</strong> conectamos a tu empresa con talento motivado y rigurosamente formado en logística, contribuyendo al desarrollo de una sociedad más justa, integrada y cohesionada.
          </p>
        </div>

        {/* Pillars bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-[#FAF9F6] border border-outline-variant rounded-2xl p-6 text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-base font-display text-on-surface uppercase tracking-wide">Empleabilidad</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Aseguramos que cada participante esté plenamente preparado y motivado para incorporarse a su puesto de trabajo en logística desde el primer día.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#FAF9F6] border border-outline-variant rounded-2xl p-6 text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-3xl">domain</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-base font-display text-on-surface uppercase tracking-wide">Valor para la Empresa</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                La empresa percibe valor inmediato y real desde la incorporación gracias al diseño adaptado del programa y a la tutorización.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#FAF9F6] border border-outline-variant rounded-2xl p-6 text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-3xl">groups</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-base font-display text-on-surface uppercase tracking-wide">Impacto Social</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Generamos una relación laboral de calidad, justa y sostenible en el tiempo que transforma vidas y mejora el entorno corporativo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Como colaboramos contigo (Timeline) */}
      <div className="space-y-8">
        <div className="border-l-4 border-primary pl-4">
          <h2 className="text-2xl font-black font-display text-on-surface uppercase tracking-tight">Cómo Colaboramos Contigo</h2>
          <p className="text-xs text-on-surface-variant mt-1">Nuestra metodología de acompañamiento paso a paso, adaptada a tus necesidades operativas.</p>
        </div>

        <div className="relative">
          {/* Vertical/Horizontal Connecting line */}
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
                  <span className="text-3xl font-black text-outline/20">0{step.num}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-on-surface tracking-tight">{step.title}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Por qué colaborar con nosotros & Contenidos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Beneficios - Left Side */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border-l-4 border-accent pl-4">
            <h3 className="text-xl font-bold font-display text-on-surface uppercase tracking-tight">¿Por Qué Colaborar con Nosotros?</h3>
            <p className="text-xs text-on-surface-variant mt-1">Beneficios tangibles, estratégicos y completamente sin coste para tu empresa.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white border border-outline-variant rounded-2xl p-5 space-y-3 shadow-sm hover:border-accent transition-colors">
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

        {/* Contenidos Clave - Right Side */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border-l-4 border-primary pl-4">
            <h3 className="text-xl font-bold font-display text-on-surface uppercase tracking-tight">Formamos en Logística: Contenidos Clave</h3>
            <p className="text-xs text-on-surface-variant mt-1">Un plan curricular adaptado a las competencias exigidas por las empresas.</p>
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

      {/* Como generamos impacto juntos Checklist */}
      <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-5">
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-black font-display text-on-surface">
              Cómo Generamos Impacto Juntos
            </h3>
            <p className="text-xs text-on-surface-variant">
              Toda alianza genera un círculo virtuoso de desarrollo económico y social sostenible para tu entorno.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span><strong>Facilitamos oportunidades:</strong> Damos acceso real a un empleo digno y acompañado a personas con dificultades de inserción social.</span>
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

        <div className="md:col-span-5 relative">
          <div className="rounded-2xl overflow-hidden border border-outline-variant/60 h-44 w-full relative shadow-inner">
            <img 
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80" 
              alt="Colaboradores en almacén logístico"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 backdrop-filter backdrop-saturate-150"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
              <p className="text-[11px] text-white font-medium italic">
                "Juntos, creamos empleo, fortalecemos tu empresa y construimos una sociedad más inclusiva."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Final Banner Action */}
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
