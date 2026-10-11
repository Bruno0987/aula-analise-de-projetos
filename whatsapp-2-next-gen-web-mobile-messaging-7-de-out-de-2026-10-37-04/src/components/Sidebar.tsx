import React, { useState } from 'react';
import {
  Search,
  Settings,
  Lock,
  MessageSquarePlus,
  CircleDot,
  CheckCheck,
  Check,
  ShieldAlert,
  Sparkles,
  Gamepad2,
  Filter,
} from 'lucide-react';
import { Contact, UserProfile } from '../types/whatsapp';
import { AvatarWithFrame } from './AvatarWithFrame';

interface SidebarProps {
  contacts: Contact[];
  activeContactId: string | null;
  onSelectContact: (id: string) => void;
  userProfile: UserProfile;
  onOpenProfileEdit: () => void;
  onOpenSettings: () => void;
  onTriggerBiometricLock: () => void;
  onOpenSnakeGame: () => void;
  accentColor: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  contacts,
  activeContactId,
  onSelectContact,
  userProfile,
  onOpenProfileEdit,
  onOpenSettings,
  onTriggerBiometricLock,
  onOpenSnakeGame,
  accentColor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'favorites' | 'groups'>('all');
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [secretToast, setSecretToast] = useState<string | null>(null);

  // Easter egg: Clicking WhatsApp 2 header 5 times activates the snake game!
  const handleTitleClick = () => {
    const nextCount = secretClickCount + 1;
    setSecretClickCount(nextCount);

    if (nextCount >= 5) {
      setSecretToast('🐍 PROTOCOLO COBRINHA ATIVADO!');
      setSecretClickCount(0);
      setTimeout(() => {
        setSecretToast(null);
        onOpenSnakeGame();
      }, 700);
    } else if (nextCount >= 2) {
      setSecretToast(`Easter egg: ${5 - nextCount} toques restantes...`);
      setTimeout(() => setSecretToast(null), 1200);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'unread') return contact.unreadCount > 0;
    if (activeFilter === 'favorites') return contact.isPinned;
    if (activeFilter === 'groups') return contact.name.includes('Grupo') || contact.name.includes('Comunidade');

    return true;
  });

  return (
    <div className="w-full md:w-80 lg:w-96 flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 select-none shrink-0 relative">
      {/* Top Header */}
      <div className="h-16 px-4 bg-slate-50/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between z-10 shrink-0">
        {/* User profile avatar trigger */}
        <div
          onClick={onOpenProfileEdit}
          className="flex items-center gap-2 cursor-pointer group"
          title="Editar Meu Perfil (Foto, GIF, Moldura, Conexões)"
        >
          <AvatarWithFrame
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            frameId={userProfile.frameId}
            isGif={userProfile.isAvatarGif}
            size="md"
            showBadge={false}
            className="group-hover:opacity-90 transition"
          />
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate max-w-[100px]">
              {userProfile.name}
            </span>
            <span className="text-[10px] text-emerald-500 font-mono">Editar perfil</span>
          </div>
        </div>

        {/* WhatsApp 2 Interactive Title (With 5-click easter egg counter) */}
        <div className="relative">
          <button
            type="button"
            onClick={handleTitleClick}
            className="text-center group focus:outline-none"
            title="Clique 5 vezes para o segredo!"
          >
            <div className="flex items-center gap-1 justify-center">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white group-hover:scale-105 transition-transform">
                WhatsApp
              </span>
              <span
                className="font-black text-xs px-1.5 py-0.2 rounded-md text-white shadow-xs"
                style={{ backgroundColor: accentColor }}
              >
                2.0
              </span>
            </div>
            <span className="text-[9px] text-slate-400 block font-mono -mt-0.5">
              Next-Gen
            </span>
          </button>

          {/* Floating Easter Egg Toast */}
          {secretToast && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-zinc-950 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-emerald-500 shadow-xl animate-bounce">
              {secretToast}
            </div>
          )}
        </div>

        {/* Top Action Icons */}
        <div className="flex items-center gap-0.5 text-slate-600 dark:text-zinc-300">
          <button
            type="button"
            onClick={onTriggerBiometricLock}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition text-emerald-600 dark:text-emerald-400"
            title="Bloquear aplicativo (Biometria Obrigatória)"
          >
            <Lock className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition"
            title="Configurações (Cores, Fontes e Segurança)"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-3 bg-white dark:bg-zinc-900 shrink-0">
        <div className="relative flex items-center bg-slate-100 dark:bg-zinc-800/80 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500/50 transition">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Pesquisar ou começar uma nova conversa"
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 ml-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto select-none">
          {(
            [
              { key: 'all', label: 'Tudo' },
              { key: 'unread', label: 'Não lidas' },
              { key: 'favorites', label: 'Favoritos' },
              { key: 'groups', label: 'Grupos' },
            ] as const
          ).map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
                activeFilter === filter.key
                  ? 'text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
              style={activeFilter === filter.key ? { backgroundColor: accentColor } : {}}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts & Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/60">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">
            Nenhuma conversa encontrada.
          </div>
        ) : (
          filteredContacts.map(contact => {
            const lastMsg = contact.messages[contact.messages.length - 1];
            const isSelected = contact.id === activeContactId;

            return (
              <div
                key={contact.id}
                onClick={() => onSelectContact(contact.id)}
                className={`flex items-center gap-3 px-3.5 py-3 cursor-pointer transition ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-zinc-800/80 border-l-4'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-850'
                }`}
                style={isSelected ? { borderLeftColor: accentColor } : {}}
              >
                {/* Contact Avatar with Moldura */}
                <AvatarWithFrame
                  src={contact.avatar}
                  alt={contact.name}
                  frameId={contact.avatarFrame || 'none'}
                  isGif={contact.isAvatarGif}
                  size="md"
                  isOnline={contact.isOnline}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-zinc-100 truncate">
                      {contact.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono shrink-0 ml-1">
                      {lastMsg?.timestamp || ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 dark:text-zinc-400 truncate pr-2 flex items-center gap-1">
                      {lastMsg?.isMe && (
                        <span>
                          {lastMsg.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-sky-400 inline" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-slate-400 inline" />
                          )}
                        </span>
                      )}
                      <span className="truncate">{lastMsg?.text || 'Sem mensagens'}</span>
                    </p>

                    {/* Unread Badge */}
                    {contact.unreadCount > 0 && (
                      <span
                        className="px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white shrink-0 min-w-[18px] text-center"
                        style={{ backgroundColor: accentColor }}
                      >
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Non-obvious Secret Button in Sidebar Footer (Requirement 5) */}
      <div className="p-2.5 px-3 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span className="truncate">Android 10+ / iOS 17 • WebAuthn</span>
        </div>

        {/* SECRET BUTTON: Non-obvious innocent-looking glyph button */}
        <button
          type="button"
          onClick={onOpenSnakeGame}
          className="group relative p-1 rounded-md text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition flex items-center gap-1"
          title="Protocolo Serpentina Secreto"
          aria-label="Secret Snake Trigger"
        >
          <span className="text-[10px] opacity-40 group-hover:opacity-100 font-mono transition">
            [~]
          </span>
          <span className="opacity-0 group-hover:opacity-100 text-[10px] text-emerald-500 font-mono transition">
            🐍
          </span>
        </button>
      </div>
    </div>
  );
};
