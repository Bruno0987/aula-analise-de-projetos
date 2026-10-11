import React, { useState } from 'react';
import {
  X,
  Type,
  Palette,
  Moon,
  Sun,
  Shield,
  Smartphone,
  Check,
  Eye,
  Lock,
  Gamepad2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { AppSettings, FontFamilyType, ThemeColorKey } from '../types/whatsapp';
import { PRESET_THEMES } from '../utils/mockData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onTriggerBiometricLock: () => void;
  onOpenSnakeGame: () => void;
}

const FONTS: { family: FontFamilyType; name: string; category: string; preview: string }[] = [
  { family: 'Inter', name: 'Inter (WhatsApp 2)', category: 'Moderna & Limpa', preview: 'Conversas rápidas e claras no WhatsApp 2' },
  { family: 'Roboto', name: 'Roboto', category: 'Android Clássico', preview: 'A experiência original do sistema Android' },
  { family: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', category: 'Design Geométrico', preview: 'Elegância minimalista em cada mensagem' },
  { family: 'Poppins', name: 'Poppins', category: 'Amigável & Arredondada', preview: 'Visual descontraído e moderno' },
  { family: 'JetBrains Mono', name: 'JetBrains Mono', category: 'Tech Monospace', preview: 'console.log("Olá, WhatsApp 2!");' },
  { family: 'Playfair Display', name: 'Playfair Display', category: 'Serif Sofisticado', preview: 'Elegância e alta tipografia editorial' },
  { family: 'Press Start 2P', name: 'Press Start 2P', category: 'Pixel Retro 8-Bit', preview: 'COBRINHA 100 PTS' },
  { family: 'Orbitron', name: 'Orbitron', category: 'Futurista Sci-Fi', preview: 'PROTOCOLO WHATSAPP 2.0 ONLINE' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onTriggerBiometricLock,
  onOpenSnakeGame,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'typography' | 'security' | 'system'>('appearance');
  const [customHex, setCustomHex] = useState(settings.themeColor);

  if (!isOpen) return null;

  const handleCustomHexChange = (hex: string) => {
    setCustomHex(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onUpdateSettings({
        themeColor: hex,
        themeColorKey: 'custom',
        themeColorName: 'Cor Customizada',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" style={{ color: settings.themeColor }} />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Configurações do WhatsApp 2
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 px-6 bg-slate-50/50 dark:bg-zinc-950/40 gap-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'appearance'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={activeTab === 'appearance' ? { borderColor: settings.themeColor, color: settings.themeColor } : {}}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Cores & Tema</span>
          </button>

          <button
            onClick={() => setActiveTab('typography')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'typography'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={activeTab === 'typography' ? { borderColor: settings.themeColor, color: settings.themeColor } : {}}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Fontes do Sistema</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={activeTab === 'security' ? { borderColor: settings.themeColor, color: settings.themeColor } : {}}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Biometria & Segurança</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'system'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={activeTab === 'system' ? { borderColor: settings.themeColor, color: settings.themeColor } : {}}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Dispositivo & Web</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CORES & TEMA */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Dark / Light / AMOLED Mode */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Modo de Exibição
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                  Suporte nativo a modo escuro e economia de bateria em telas AMOLED.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ themeMode: 'light' })}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      settings.themeMode === 'light'
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Claro</span>
                    <span className="text-[10px] text-slate-400">Padrão diurno</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ themeMode: 'dark' })}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      settings.themeMode === 'dark'
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Escuro</span>
                    <span className="text-[10px] text-slate-400">Cinza escuro nativo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ themeMode: 'amoled' })}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      settings.themeMode === 'amoled'
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-black border border-zinc-700" />
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">AMOLED</span>
                    <span className="text-[10px] text-slate-400">Preto puro 000000</span>
                  </button>
                </div>
              </div>

              {/* Layout Color Customization */}
              <div className="border-t border-slate-100 dark:border-zinc-800 pt-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Cor Customizável do WhatsApp 2
                  </h3>
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: settings.themeColor }}
                  >
                    {settings.themeColor}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                  Escolha entre os tons exclusivos do WhatsApp 2 ou defina sua cor preferida:
                </p>

                {/* Preset chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_THEMES.map(theme => (
                    <button
                      key={theme.key}
                      type="button"
                      onClick={() =>
                        onUpdateSettings({
                          themeColor: theme.hex,
                          themeColorKey: theme.key,
                          themeColorName: theme.name,
                        })
                      }
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                        settings.themeColor.toLowerCase() === theme.hex.toLowerCase()
                          ? 'border-slate-800 dark:border-white shadow-xs ring-1 ring-slate-800 dark:ring-white'
                          : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: theme.hex }}
                      />
                      <span className="text-xs font-medium text-slate-800 dark:text-zinc-200 truncate">
                        {theme.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom Color Input & Hex Field */}
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <label className="relative cursor-pointer">
                      <input
                        type="color"
                        value={settings.themeColor}
                        onChange={e => handleCustomHexChange(e.target.value)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                      <div
                        className="w-9 h-9 rounded-xl border-2 border-white dark:border-zinc-900 shadow-md flex items-center justify-center cursor-pointer transition hover:scale-105"
                        style={{ backgroundColor: settings.themeColor }}
                      >
                        <Eye className="w-3.5 h-3.5 text-white/90 drop-shadow" />
                      </div>
                    </label>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-white block">
                        Seletor Hexadecimal Livre
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Clique no quadrado colorido para abrir o seletor visual
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 font-bold">HEX:</span>
                    <input
                      type="text"
                      maxLength={7}
                      value={customHex}
                      onChange={e => handleCustomHexChange(e.target.value)}
                      placeholder="#00A884"
                      className="w-24 text-xs py-1.5 px-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Wallpaper Pattern */}
              <div className="border-t border-slate-100 dark:border-zinc-800 pt-5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Papel de Parede do Chat
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                  Fundo das mensagens de texto.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['doodle', 'dark_neon', 'cyber', 'minimal'] as const).map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => onUpdateSettings({ chatWallpaper: style })}
                      className={`p-2.5 rounded-xl border text-center capitalize text-xs font-semibold transition ${
                        settings.chatWallpaper === style
                          ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                          : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      {style === 'doodle' ? 'Doodle WhatsApp' : style === 'dark_neon' ? 'Neon Tech' : style === 'cyber' ? 'Circuito Cyber' : 'Minimalista'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FONTES DO SISTEMA */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Fonte Global do Aplicativo
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                  Altere a tipografia de todo o WhatsApp 2 em tempo real.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {FONTS.map(f => (
                  <button
                    key={f.family}
                    type="button"
                    onClick={() => onUpdateSettings({ fontFamily: f.family })}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition ${
                      settings.fontFamily === f.family
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white" style={{ fontFamily: f.family }}>
                          {f.name}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                          {f.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1" style={{ fontFamily: f.family }}>
                        {f.preview}
                      </p>
                    </div>

                    {settings.fontFamily === f.family && (
                      <Check className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>

              {/* Font Size Selector */}
              <div className="border-t border-slate-100 dark:border-zinc-800 pt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 mb-2">
                  Tamanho da Fonte das Mensagens
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['sm', 'base', 'lg'] as const).map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onUpdateSettings({ fontSize: sz })}
                      className={`py-2 px-3 rounded-xl border text-center text-xs font-semibold transition ${
                        settings.fontSize === sz
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                          : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      {sz === 'sm' ? 'Pequena (13px)' : sz === 'base' ? 'Padrão (14px)' : 'Grande (16px)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BIOMETRIA & SEGURANÇA */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Autenticação Biométrica Obrigatória
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                  Conforme os requisitos do WhatsApp 2, a biometria nativa protege suas conversas contra acessos não autorizados.
                </p>
              </div>

              {/* Biometrics Status Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-sm">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Biometria Obrigatória: ATIVADA</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-300 mt-0.5">
                      WebAuthn • Touch ID, Face ID ou Impressão Digital Android
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onTriggerBiometricLock}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Bloquear Agora</span>
                </button>
              </div>

              {/* Auto lock options */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  Tempo de Bloqueio Automático
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ autoLockTime: 'immediate' })}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      settings.autoLockTime === 'immediate'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 font-bold text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    Imediatamente ao sair
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ autoLockTime: '1m' })}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      settings.autoLockTime === '1m'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 font-bold text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    Após 1 minuto
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DISPOSITIVO & WEB */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Compatibilidade de Sistema & Acesso Web
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                  Verificação dos requisitos técnicos do WhatsApp 2:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Android 10+ (Requisito Mínimo)
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Compatível: APIs de Biometria e Notificações Push suportadas.
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded">
                    HOMOLOGADO
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        iOS Acima do iPhone 10 (iPhone X / iOS 14+)
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Compatível: Face ID Neural Engine e WebKit Moderno.
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded">
                    HOMOLOGADO
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Acesso Livre pela Web (WhatsApp 2 Web)
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Totalmente funcional em navegadores modernos sem restrições.
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-500/10 text-blue-500 font-bold px-2 py-0.5 rounded">
                    ATIVO
                  </span>
                </div>
              </div>

              {/* Secret Button Section in Settings */}
              <div className="border-t border-slate-100 dark:border-zinc-800 pt-5">
                <div className="p-3.5 rounded-2xl bg-zinc-950 text-white border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🐍</span>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Protocolo Cobrinha 2.0 (Botão Secreto)
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Acesse o clássico mini-game escondido diretamente aqui!
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSnakeGame();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition active:scale-95"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Jogar Agora</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-500">
            <span>WhatsApp 2 Build 2.4.0</span>
            <span>•</span>
            <button
              onClick={() => {
                onClose();
                onOpenSnakeGame();
              }}
              className="text-[11px] hover:text-emerald-500 transition underline underline-offset-2 flex items-center gap-0.5"
              title="Acesso Secreto: Jogo da Cobrinha"
            >
              <span>🐍 Cobrinha</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition active:scale-95"
            style={{ backgroundColor: settings.themeColor }}
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
