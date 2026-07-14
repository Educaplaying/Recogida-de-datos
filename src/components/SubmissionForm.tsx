import React, { useState } from 'react';
import { PartnerData, ActiveTab, WorkCenterParticipation } from '../types';

interface SubmissionFormProps {
  onSubmit: (data: Omit<PartnerData, 'id' | 'submissionDate'>) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function SubmissionForm({ 
  onSubmit, 
  setActiveTab
}: SubmissionFormProps) {
  // Section 1: Empresa State
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Section 2: Participaciones State (three empty slots provided by default for maximum immediate convenience)
  const [participations, setParticipations] = useState<Omit<WorkCenterParticipation, 'id'>[]>([
    {
      locationExact: '',
      profile: 'Mozo auxiliar de almacén',
      functions: '',
      competencies: '',
      slotsCount: 1
    },
    {
      locationExact: '',
      profile: 'Carretillero / Preparador de pedidos',
      functions: '',
      competencies: '',
      slotsCount: 1
    },
    {
      locationExact: '',
      profile: 'Operario de packing y expediciones',
      functions: '',
      competencies: '',
      slotsCount: 1
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Add a new empty work center/profile block
  const handleAddParticipation = () => {
    setParticipations([
      ...participations,
      {
        locationExact: '',
        profile: 'Mozo auxiliar de almacén',
        functions: '',
        competencies: '',
        slotsCount: 1
      }
    ]);
  };

  // Remove a work center block
  const handleRemoveParticipation = (index: number) => {
    if (participations.length <= 1) return;
    setParticipations(participations.filter((_, i) => i !== index));
  };

  // Update field of a specific participation
  const handleUpdateParticipation = (index: number, field: keyof Omit<WorkCenterParticipation, 'id'>, value: any) => {
    setParticipations(
      participations.map((part, i) => {
        if (i === index) {
          return { ...part, [field]: value };
        }
        return part;
      })
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Filter out completely empty additional participations (index > 0)
    const activeParticipations = participations.filter((p, idx) => {
      if (idx === 0) return true; // First one is always kept and validated
      // Keep if any core field has content
      return p.locationExact.trim() !== '' || p.functions.trim() !== '' || p.competencies.trim() !== '';
    });

    // Basic validation on the first one
    const firstPart = activeParticipations[0];
    if (!firstPart || !firstPart.locationExact.trim() || !firstPart.profile.trim() || !firstPart.functions.trim()) {
      setSubmitError('Por favor, rellene todos los campos requeridos para el primer centro de trabajo.');
      return;
    }

    // For any additional active participations, check that they are fully completed
    const hasIncompleteAdditional = activeParticipations.slice(1).some(
      p => !p.locationExact.trim() || !p.profile.trim() || !p.functions.trim()
    );
    if (hasIncompleteAdditional) {
      setSubmitError('Por favor, complete todos los campos (Ubicación, Perfil, Funciones) para cada centro de trabajo adicional que haya iniciado, o déjelos totalmente en blanco si no desea incluirlos.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map active participations with a unique ID
      const finalParticipations: WorkCenterParticipation[] = activeParticipations.map((p, idx) => ({
        ...p,
        id: `part-${Date.now()}-${idx}`
      }));

      // Call parent submit to save details to database and send notification
      await onSubmit({
        companyName,
        companyDescription,
        contactPerson,
        contactRole,
        contactEmail,
        contactPhone,
        participations: finalParticipations
      });

      // Reset form fields on success
      setCompanyName('');
      setCompanyDescription('');
      setContactPerson('');
      setContactRole('');
      setContactEmail('');
      setContactPhone('');
      setParticipations([
        {
          locationExact: '',
          profile: 'Mozo auxiliar de almacén',
          functions: '',
          competencies: '',
          slotsCount: 1
        },
        {
          locationExact: '',
          profile: 'Carretillero / Preparador de pedidos',
          functions: '',
          competencies: '',
          slotsCount: 1
        },
        {
          locationExact: '',
          profile: 'Operario de packing y expediciones',
          functions: '',
          competencies: '',
          slotsCount: 1
        }
      ]);

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
        <h1 className="text-3xl font-extrabold font-display text-on-surface tracking-tight uppercase">
          Ficha de Registro de Colaboración
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant max-w-3xl leading-relaxed">
          Formulario estructurado en dos apartados para dar de alta su participación. Permite especificar ubicaciones exactas y necesidades de perfiles específicos para cada uno de sus centros de trabajo.
        </p>
      </div>

      {/* Main Form Card Container */}
      <form onSubmit={handleFormSubmit} className="space-y-10">
        
        {/* APARTADO 1: DATOS DE LA EMPRESA */}
        <div className="bg-white border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-outline-variant/60 pb-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-lg font-extrabold font-display text-on-surface uppercase tracking-wide">
                Apartado 1: Información de la Empresa
              </h2>
              <p className="text-xs text-on-surface-variant">Datos generales de la compañía y persona de contacto principal.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="company_name" className="block text-xs font-bold text-on-surface font-sans uppercase tracking-wider">
                Nombre de la empresa <span className="text-primary">*</span>
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

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="company_desc" className="block text-xs font-bold text-on-surface font-sans uppercase tracking-wider">
                Descripción genérica <span className="text-primary">*</span>
              </label>
              <textarea 
                id="company_desc"
                required
                rows={3}
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                placeholder="Indique brevemente el sector, actividad principal y especialidad de la empresa..."
                className="w-full p-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-y"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact_person" className="block text-xs font-bold text-on-surface font-sans uppercase tracking-wider">
                Persona de contacto principal <span className="text-primary">*</span>
              </label>
              <input 
                id="contact_person"
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Ej. Alejandro Sanz Gómez"
                className="w-full h-12 px-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact_role" className="block text-xs font-bold text-on-surface font-sans uppercase tracking-wider">
                Cargo / Puesto <span className="text-primary">*</span>
              </label>
              <input 
                id="contact_role"
                type="text"
                required
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                placeholder="Ej. Responsable de Talento y RSC"
                className="w-full h-12 px-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact_email" className="block text-xs font-bold text-on-surface font-sans uppercase tracking-wider">
                Email de contacto <span className="text-primary">*</span>
              </label>
              <input 
                id="contact_email"
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Ej. asanz@logisticaglobal.com"
                className="w-full h-12 px-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact_phone" className="block text-xs font-bold text-on-surface font-sans uppercase tracking-wider">
                Teléfono de contacto <span className="text-primary">*</span>
              </label>
              <input 
                id="contact_phone"
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Ej. 611223344"
                className="w-full h-12 px-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
        </div>

        {/* APARTADO 2: PARTICIPACIÓN EN EL PROGRAMA */}
        <div className="space-y-6">
          <div className="bg-white border border-outline-variant rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h2 className="text-lg font-extrabold font-display text-on-surface uppercase tracking-wide">
                  Apartado 2: Participación en el Programa
                </h2>
                <p className="text-xs text-on-surface-variant">Ubicaciones exactas de centros de trabajo, perfiles requeridos y plazas.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {participations.map((part, index) => (
              <div 
                key={index} 
                className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm relative space-y-6 success-animation"
              >
                {/* Header of dynamic block */}
                <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3">
                  <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
                    Centro de Trabajo / Perfil #{index + 1}
                  </span>
                  {participations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveParticipation(index)}
                      className="text-error hover:text-error/80 transition-colors flex items-center gap-1.5 text-xs font-bold"
                    >
                      <span className="material-symbols-outlined text-sm font-black">delete</span>
                      <span>Eliminar</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Ubicación Exacta */}
                  <div className="space-y-2 md:col-span-8">
                    <label className="block text-[11px] font-bold text-on-surface font-sans uppercase tracking-wider">
                      Ubicación Exacta del Centro de Trabajo {index === 0 && <span className="text-primary">*</span>}
                    </label>
                    <input 
                      type="text"
                      required={index === 0}
                      value={part.locationExact}
                      onChange={(e) => handleUpdateParticipation(index, 'locationExact', e.target.value)}
                      placeholder="Ej. Avenida de la Logística, 42, Polígono Industrial de Coslada, 28821 Madrid (No vale solo provincia)"
                      className="w-full h-11 px-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  {/* Número de plazas */}
                  <div className="space-y-2 md:col-span-4">
                    <label className="block text-[11px] font-bold text-on-surface font-sans uppercase tracking-wider">
                      Nº plazas prácticas {index === 0 && <span className="text-primary">*</span>}
                    </label>
                    <input 
                      type="number"
                      required={index === 0}
                      min={1}
                      value={part.slotsCount}
                      onChange={(e) => handleUpdateParticipation(index, 'slotsCount', Number(e.target.value))}
                      placeholder="Plazas"
                      className="w-full h-11 px-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  {/* Perfil */}
                  <div className="space-y-2 md:col-span-12">
                    <label className="block text-[11px] font-bold text-on-surface font-sans uppercase tracking-wider">
                      Perfil con posibilidades de incorporación {index === 0 && <span className="text-primary">*</span>}
                    </label>
                    <div className="relative">
                      <select
                        value={part.profile}
                        onChange={(e) => handleUpdateParticipation(index, 'profile', e.target.value)}
                        className="w-full h-11 pl-4 pr-10 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      >
                        <option value="Mozo auxiliar de almacén">Mozo auxiliar de almacén</option>
                        <option value="Carretillero / Preparador de pedidos">Carretillero / Preparador de pedidos</option>
                        <option value="Auxiliar de soporte técnico y almacén">Auxiliar de soporte técnico y almacén</option>
                        <option value="Operario de packing y expediciones">Operario de packing y expediciones</option>
                        <option value="Otro">Otro perfil específico</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Custom profile specifier if select is Other */}
                  {part.profile.includes('Otro') && (
                    <div className="space-y-2 md:col-span-12">
                      <input 
                        type="text"
                        required={index === 0}
                        placeholder="Especifique el perfil (Ej. Auxiliar de inventarios y control de stock)"
                        className="w-full h-11 px-4 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                        onChange={(e) => handleUpdateParticipation(index, 'profile', `Otro: ${e.target.value}`)}
                      />
                    </div>
                  )}

                  {/* Funciones */}
                  <div className="space-y-2 md:col-span-6">
                    <label className="block text-[11px] font-bold text-on-surface font-sans uppercase tracking-wider">
                      Funciones principales {index === 0 && <span className="text-primary">*</span>}
                    </label>
                    <textarea 
                      required={index === 0}
                      rows={3}
                      value={part.functions}
                      onChange={(e) => handleUpdateParticipation(index, 'functions', e.target.value)}
                      placeholder="Describa brevemente las tareas que realizará (Ej. picking, packing, inventarios...)"
                      className="w-full p-3.5 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-xs focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-y"
                    />
                  </div>

                  {/* Competencias */}
                  <div className="space-y-2 md:col-span-6">
                    <label className="block text-[11px] font-bold text-on-surface font-sans uppercase tracking-wider">
                      Competencias clave requeridas {index === 0 && <span className="text-primary">*</span>}
                    </label>
                    <textarea 
                      required={index === 0}
                      rows={3}
                      value={part.competencies}
                      onChange={(e) => handleUpdateParticipation(index, 'competencies', e.target.value)}
                      placeholder="Ej. Puntualidad, dinamismo, trabajo en equipo, capacidad física, manejo de terminales de radiofrecuencia..."
                      className="w-full p-3.5 border border-outline-variant rounded-xl bg-white text-on-surface font-sans text-xs focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-y"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Elegant dashed addition button at the bottom of the section */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleAddParticipation}
                className="w-full sm:w-auto px-8 py-3.5 border-2 border-dashed border-primary/30 hover:border-primary text-primary hover:bg-primary/5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-base font-bold">add_circle</span>
                <span>Añadir otra ubicación / perfil adicional</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {submitError && (
          <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl font-sans text-sm flex items-start gap-3 success-animation">
            <span className="material-symbols-outlined text-xl mt-0.5">error</span>
            <div>
              <p className="font-bold">Error en el formulario</p>
              <p className="mt-0.5 text-xs text-error/90">{submitError}</p>
            </div>
          </div>
        )}

        {/* Submit Section */}
        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-xs text-on-surface-variant font-sans max-w-xl">
            <span className="material-symbols-outlined text-2xl text-primary flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_done</span>
            <span>
              Al enviar este formulario, los datos se registrarán en la plataforma y se generará una <strong>ficha Excel automatizada</strong> que se enviará por correo electrónico al equipo de BeJob Empleabilidad.
            </span>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto min-w-[240px] h-12 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider text-xs ${
              isSubmitting ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-container'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Guardando y enviando...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base font-black">send</span>
                <span>Registrar colaboración</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
