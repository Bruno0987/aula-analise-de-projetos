import React from 'react';
import { Monitor, Smartphone, Tablet, ShieldCheck } from 'lucide-react';

interface DeviceSimulatorFrameProps {
  deviceMode: 'web_desktop' | 'iphone' | 'android';
  onChangeMode: (mode: 'web_desktop' | 'iphone' | 'android') => void;
  accentColor: string;
  children: React.ReactNode;
}

export const DeviceSimulatorFrame: React.FC<DeviceSimulatorFrameProps> = ({
  deviceMode,
  onChangeMode,
  accentColor,
  children,
}) => {
  return (
    <div className="flex flex-col h-screen w-screen bg-slate-200 dark:bg-zinc-950 overflow-hidden">
      {/* Top Utility Bar for Device Simulator Mode & System Specs */}
      <header className="h-10 px-4 bg-slate-900 text-white flex items-center justify-between z-30 shrink-0 text-xs border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>WhatsApp 2</span>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">v2.4.0</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-zinc-400 border-l border-zinc-700 pl-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compatibilidade: Android 10+ | iOS 14+ (iPhone X+) | Web Livre</span>
          </div>
        </div>

        {/* Device Switcher Segmented Control */}
        <div className="flex items-center gap-1 bg-zinc-800 p-0.5 rounded-lg">
          <button
            onClick={() => onChangeMode('web_desktop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              deviceMode === 'web_desktop'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Acesso Web Livre (WhatsApp Web)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Web Livre</span>
          </button>

          <button
            onClick={() => onChangeMode('iphone')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              deviceMode === 'iphone'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="iPhone 14 Pro (iOS 17+)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">iPhone iOS</span>
          </button>

          <button
            onClick={() => onChangeMode('android')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              deviceMode === 'android'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Galaxy S24 (Android 14+)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Android 10+</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex items-center justify-center p-0 md:p-3 bg-slate-200 dark:bg-black/90">
        {deviceMode === 'web_desktop' ? (
          // Full Web Desktop Frame
          <div className="w-full h-full md:rounded-2xl md:border md:border-slate-300 md:dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col bg-white dark:bg-zinc-900">
            {children}
          </div>
        ) : deviceMode === 'iphone' ? (
          // iPhone 14 Pro Mockup Frame
          <div className="w-full max-w-[400px] h-full max-h-[820px] rounded-[48px] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl shadow-black/80 flex flex-col overflow-hidden relative ring-1 ring-zinc-700">
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-2.5 pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-950/60" />
            </div>

            {/* Inner Phone Screen */}
            <div className="flex-1 w-full h-full overflow-hidden flex flex-col pt-3 bg-white dark:bg-zinc-900">
              {children}
            </div>

            {/* Home Indicator Bar */}
            <div className="h-4 bg-transparent flex items-center justify-center pointer-events-none">
              <span className="w-28 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full" />
            </div>
          </div>
        ) : (
          // Samsung Galaxy S24 Android Frame
          <div className="w-full max-w-[400px] h-full max-h-[820px] rounded-[38px] border-[8px] border-zinc-800 bg-zinc-850 shadow-2xl shadow-black/80 flex flex-col overflow-hidden relative ring-1 ring-zinc-700">
            {/* Punch hole camera */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-40 pointer-events-none flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            </div>

            {/* Screen */}
            <div className="flex-1 w-full h-full overflow-hidden flex flex-col pt-2 bg-white dark:bg-zinc-900">
              {children}
            </div>

            {/* Android Navigation Bar */}
            <div className="h-3 bg-transparent flex items-center justify-center pointer-events-none">
              <span className="w-20 h-0.5 bg-zinc-500 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
