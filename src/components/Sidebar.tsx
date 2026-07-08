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

        <button
          onClick={() => setActiveTab('inbox')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-sm font-medium ${
            activeTab === 'inbox'
              ? 'bg-secondary-container text-primary font-bold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined">inbox</span>
          <span>Bandeja de Entrada</span>
        </button>
      </nav>

      {/* Quick Status / Identity Info */}
      <div className="pt-6 border-t border-outline-variant text-xs space-y-2 text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="font-medium">Sesión Activa</span>
        </div>
        <p className="font-mono text-[10px] text-outline">v1.2.4 • Producción</p>
      </div>
    </aside>
  );
}
