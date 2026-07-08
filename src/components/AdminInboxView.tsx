import React, { useState, useEffect } from 'react';
import { PartnerData, ActiveTab } from '../types';
import { loadPartnerSubmissions, savePartnerSubmission } from '../lib/db';
import { generateExcelBlob, uploadExcelToGoogleDrive } from '../lib/googleDrive';
import * as XLSX from 'xlsx';

interface AdminInboxViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  allPartners: PartnerData[];
  onRefreshPartners: () => Promise<void>;
}

export default function AdminInboxView({ setActiveTab, allPartners, onRefreshPartners }: AdminInboxViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [googleScriptUrl, setGoogleScriptUrl] = useState(() => {
    return localStorage.getItem('google_apps_script_url') || '';
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    onRefreshPartners();
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    localStorage.setItem('google_apps_script_url', googleScriptUrl.trim());
    setTimeout(() => {
      setIsSavingSettings(false);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    }, 600);
  };

  const handleDownloadExcel = (partner: PartnerData) => {
    const excelBlob = generateExcelBlob({
      companyName: partner.companyName,
      location: partner.location,
      capacity: partner.capacity,
      profile: partner.profile,
      functions: partner.functions,
      competencies: partner.competencies
    });

    const url = URL.createObjectURL(excelBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ficha_Colaborador_${partner.companyName.replace(/\s+/g, '_')}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAll = () => {
    if (allPartners.length === 0) return;
    setIsExportingAll(true);

    try {
      const wb = XLSX.utils.book_new();
      
      // Map all submissions into a single table
      const rows = allPartners.map((p, index) => ({
        'Nº': index + 1,
        'Código ID': p.id,
        'Nombre de la Empresa': p.companyName,
        'Ciudad / Ubicación': p.location,
        'Plazas de Acogida': p.capacity,
        'Perfil Solicitado': p.profile,
        'Funciones a Realizar': p.functions,
        'Competencias Requeridas': p.competencies,
        'Fecha de Envío': p.submissionDate
      }));

      const ws = XLSX.utils.json_to_sheet(rows);

      // Simple column formatting
      ws['!cols'] = [
        { wch: 5 },   // Nº
        { wch: 12 },  // Código ID
        { wch: 25 },  // Nombre de la Empresa
        { wch: 18 },  // Ciudad
        { wch: 15 },  // Plazas
        { wch: 25 },  // Perfil
        { wch: 40 },  // Funciones
        { wch: 40 },  // Competencias
        { wch: 15 }   // Fecha
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Base de Colaboradores");
      
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Consolidado_Colaboradores_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsExportingAll(false), 500);
    }
  };

  const filteredPartners = allPartners.filter(p => {
    const matchesSearch = p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.profile.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === '' || p.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const handleRefreshData = async () => {
    setIsSyncing(true);
    await onRefreshPartners();
    setTimeout(() => setIsSyncing(false), 600);
  };

  // Google Apps Script copy-pasteable guide
  const appsScriptCode = `// CODIGO ACTUALIZADO PARA ENVIAR NOTIFICACIONES A srubin@bejob.com
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var emailRecipient = "srubin@bejob.com";
    
    // 1. Si es una consulta de soporte (enviar mensaje) o no contiene datos de archivo
    if (data.type === "ticket" || data.type === "message" || !data.base64Data) {
      var fullName = data.fullName || "Usuario de la App";
      var userEmail = data.email || "No especificado";
      var subjectLine = data.subject || "Consulta Técnica";
      var messageText = data.message || "";
      
      var emailSubject = "Nuevo Mensaje de Soporte: " + subjectLine;
      var emailBody = "Hola,\\n\\n" +
        "Se ha recibido una nueva consulta o mensaje de soporte a través de la aplicación:\\n\\n" +
        "Nombre completo: " + fullName + "\\n" +
        "Correo electrónico de contacto: " + userEmail + "\\n" +
        "Asunto: " + subjectLine + "\\n\\n" +
        "Mensaje:\\n" + messageText + "\\n\\n" +
        "Saludos cordiales,\\nSistema de Registro de Colaboradores";
        
      MailApp.sendEmail({
        to: emailRecipient,
        subject: emailSubject,
        body: emailBody
      });
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Mensaje de soporte enviado con éxito por correo a srubin@bejob.com"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. Caso de Ficha de Colaborador (archivo Excel)
    var fileName = data.fileName || "Ficha_Colaborador.xlsx";
    var decoded = Utilities.base64Decode(data.base64Data);
    var blob = Utilities.newBlob(
      decoded, 
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
      fileName
    );
    
    // Guardar en la carpeta de Drive (opcional, si tiene acceso)
    var fileUrl = "";
    var fileId = "";
    try {
      var folderId = "1OOMer7OYFkRji9KcPn22ZZzwCBTzrKPj";
      var folder = DriveApp.getFolderById(folderId);
      var file = folder.createFile(blob);
      fileId = file.getId();
      fileUrl = file.getUrl();
    } catch(driveErr) {
      console.warn("No se pudo guardar en Drive: " + driveErr.toString());
    }
    
    var emailSubject = "Nueva Ficha de Colaborador Recibida: " + fileName.replace(".xlsx", "").replace(/_/g, " ");
    var emailBody = "Hola,\\n\\n" +
      "Se ha recibido un nuevo registro de colaborador a través del formulario de la aplicación.\\n\\n" +
      "Se adjunta a este correo la ficha generada automáticamente en formato Excel (.xlsx) para su revisión directa.\\n\\n";
      
    if (fileUrl) {
      emailBody += "También se ha guardado una copia en la carpeta de Google Drive:\\n" + fileUrl + "\\n\\n";
    }
    
    emailBody += "Saludos cordiales,\\nSistema de Registro de Colaboradores";
    
    MailApp.sendEmail({
      to: emailRecipient,
      subject: emailSubject,
      body: emailBody,
      attachments: [blob]
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      fileId: fileId,
      url: fileUrl,
      message: "Ficha enviada con éxito por correo a srubin@bejob.com"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Permitir solicitudes de preflight de CORS
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}`;

  return (
    <div className="space-y-8">
      {/* View Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold font-display text-on-surface tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">inbox</span>
            Bandeja de Entrada de Envíos
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl">
            Espacio unificado de recogida. Acceda, revise y gestione todos los formularios de colaboradores recibidos.
          </p>
        </div>

        {/* Sync & Export Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshData}
            disabled={isSyncing}
            className="p-2.5 border border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-all active:scale-95 flex items-center gap-2 text-sm"
            title="Sincronizar con Firestore Cloud"
          >
            <span className={`material-symbols-outlined text-lg ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
            <span>Actualizar</span>
          </button>

          <button
            onClick={handleExportAll}
            disabled={isExportingAll || filteredPartners.length === 0}
            className="px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2 text-sm shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">download_for_offline</span>
            <span>{isExportingAll ? 'Exportando...' : 'Exportar Todo a Excel'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left is Submissions List, Right is Settings / Apps Script */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Submissions List (Colspan 8) */}
        <div className="xl:col-span-8 space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white border border-outline-variant rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por empresa o perfil solicitado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-outline-variant rounded-lg bg-white text-on-surface font-sans text-xs focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="relative w-full md:w-48">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full h-10 pl-3 pr-8 border border-outline-variant rounded-lg bg-white text-on-surface font-sans text-xs appearance-none focus:outline-none focus:border-primary transition-all"
              >
                <option value="">Todas las sedes</option>
                <option value="Madrid">Madrid</option>
                <option value="Zaragoza">Zaragoza</option>
                <option value="Málaga">Málaga</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-base">
                expand_more
              </span>
            </div>
          </div>

          {/* Submissions List Container */}
          <div className="space-y-3">
            {filteredPartners.length === 0 ? (
              <div className="border border-dashed border-outline-variant rounded-2xl p-12 text-center bg-white space-y-3">
                <span className="material-symbols-outlined text-outline text-5xl">folder_off</span>
                <p className="text-on-surface-variant font-medium font-sans">No se encontraron colaboradores registrados</p>
                <p className="text-xs text-outline font-sans max-w-sm mx-auto">
                  Complete un formulario de recogida de datos en la pestaña correspondiente para recibir la información en este espacio.
                </p>
              </div>
            ) : (
              filteredPartners.map((partner) => (
                <div 
                  key={partner.id}
                  className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
                    expandedId === partner.id ? 'border-primary shadow-sm' : 'border-outline-variant hover:border-outline hover:shadow-xs'
                  }`}
                >
                  {/* Item Header Header */}
                  <div 
                    onClick={() => setExpandedId(expandedId === partner.id ? null : partner.id)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-xl">domain</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-on-surface truncate font-sans">{partner.companyName}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="inline-flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded text-[10px] font-sans font-medium text-on-surface-variant">
                            <span className="material-symbols-outlined text-xs">location_on</span>
                            {partner.location}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded text-[10px] font-sans font-medium text-primary">
                            <span className="material-symbols-outlined text-xs">groups</span>
                            {partner.capacity} plazas
                          </span>
                          <span className="text-[10px] text-outline font-sans font-medium">{partner.submissionDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadExcel(partner);
                        }}
                        className="p-2 hover:bg-secondary-container hover:text-primary rounded-lg text-on-surface-variant transition-colors flex items-center justify-center"
                        title="Descargar Ficha Excel (.xlsx)"
                      >
                        <span className="material-symbols-outlined text-lg">download</span>
                      </button>
                      <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${
                        expandedId === partner.id ? 'rotate-180 text-primary' : ''
                      }`}>
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Expanded Body Content */}
                  {expandedId === partner.id && (
                    <div className="border-t border-outline-variant bg-surface-container-lowest p-5 space-y-4 font-sans text-xs md:text-sm text-on-surface success-animation">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 bg-white p-3 rounded-lg border border-outline-variant">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-outline block">ID de Registro</span>
                          <span className="font-mono text-xs font-semibold">{partner.id}</span>
                        </div>
                        <div className="space-y-1 bg-white p-3 rounded-lg border border-outline-variant">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-outline block">Perfil Solicitado</span>
                          <span className="font-semibold">{partner.profile}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 bg-white p-4 rounded-lg border border-outline-variant">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-outline block">Funciones a Desarrollar</span>
                        <p className="text-on-surface-variant leading-relaxed whitespace-pre-line text-xs font-medium">
                          {partner.functions}
                        </p>
                      </div>

                      <div className="space-y-1.5 bg-white p-4 rounded-lg border border-outline-variant">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-outline block">Competencias Requeridas</span>
                        <p className="text-on-surface-variant leading-relaxed whitespace-pre-line text-xs font-medium">
                          {partner.competencies}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Google Drive / Apps Script Setup (Colspan 4) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Settings Box */}
          <div className="bg-white border border-outline-variant rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-lg">settings</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-on-surface font-sans">Ajustes de Envío Automático</h3>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Vincule un webhook para recibir el archivo Excel por correo en sergiorubinlargo@gmail.com y opcionalmente en su Google Drive.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-on-surface block font-sans">
                  URL de Google Apps Script (Web App)
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={googleScriptUrl}
                  onChange={(e) => setGoogleScriptUrl(e.target.value)}
                  className="w-full h-9 px-3 border border-outline-variant rounded-lg bg-white text-on-surface font-sans text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingSettings}
                className={`w-full h-9 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  settingsSaved 
                    ? 'bg-green-600 text-white' 
                    : 'bg-on-surface text-white hover:bg-on-surface/90'
                }`}
              >
                {isSavingSettings ? (
                  <span>Guardando...</span>
                ) : settingsSaved ? (
                  <>
                    <span className="material-symbols-outlined text-sm">check</span>
                    <span>¡Enlace Guardado!</span>
                  </>
                ) : (
                  <span>Guardar enlace</span>
                )}
              </button>
            </form>
          </div>

          {/* Copy-paste Guide Box */}
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-xs text-on-surface font-sans flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">mail</span>
              Guía de envío de correo silencioso
            </h4>
            
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Para recibir las fichas Excel y los mensajes de soporte directamente en su correo <strong>srubin@bejob.com</strong> sin pedir permisos al usuario final, siga estos 3 sencillos pasos:
            </p>

            <ol className="list-decimal list-inside text-[11px] text-on-surface-variant space-y-1.5 pl-1 font-sans">
              <li>Abra <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline">Google Apps Script</a>.</li>
              <li>Cree un proyecto nuevo, pegue el código de abajo y haga clic en <strong>Guardar</strong>.</li>
              <li>Haga clic en <strong>Desplegar &gt; Nuevo despliegue</strong>, seleccione Tipo: <strong>Aplicación Web</strong>, Ejecutar como: <strong>Yo</strong> (su cuenta), Quién tiene acceso: <strong>Cualquiera</strong>. Copie la URL resultante y péguela arriba.</li>
            </ol>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider block font-sans">Código del Script:</span>
              <div className="relative">
                <pre className="p-2 bg-on-surface text-surface font-mono text-[9px] rounded-lg overflow-x-auto max-h-40 leading-normal select-all">
                  {appsScriptCode}
                </pre>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
