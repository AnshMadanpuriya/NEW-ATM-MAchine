import React from 'react';
import { CreditCard, Terminal, Monitor, Key, RefreshCw } from 'lucide-react';

interface AtmHeaderProps {
  viewMode: 'kiosk' | 'terminal';
  setViewMode: (mode: 'kiosk' | 'terminal') => void;
  onQuickFill: () => void;
  onReset: () => void;
  isAuthenticated: boolean;
}

export const AtmHeader: React.FC<AtmHeaderProps> = ({
  viewMode,
  setViewMode,
  onQuickFill,
  onReset,
}) => {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              ATM MACHINE
              <span className="text-xs font-normal px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Java Port
              </span>
            </h1>
            <p className="text-xs text-slate-400">AnshMadanpuriya ATM System</p>
          </div>
        </div>

        {/* Credentials Pill */}
        <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs">
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Default Auth:</span>
          <span className="font-mono text-amber-300 font-semibold">12345</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">PIN:</span>
          <span className="font-mono text-amber-300 font-semibold">11111</span>
          <button
            onClick={onQuickFill}
            title="Auto fill credentials"
            className="ml-1 text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
          >
            Auto-fill
          </button>
        </div>

        {/* View mode toggle & Reset */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('kiosk')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'kiosk'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>ATM Kiosk</span>
            </button>
            <button
              onClick={() => setViewMode('terminal')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'terminal'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Java CLI Terminal</span>
            </button>
          </div>

          <button
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            title="Reset ATM state"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
