import React, { useState } from 'react';
import { PartnerData, ActiveTab } from '../types';

interface SubmissionFormProps {
  onSubmit: (data: Omit<PartnerData, 'id' | 'submissionDate'>) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function SubmissionForm({ 
  onSubmit, 
  setActiveTab
}: SubmissionFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [profile, setProfile] = useState('Mozo auxiliar de almacén');
  const [otherProfileText, setOtherProfileText] = useState('');
  const [functions, setFunctions] = useState('');
  const [competencies, setCompetencies] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Call parent submit to save details to database and transition to success screen
      await onSubmit({
        companyName,
        location,
        capacity: Number(capacity),
        profile: profile === 'Otro' ? `Otro: ${otherProfileText}` : profile,
        otherProfileText: profile === 'Otro' ? otherProfileText : undefined,
        functions,
        competencies,
      });

      // Reset form fields on success
      setCompanyName('');
      setLocation('');
      setCapacity('');
      setProfile('Mozo auxiliar de almacén');
      setOtherProfileText('');
      setFunctions('');
      setCompetencies('');


    } catch (err: any) {
      console.error('Error during submission:', err);
      setSubmitError(err.message || 'Error al enviar el formulario. Por favor, inténtelo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* View Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold font-display text-on-surface tracking-tight">
          Recogida de Datos de Empresa
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-2xl">
          Complete la siguiente información para dar de alta su colaboración en nuestro portal corporativo.
        </p>
      </div>

      {/* Main Form Card Container */}
      <div className="bg-white border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          {/* Empresa */}
          <div className="space-y-2">
            <label htmlFor="company_name" className="block text-sm font-bold text-on-surface font-sans">
              Nombre de la empresa
            </label>
            <input 
              id="company_name"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ej. Logística Global S.L."
              className="w-full h-12 px-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          {/* Row: Ubicación & Capacidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-bold text-on-surface font-sans">
                Ubicación
              </label>
              <div className="relative">
                <select 
                  id="location"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-12 pl-4 pr-10 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                >
                  <option value="" disabled>Seleccione una ciudad</option>
                  <option value="Madrid">Madrid</option>
                  <option value="Zaragoza">Zaragoza</option>
                  <option value="Málaga">Málaga</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                  expand_more
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="capacity" className="block text-sm font-bold text-on-surface font-sans">
                Capacidad de acogida
              </label>
              <input 
                id="capacity"
                type="number"
                min="1"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full h-12 px-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Perfil del trabajador */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-on-surface font-sans">
              Perfil del trabajador
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="radio" 
                    name="profile"
                    value="Mozo auxiliar de almacén"
                    checked={profile === 'Mozo auxiliar de almacén'}
                    onChange={() => setProfile('Mozo auxiliar de almacén')}
                    className="peer appearance-none w-5 h-5 border-2 border-outline rounded-full checked:border-primary transition-all duration-200"
                  />
                  <div className="absolute w-2.5 h-2.5 bg-primary rounded-full left-[5px] top-[5px] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-sm font-sans text-on-surface group-hover:text-primary transition-colors">
                  Mozo auxiliar de almacén
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="radio" 
                    name="profile"
                    value="Otro"
                    checked={profile === 'Otro'}
                    onChange={() => setProfile('Otro')}
                    className="peer appearance-none w-5 h-5 border-2 border-outline rounded-full checked:border-primary transition-all duration-200"
                  />
                  <div className="absolute w-2.5 h-2.5 bg-primary rounded-full left-[5px] top-[5px] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-sm font-sans text-on-surface group-hover:text-primary transition-colors">
                  Otro
                </span>
              </label>
            </div>

            {/* Other field specifications */}
            {profile === 'Otro' && (
              <div className="mt-2 transition-all duration-300 success-animation">
                <input 
                  type="text"
                  required={profile === 'Otro'}
                  value={otherProfileText}
                  onChange={(e) => setOtherProfileText(e.target.value)}
                  placeholder="Especifique el perfil del trabajador"
                  className="w-full h-12 px-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            )}
          </div>

          {/* Funciones */}
          <div className="space-y-2">
            <label htmlFor="functions" className="block text-sm font-bold text-on-surface font-sans">
              Funciones
            </label>
            <textarea 
              id="functions"
              required
              rows={4}
              value={functions}
              onChange={(e) => setFunctions(e.target.value)}
              placeholder="Describa detalladamente las tareas a realizar..."
              className="w-full p-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-y"
            />
          </div>

          {/* Competencias */}
          <div className="space-y-2">
            <label htmlFor="competencies" className="block text-sm font-bold text-on-surface font-sans">
              Competencias
            </label>
            <textarea 
              id="competencies"
              required
              rows={4}
              value={competencies}
              onChange={(e) => setCompetencies(e.target.value)}
              placeholder="Describa las competencias requeridas..."
              className="w-full p-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-y"
            />
          </div>

           {/* Error Banner */}
           {submitError && (
             <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl font-sans text-sm flex items-start gap-3 success-animation">
               <span className="material-symbols-outlined text-xl mt-0.5">error</span>
               <div>
                 <p className="font-bold">Error al enviar el formulario</p>
                 <p className="mt-0.5 text-xs text-error/90">{submitError}</p>
               </div>
             </div>
           )}

           {/* Submit Button */}
           <div className="pt-4 flex flex-col md:flex-row md:items-center gap-4">
             <button 
               type="submit"
               disabled={isSubmitting}
               className={`w-full md:w-auto min-w-[220px] h-12 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm ${
                 isSubmitting ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-container'
               }`}
             >
               {isSubmitting ? (
                 <>
                   <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                   </svg>
                   <span>Enviando datos...</span>
                 </>
               ) : (
                 <>
                   <span className="material-symbols-outlined text-xl">send</span>
                   <span>Enviar Formulario</span>
                 </>
               )}
             </button>

             <div className="flex items-center gap-2 text-xs text-on-surface-variant font-sans max-w-md">
               <span className="material-symbols-outlined text-lg text-primary">cloud_done</span>
               <span>
                 La información se guardará de forma segura en la base de datos de colaboradores.
               </span>
             </div>
           </div>

        </form>
      </div>

      {/* Contextual Cards (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Benefits of Colaboration (colspan 2) */}
        <div className="md:col-span-2 bg-secondary-container border border-outline-variant rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-display text-on-surface">
              Beneficios de Colaborar
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                <span className="text-sm font-medium font-sans text-on-surface-variant">Talento Cualificado</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                <span className="text-sm font-medium font-sans text-on-surface-variant">Impacto Social Positivo</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                <span className="text-sm font-medium font-sans text-on-surface-variant">Asesoramiento Continuo</span>
              </li>
            </ul>
          </div>
          

        </div>

        {/* Card 2: Support agent callout (blue background) */}
        <div 
          onClick={() => setActiveTab('support')}
          className="bg-primary hover:bg-primary-container text-white rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[48px] mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
          <h3 className="text-base font-bold font-sans">Soporte Técnico</h3>
          <p className="text-xs text-white/90 mt-1 max-w-xs leading-relaxed">
            ¿Necesita ayuda con la carga de datos? Contacte con nuestro equipo.
          </p>
        </div>

      </div>
    </div>
  );
}
