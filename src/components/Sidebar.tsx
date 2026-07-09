import React from 'react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col h-screen p-6 overflow-y-auto bg-white border-r border-outline-variant w-64 fixed left-0 top-0 pt-24 z-40">
      {/* Brand Header inside Sidebar */}
      <div className="mb-8">
        <h2 className="text-xl font-bold font-display text-primary tracking-tight">Portal de colaboradores</h2>
        <p className="text-xs text-on-surface-variant font-sans mt-1">Consola de Colaboración</p>
      </div>

      {/* Navigation list */}
      <nav className="space-y-2 flex-grow">
        <button
          onClick={() => setActiveTab('landing')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-sm font-medium ${
            activeTab === 'landing'
              ? 'bg-secondary-container text-primary font-bold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined">home</span>
          <span>Inicio</span>
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-sm font-medium ${
            activeTab === 'info'
              ? 'bg-secondary-container text-primary font-bold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined">info</span>
          <span>Propuesta de Valor</span>
        </button>

        <button
          onClick={() => setActiveTab('submission')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-sm font-medium ${
            activeTab === 'submission' || activeTab === 'success'
              ? 'bg-secondary-container text-primary font-bold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined">edit_note</span>
          <span>Recogida de Datos</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-sm font-medium ${
            activeTab === 'support'
              ? 'bg-secondary-container text-primary font-bold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined">help</span>
          <span>Soporte Técnico</span>
        </button>
      </nav>
    </aside>
  );
}
