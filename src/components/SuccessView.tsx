import React from 'react';
import { PartnerData, ActiveTab } from '../types';
import { generateExcelBlob } from '../lib/googleDrive';

interface SuccessViewProps {
  submittedData: PartnerData | null;
  onReset: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function SuccessView({ submittedData, onReset, setActiveTab }: SuccessViewProps) {
  
  const handleDownloadExcel = () => {
    if (!submittedData) return;
    
    const excelBlob = generateExcelBlob(submittedData);

    const url = URL.createObjectURL(excelBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ficha_Colaborador_${submittedData.companyName.replace(/\s+/g, '_')}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (!submittedData) return;
    
    let participationsText = "";
    submittedData.participations.forEach((part, index) => {
      participationsText += `
CENTRO DE TRABAJO #${index + 1}:
------------------------------------------------------------
- Ubicación Exacta:      ${part.locationExact}
- Perfil Solicitado:     ${part.profile}
- Plazas de Prácticas:   ${part.slotsCount}
- Funciones:             ${part.functions}
- Competencias:          ${part.competencies}
`;
    });

    const docText = `
============================================================
       PORTAL DE COLABORACIÓN CORPORATIVA - RESUMEN DE FICHA
============================================================
Fecha de Registro: ${submittedData.submissionDate}
ID de Registro:    ${submittedData.id}

APARTADO 1: DATOS DE LA EMPRESA
------------------------------------------------------------
Nombre de la Empresa:  ${submittedData.companyName}
Descripción Genérica:  ${submittedData.companyDescription}
Persona de Contacto:   ${submittedData.contactPerson}
Cargo:                 ${submittedData.contactRole}
Email de Contacto:     ${submittedData.contactEmail}
Teléfono de Contacto:  ${submittedData.contactPhone}

APARTADO 2: PARTICIPACIÓN EN EL PROGRAMA
------------------------------------------------------------
${participationsText}
------------------------------------------------------------
Estado del Registro:   PROCESADO - ENVIADO AL EQUIPO DE BEJOB EMPLEABILIDAD
Asesor Técnico:       Fundación Secretariado Gitano & BeJob Empleabilidad
Plazo de Contacto:     Dentro de las próximas 48 horas laborales
============================================================
    `;

    // Download file
    const blob = new Blob([docText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resumen_Registro_${submittedData.companyName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] relative py-6">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003d9b 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      <div className="w-full max-w-2xl bg-white border border-outline-variant rounded-2xl p-8 md:p-12 text-center relative z-10 shadow-sm success-animation">
        {/* Success Visual Circle */}
        <div className="mb-6 relative inline-block">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mx-auto border-4 border-green-500/10">
            <span className="material-symbols-outlined text-green-500 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
        </div>

        {/* Success Content */}
        <div className="space-y-4 mb-8">
          <h1 className="font-display text-3xl font-extrabold text-on-surface">
            ¡Envío completado con éxito!
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-md mx-auto leading-relaxed">
            La información de su empresa ha sido recibida correctamente por nuestro sistema de gestión.
          </p>

          {/* Submitted data summary preview */}
          {submittedData && (
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 text-left space-y-2 mt-4">
              <h3 className="text-xs font-extrabold text-outline uppercase tracking-wider font-sans mb-1">
                Resumen del Registro (ID: {submittedData.id})
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-sans text-on-surface">
                <div>
                  <span className="text-xs text-on-surface-variant block">Empresa</span>
                  <span className="font-semibold">{submittedData.companyName}</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block">Contacto</span>
                  <span className="font-semibold">{submittedData.contactPerson}</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block">Centros Registrados</span>
                  <span className="font-semibold">{submittedData.participations.length} centro(s) de trabajo</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block">Plazas Totales</span>
                  <span className="font-semibold">
                    {submittedData.participations.reduce((acc, curr) => acc + curr.slotsCount, 0)} plazas de prácticas
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <p className="text-xs text-outline font-sans">
              Un asesor de la plataforma se pondrá en contacto con usted en un plazo máximo de 48 horas laborales.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center">
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 h-12 bg-primary text-white font-semibold rounded-xl hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm text-sm"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Volver al formulario</span>
          </button>
          
          <button
            onClick={handleDownloadExcel}
            className="w-full sm:w-auto px-6 h-12 bg-secondary-container text-primary font-bold border border-outline rounded-xl hover:bg-surface-container-high transition-all active:scale-95 flex items-center justify-center gap-1.5 text-sm"
          >
            <span className="material-symbols-outlined text-lg">description</span>
            <span>Descargar Ficha Excel</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto px-6 h-12 border border-outline text-on-surface-variant font-semibold rounded-xl hover:bg-surface-container-high transition-all active:scale-95 flex items-center justify-center gap-1.5 text-sm"
          >
            <span className="material-symbols-outlined text-lg">text_snippet</span>
            <span>Descargar Resumen (.txt)</span>
          </button>

          <button
            onClick={() => setActiveTab('landing')}
            className="w-full sm:w-auto px-6 h-12 border border-outline text-on-surface-variant font-semibold rounded-xl hover:bg-surface-container-high transition-all active:scale-95 flex items-center justify-center text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
