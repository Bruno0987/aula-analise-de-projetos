import React from 'react';
import {
  X,
  Instagram,
  Facebook,
  Twitter,
  Github,
  Linkedin,
  Phone,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { Contact } from '../types/whatsapp';
import { AvatarWithFrame } from './AvatarWithFrame';

interface ContactProfileModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

export const ContactProfileModal: React.FC<ContactProfileModalProps> = ({
  contact,
  isOpen,
  onClose,
  accentColor,
}) => {
  if (!isOpen || !contact) return null;

  const social = contact.socialConnections || { instagram: '', facebook: '' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col relative">
        {/* Close Button Floating */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Banner Cover */}
        <div
          className="h-32 w-full bg-cover bg-center relative"
          style={
            contact.bannerUrl
              ? { backgroundImage: `url(${contact.bannerUrl})` }
              : { background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)' }
          }
        >
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Profile Header Bar */}
        <div className="px-6 pb-6 pt-0 relative -mt-12 flex flex-col items-center text-center">
          <AvatarWithFrame
            src={contact.avatar}
            alt={contact.name}
            frameId={contact.avatarFrame || 'none'}
            isGif={contact.isAvatarGif}
            size="xl"
            isOnline={contact.isOnline}
            className="shadow-xl"
          />

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-3">
            {contact.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
            @{contact.username}
          </p>

          <p className="text-xs text-slate-600 dark:text-zinc-300 mt-2 px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 max-w-sm">
            "{contact.statusText}"
          </p>

          {/* Social Connections Section */}
          <div className="w-full mt-5 text-left border-t border-slate-100 dark:border-zinc-800 pt-4">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2.5 flex items-center gap-1.5">
              <span>Conexões Sociais Verificadas</span>
            </h4>

            <div className="grid grid-cols-1 gap-2">
              {social.instagram && (
                <a
                  href={`https://instagram.com/${social.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/15 border border-pink-500/20 text-pink-700 dark:text-pink-300 transition group text-xs font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span>Instagram</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-pink-600 dark:text-pink-400">
                    <span>@{social.instagram}</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </div>
                </a>
              )}

              {social.facebook && (
                <a
                  href={`https://facebook.com/${social.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-blue-700 dark:text-blue-300 transition group text-xs font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>Facebook</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400">
                    <span>/{social.facebook}</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </div>
                </a>
              )}

              {social.github && (
                <a
                  href={`https://github.com/${social.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-750 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 transition group text-xs font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    <span>github.com/{social.github}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              )}

              {social.linkedin && (
                <a
                  href={`https://linkedin.com/in/${social.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 transition group text-xs font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    <span>LinkedIn</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    <span>linkedin.com/in/{social.linkedin}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              )}

              {social.twitter && (
                <a
                  href={`https://x.com/${social.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 transition group text-xs font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-sky-500" />
                    <span>X / Twitter</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    <span>@{social.twitter}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Contact Details & Encryption info */}
          <div className="w-full mt-4 text-left border-t border-slate-100 dark:border-zinc-800 pt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 text-slate-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>Telefone:</span>
              </span>
              <span className="font-mono text-slate-900 dark:text-white font-medium">{contact.phone}</span>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
              <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-[11px]">
                As mensagens e chamadas são protegidas com a criptografia de ponta a ponta do WhatsApp 2.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
