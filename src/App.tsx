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

      // 1. Save locally and to Firestore Cloud in the background
      await savePartnerSubmission(completePartner);

      // 2. Refresh main listing in memory
      setPartners([completePartner, ...partners]);
      
      // 3. Save last submitted data to preview on Success screen
      setLastSubmittedPartner(completePartner);

      // 4. Generate the Excel file and convert it to Base64 to send to our native backend API
      const excelBlob = generateExcelBlob(completePartner);

      const reader = new FileReader();
      const sendEmailPromise = new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64String = (reader.result as string).split(',')[1];
            const cleanCompanyName = completePartner.companyName.trim().replace(/[^a-zA-Z0-9]/g, '_');
            const dateString = new Date().toISOString().split('T')[0];
            const fileName = `Ficha_Colaborador_${cleanCompanyName}_${dateString}.xlsx`;

            const response = await fetch('/api/send-partner', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                partner: completePartner,
                excelBase64: base64String,
                fileName
              })
            });

            let resData: any = {};
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              resData = await response.json();
            } else {
              const text = await response.text();
              throw new Error(text || `Error del servidor (${response.status})`);
            }

            if (!response.ok) {
              throw new Error(resData.error || 'Error al enviar por correo');
            }
            resolve(true);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(new Error('Error al leer el archivo Excel'));
        reader.readAsDataURL(excelBlob);
      });

      // Wait for email delivery before notifying success, or run in background
      await sendEmailPromise;

      // Show beautiful toast notification instead of transition to success tab
      showToast(`¡Formulario enviado con éxito! Ficha de colaborador guardada y enviada directamente a srubin@bejob.com.`, 'success');
      return true;
    } catch (err: any) {
      console.error('Error en el envío:', err);
      showToast(`Error al enviar los datos: ${err.message || 'Inténtelo de nuevo.'}`, 'error');
      throw err;
    }
  };

  const handleTicketSubmit = async (newTicketData: Omit<SupportTicket, 'id' | 'submissionDate' | 'status'>) => {
    try {
      const formattedDate = new Date().toISOString().split('T')[0];
      const generatedId = `TCK-${String(tickets.length + 1).padStart(3, '0')}`;

      const completeTicket: SupportTicket = {
        ...newTicketData,
        id: generatedId,
        submissionDate: formattedDate,
        status: 'Pending',
      };

      await saveSupportTicket(completeTicket);
      setTickets([completeTicket, ...tickets]);

      // Call our native backend API route directly
      const response = await fetch('/api/send-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ticket: completeTicket
        })
      });

      let resData: any = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        resData = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Error del servidor (${response.status})`);
      }

      if (!response.ok) {
        throw new Error(resData.error || 'Error al enviar el mensaje de soporte');
      }

      showToast('¡Su mensaje de soporte se ha enviado correctamente por correo a srubin@bejob.com!', 'success');
    } catch (err: any) {
      console.error('Error al crear ticket:', err);
      showToast(`Error al enviar el mensaje de soporte: ${err.message || 'Inténtelo de nuevo.'}`, 'error');
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
