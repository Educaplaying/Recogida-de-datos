import React, { useState } from 'react';
import { SupportTicket, ActiveTab } from '../types';
import { FAQ_ITEMS } from '../data';

interface SupportViewProps {
  onSubmitTicket: (ticket: Omit<SupportTicket, 'id' | 'submissionDate' | 'status'>) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function SupportView({ onSubmitTicket, setActiveTab }: SupportViewProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Local success alert state
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmitTicket({
      fullName,
      email,
      subject,
      message,
    });

    setIsSuccess(true);
    
    // Reset local state fields
    setFullName('');
    setEmail('');
    setSubject('');
    setMessage('');

    // Clear success banner after 5 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <div className="space-y-12">
      {/* Page header and categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Information & Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 bg-secondary-container text-primary px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            Canal de Ayuda
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-on-surface tracking-tight leading-none">
            Contacta con Soporte Técnico
          </h1>

          <p className="text-sm md:text-base text-on-surface-variant font-sans leading-relaxed">
            Si tienes alguna duda o incidencia con el formulario de recogida de datos, rellena el siguiente formulario y nos pondremos en contacto contigo a la mayor brevedad.
          </p>

          {/* Quick Info Cards */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-secondary-container/55 border border-outline-variant/40 rounded-xl p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-xl">schedule</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] text-outline font-extrabold uppercase tracking-wider block">Tiempo de Respuesta</span>
                <span className="text-sm font-bold text-on-surface">Menos de 24 horas laborables</span>
              </div>
            </div>


          </div>

          {/* FAQ Accordion preview */}
          <div className="bg-white border border-outline-variant rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-on-surface font-display border-b border-outline-variant/60 pb-2">
              Preguntas Frecuentes Populares
            </h3>
            <div className="space-y-2">
              {FAQ_ITEMS.slice(0, 3).map((faq, index) => (
                <div key={index} className="border-b border-outline-variant/30 last:border-0 pb-2 last:pb-0">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full flex justify-between items-center text-left text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors py-1 focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <span className="material-symbols-outlined text-base">
                      {activeFaq === index ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {activeFaq === index && (
                    <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1 font-sans bg-surface-container-low p-2 rounded success-animation">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-7 bg-white border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-start gap-3 success-animation">
              <span className="material-symbols-outlined text-green-600 mt-0.5">check_circle</span>
              <div className="text-sm">
                <p className="font-bold">¡Mensaje enviado correctamente!</p>
                <p className="text-xs text-green-700/90 mt-0.5">Hemos registrado tu consulta técnico-administrativa y te responderemos en breve. Puedes verla en el historial.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nombre Completo */}
            <div className="space-y-2">
              <label htmlFor="full_name" className="block text-sm font-bold text-on-surface font-sans">
                Nombre Completo
              </label>
              <input 
                id="full_name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full h-12 px-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Correo Electrónico de Contacto */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-on-surface font-sans">
                Correo Electrónico de Contacto
              </label>
              <input 
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@dominio.com"
                className="w-full h-12 px-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            {/* Asunto */}
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-bold text-on-surface font-sans">
                Asunto
              </label>
              <div className="relative">
                <select 
                  id="subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-12 pl-4 pr-10 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                >
                  <option value="" disabled>Selecciona un motivo</option>
                  <option value="Error técnico en el formulario">Error técnico en el formulario</option>
                  <option value="Duda sobre el perfil de mozo">Duda sobre el perfil de mozo</option>
                  <option value="Ampliación de capacidad de acogida">Ampliación de capacidad de acogida</option>
                  <option value="Firma de convenio de colaboración">Firma de convenio de colaboración</option>
                  <option value="Otras consultas administrativas">Otras consultas administrativas</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                  expand_more
                </span>
              </div>
            </div>

            {/* Mensaje / Descripción de la duda */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-bold text-on-surface font-sans">
                Mensaje / Descripción de la duda
              </label>
              <textarea 
                id="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe brevemente tu incidencia..."
                className="w-full p-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-y"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit"
                className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Enviar mensaje</span>
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
