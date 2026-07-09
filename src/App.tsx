import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { PartnerData, SupportTicket, ActiveTab, Toast } from './types';
import { SAMPLE_PARTNERS, SAMPLE_TICKETS } from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import LandingView from './components/LandingView';
import SubmissionForm from './components/SubmissionForm';
import SuccessView from './components/SuccessView';
import SupportView from './components/SupportView';
import InfoView from './components/InfoView';
import ToastContainer from './components/ToastContainer';
import { initAuth, googleSignIn, logout } from './lib/googleAuth';
import { savePartnerSubmission, loadPartnerSubmissions, saveSupportTicket } from './lib/db';
import { generateExcelBlob } from './lib/googleDrive';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [partners, setPartners] = useState<PartnerData[]>(SAMPLE_PARTNERS);
  const [tickets, setTickets] = useState<SupportTicket[]>(SAMPLE_TICKETS);
  const [lastSubmittedPartner, setLastSubmittedPartner] = useState<PartnerData | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };


  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    
    // Load initial partners from Firestore/local cache
    refreshPartners();

    return () => unsubscribe();
  }, []);

  const refreshPartners = async () => {
    try {
      const fetched = await loadPartnerSubmissions();
      if (fetched && fetched.length > 0) {
        setPartners(fetched);
      } else {
        // Save initial samples to LocalStorage so they appear
        SAMPLE_PARTNERS.forEach(p => {
          const localData = localStorage.getItem('partners_cache');
          const existing: PartnerData[] = localData ? JSON.parse(localData) : [];
          if (!existing.some(x => x.id === p.id)) {
            localStorage.setItem('partners_cache', JSON.stringify([p, ...existing]));
          }
        });
        setPartners(SAMPLE_PARTNERS);
      }
    } catch (err) {
      console.error('Failed to load partners', err);
      setPartners(SAMPLE_PARTNERS);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
      }
    } catch (error) {
      console.error("Error al conectar con Google Drive", error);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setGoogleUser(null);
      setGoogleToken(null);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  // Form Submission Handlers
  const handlePartnerSubmit = async (newPartnerData: Omit<PartnerData, 'id' | 'submissionDate'>) => {
    try {
      const formattedDate = new Date().toISOString().split('T')[0];
      const generatedId = `PART-${String(partners.length + 1).padStart(3, '0')}`;
      
      const completePartner: PartnerData = {
        ...newPartnerData,
        id: generatedId,
        submissionDate: formattedDate,
      };

      // 1. Trigger database save in the background (runs asynchronously, returns instantly)
      savePartnerSubmission(completePartner).catch(err => {
        console.error('Error in background database save:', err);
      });

      // 2. Refresh main listing in memory instantly
      setPartners([completePartner, ...partners]);
      
      // 3. Save last submitted data to preview on Success screen
      setLastSubmittedPartner(completePartner);

      // 4. Transition to Success view immediately so the user can download Excel/PDF files
      setActiveTab('success');
      showToast(`¡Formulario recibido con éxito! Generando ficha y procesando envíos en segundo plano...`, 'info');

      // 5. Generate Excel and process both Email and Formspree submissions in the background
      const excelBlob = generateExcelBlob(completePartner);
      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          const base64String = (reader.result as string).split(',')[1];
          const cleanCompanyName = completePartner.companyName.trim().replace(/[^a-zA-Z0-9]/g, '_');
          const dateString = new Date().toISOString().split('T')[0];
          const fileName = `Ficha_Colaborador_${cleanCompanyName}_${dateString}.xlsx`;

          // A. Send to srubin@bejob.com via our server API (Background Task)
          fetch('/api/send-partner', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              partner: completePartner,
              excelBase64: base64String,
              fileName
            })
          }).then(async (response) => {
            if (response.ok) {
              console.log('Email sent successfully in background!');
              showToast(`¡Ficha de colaborador enviada correctamente a srubin@bejob.com!`, 'success');
            } else {
              const resText = await response.text();
              console.warn('Backend email API returned warning/error:', resText);
              showToast(`Ficha registrada localmente. Pendiente de sincronización de correo.`, 'info');
            }
          }).catch(err => {
            console.error('SMTP email fetch failed:', err);
          });

          // B. Send to Formspree endpoint (Background Task)
          const formspreePayload = {
            "Nombre de la empresa": completePartner.companyName,
            "Descripción de la empresa": completePartner.companyDescription,
            "Persona de contacto principal": completePartner.contactPerson,
            "Cargo": completePartner.contactRole,
            "Email de contacto": completePartner.contactEmail,
            "Teléfono de contacto": completePartner.contactPhone,
            "Participaciones en el programa": completePartner.participations.map((p, idx) => 
              `CENTRO DE TRABAJO #${idx + 1}\n` +
              `- Ubicación Exacta: ${p.locationExact}\n` +
              `- Perfil Solicitado: ${p.profile}\n` +
              `- Nº Plazas de Prácticas: ${p.slotsCount}\n` +
              `- Funciones: ${p.functions}\n` +
              `- Competencias: ${p.competencies}`
            ).join("\n\n====================\n\n"),
            "Fecha de registro": completePartner.submissionDate,
            "ID de registro": completePartner.id
          };

          fetch('https://formspree.io/f/xlgyyojj', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(formspreePayload)
          }).then(async (response) => {
            if (response.ok) {
              console.log('Formspree submission sent successfully!');
              showToast(`¡Copia del formulario registrada con éxito en Formspree!`, 'success');
            } else {
              console.warn('Formspree returned non-OK status');
            }
          }).catch(formspreeErr => {
            console.error('Error submitting to Formspree:', formspreeErr);
          });

        } catch (err) {
          console.error('Error in background reader processing:', err);
        }
      };

      reader.onerror = () => {
        console.error('Error reading generated Excel file in background');
      };
      
      reader.readAsDataURL(excelBlob);
      return true;
    } catch (err: any) {
      console.error('Error en el envío:', err);
      showToast(`Error al enviar los datos: ${err.message || 'Inténtelo de nuevo.'}`, 'error');
      throw err;
    }
  };

  const handleTicketSubmit = (newTicketData: Omit<SupportTicket, 'id' | 'submissionDate' | 'status'>) => {
    try {
      const formattedDate = new Date().toISOString().split('T')[0];
      const generatedId = `TCK-${String(tickets.length + 1).padStart(3, '0')}`;

      const completeTicket: SupportTicket = {
        ...newTicketData,
        id: generatedId,
        submissionDate: formattedDate,
        status: 'Pending',
      };

      // 1. Save to database / cache in the background
      saveSupportTicket(completeTicket).catch(err => {
        console.error('Error saving support ticket to DB in background:', err);
      });

      // 2. Update local state list instantly
      setTickets([completeTicket, ...tickets]);

      // 3. Show instant toast notification
      showToast('¡Mensaje de soporte recibido con éxito! Procesando envío por correo...', 'info');

      // 4. Send support mail in the background
      fetch('/api/send-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ticket: completeTicket
        })
      }).then(async (response) => {
        if (response.ok) {
          console.log('Support email sent successfully in background!');
          showToast('¡Su mensaje de soporte se ha enviado correctamente por correo a srubin@bejob.com!', 'success');
        } else {
          const resText = await response.text();
          console.warn('Support mail API returned non-ok status:', resText);
          showToast('Mensaje registrado localmente. Pendiente de sincronización de correo.', 'info');
        }
      }).catch(err => {
        console.error('Failed to post support message to API in background:', err);
      });

    } catch (err: any) {
      console.error('Error al crear ticket:', err);
      showToast(`Error al procesar el mensaje de soporte: ${err.message || 'Inténtelo de nuevo.'}`, 'error');
    }
  };

  const handleResetForm = () => {
    setLastSubmittedPartner(null);
    setActiveTab('submission');
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans">
      
      {/* Top Main Navigation Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Body Layout Grid */}
      <div className="flex-grow flex">
        
        {/* Persistent Desktop Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Canvas Area */}
        <main className="flex-grow pt-24 lg:ml-64 min-h-[80vh] flex flex-col justify-between">
          <div className="max-w-[960px] mx-auto w-full px-4 md:px-8 py-6 flex-grow">
            
            {/* Conditional Tab Rendering */}
            {activeTab === 'landing' && (
              <LandingView setActiveTab={setActiveTab} />
            )}

            {activeTab === 'info' && (
              <InfoView setActiveTab={setActiveTab} />
            )}

            {activeTab === 'submission' && (
              <SubmissionForm 
                onSubmit={handlePartnerSubmit} 
                setActiveTab={setActiveTab} 
              />
            )}

            {activeTab === 'success' && (
              <SuccessView 
                submittedData={lastSubmittedPartner} 
                onReset={handleResetForm} 
                setActiveTab={setActiveTab} 
              />
            )}

            {activeTab === 'support' && (
              <SupportView onSubmitTicket={handleTicketSubmit} setActiveTab={setActiveTab} />
            )}

          </div>

          {/* Persistent Footer */}
          <Footer setActiveTab={setActiveTab} />
        </main>
        
      </div>

      {/* Toast Notifications Overlay */}
      <ToastContainer 
        toasts={toasts} 
        onClose={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} 
      />

    </div>
  );
}
