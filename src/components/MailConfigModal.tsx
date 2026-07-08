import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MailConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function MailConfigModal({ isOpen, onClose }: MailConfigModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] border border-outline-variant"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">mail</span>
                <h3 className="font-display font-extrabold text-lg text-on-surface">
                  Configuración del Correo Nativo (SMTP)
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-on-surface-variant hover:bg-surface-container-high p-1.5 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow font-sans text-sm text-on-surface-variant">
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <p className="font-semibold text-emerald-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  ¡Servidor Nativo Activado!
                </p>
                <p className="leading-relaxed text-xs text-emerald-700">
                  Hemos eliminado por completo la dependencia de Google Apps Script u otros servicios externos de terceros. Ahora, el propio servidor Node.js (backend) de tu aplicación se conecta directamente a tu servidor de correo preferido para enviar las fichas Excel y los mensajes a <strong>srubin@bejob.com</strong>.
                </p>
              </div>

              {/* Required Secrets Instructions */}
              <div className="space-y-3">
                <h4 className="font-bold text-on-surface text-sm">Cómo configurar tu servidor de correo:</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Para que la aplicación pueda enviar los correos electrónicamente, debes configurar las siguientes variables de entorno seguras (Secrets) en el panel de configuración lateral/superior de AI Studio (o en tu archivo <code>.env</code>):
                </p>

                <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-surface-container-high text-on-surface font-semibold border-b border-outline-variant">
                        <th className="p-3">Variable (Secret Key)</th>
                        <th className="p-3">Descripción</th>
                        <th className="p-3">Ejemplo (Gmail)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      <tr>
                        <td className="p-3 font-mono font-bold text-primary">SMTP_HOST</td>
                        <td className="p-3">Servidor de correo saliente.</td>
                        <td className="p-3 font-mono text-outline">smtp.gmail.com</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-primary">SMTP_PORT</td>
                        <td className="p-3">Puerto seguro (TLS/SSL).</td>
                        <td className="p-3 font-mono text-outline">587 o 465</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-primary">SMTP_USER</td>
                        <td className="p-3">Tu cuenta de correo electrónico.</td>
                        <td className="p-3 font-mono text-outline">usuario@gmail.com</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-primary">SMTP_PASS</td>
                        <td className="p-3">Tu Contraseña de Aplicación de Google o clave de correo.</td>
                        <td className="p-3 font-mono text-outline">abcd efgh ijkl mnop</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-primary">SMTP_FROM_NAME</td>
                        <td className="p-3">Nombre visible del remitente (opcional).</td>
                        <td className="p-3 font-mono text-outline">BeJob Portal</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Instructions for Gmail App Password */}
              <div className="space-y-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
                <p className="font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Nota para cuentas Gmail / Outlook:
                </p>
                <p>
                  Si usas una cuenta de Gmail, no introduzcas tu contraseña normal de acceso. Por seguridad, debes activar la "Verificación en 2 pasos" en tu cuenta de Google y generar una <strong>"Contraseña de aplicación"</strong> de 16 caracteres. Utiliza esa contraseña de aplicación de 16 letras en la variable <strong>SMTP_PASS</strong>.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-outline-variant flex justify-end bg-surface-container-lowest">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all shadow-sm text-xs"
              >
                Entendido, Continuar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
