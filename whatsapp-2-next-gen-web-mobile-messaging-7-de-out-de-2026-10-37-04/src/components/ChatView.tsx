import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  MoreVertical,
  Phone,
  Video,
  Search,
  CheckCheck,
  Check,
  ArrowLeft,
  Sparkles,
  Gamepad2,
  Trash2,
  User,
  Heart,
  ThumbsUp,
  Flame,
  Laugh,
} from 'lucide-react';
import { Contact, Message } from '../types/whatsapp';
import { AvatarWithFrame } from './AvatarWithFrame';
import { FormattingToolbar } from './FormattingToolbar';
import { FormattedText } from '../utils/textFormatter';
import { sounds } from '../utils/soundEffects';

interface ChatViewProps {
  contact: Contact | null;
  onBackMobile?: () => void;
  onSendMessage: (text: string, mediaUrl?: string) => void;
  onOpenContactProfile: (contact: Contact) => void;
  onOpenSnakeGame: () => void;
  accentColor: string;
  chatWallpaper: string;
  fontSize: 'sm' | 'base' | 'lg';
  isTyping?: boolean;
}

const QUICK_EMOJIS = ['😀', '😂', '🔥', '🚀', '🐍', '✨', '❤️', '👍', '🎉', '💡', '😎', '👀'];

export const ChatView: React.FC<ChatViewProps> = ({
  contact,
  onBackMobile,
  onSendMessage,
  onOpenContactProfile,
  onOpenSnakeGame,
  accentColor,
  chatWallpaper,
  fontSize,
  isTyping = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [contact?.messages, isTyping]);

  // Voice recording simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingAudio) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecordingAudio]);

  if (!contact) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-zinc-950 text-center select-none">
        <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-zinc-900 flex items-center justify-center mb-4 text-3xl shadow-inner">
          💬
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-200 mb-1">
          WhatsApp 2 para Web
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mb-4">
          Selecione uma conversa para começar a conversar com perfis customizados, atalhos de formatação e biometria ativa.
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-500 font-mono">
          <span>🔒 Criptografia de ponta a ponta</span>
          <span>•</span>
          <button
            onClick={onOpenSnakeGame}
            className="hover:text-emerald-500 transition underline flex items-center gap-1"
          >
            <span>🐍 Mini-Game Secreto</span>
          </button>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    // Secret Easter Egg check
    if (trimmed.toLowerCase() === '/snake' || trimmed.toLowerCase() === '/cobrinha') {
      onOpenSnakeGame();
      setInputText('');
      return;
    }

    sounds.playSend();
    onSendMessage(trimmed);
    setInputText('');
    setShowEmojiPicker(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceNoteComplete = () => {
    setIsRecordingAudio(false);
    onSendMessage(`🎤 Mensagem de voz (${recordingSeconds || 2}s)`);
    setRecordingSeconds(0);
    sounds.playSend();
  };

  const fontSizeClass =
    fontSize === 'sm' ? 'text-[13px]' : fontSize === 'lg' ? 'text-[16px]' : 'text-[14px]';

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-zinc-950 relative overflow-hidden">
      {/* Chat Top Header */}
      <div className="h-16 px-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back button for mobile */}
          {onBackMobile && (
            <button
              onClick={onBackMobile}
              className="md:hidden p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Avatar with Moldura */}
          <div
            onClick={() => onOpenContactProfile(contact)}
            className="cursor-pointer hover:opacity-90 transition shrink-0"
            title="Ver Perfil Completo com Redes Sociais"
          >
            <AvatarWithFrame
              src={contact.avatar}
              alt={contact.name}
              frameId={contact.avatarFrame || 'none'}
              isGif={contact.isAvatarGif}
              size="md"
              isOnline={contact.isOnline}
            />
          </div>

          {/* Contact Name & Status */}
          <div
            onClick={() => onOpenContactProfile(contact)}
            className="cursor-pointer min-w-0 flex-1"
          >
            <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate flex items-center gap-1.5">
              <span>{contact.name}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
              {isTyping ? (
                <span className="font-semibold" style={{ color: accentColor }}>
                  digitando...
                </span>
              ) : contact.isOnline ? (
                <span className="text-emerald-500 dark:text-emerald-400 font-medium">online</span>
              ) : (
                contact.lastSeen
              )}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-slate-600 dark:text-zinc-300">
          <button
            onClick={() => alert(`Chamada de vídeo simulada para ${contact.name}`)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            title="Chamada de vídeo"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert(`Chamada de voz simulada para ${contact.name}`)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            title="Chamada de voz"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => onOpenContactProfile(contact)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            title="Ver informações do contato"
          >
            <User className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowChatMenu(!showChatMenu)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showChatMenu && (
              <div className="absolute right-0 top-10 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-30 text-xs">
                <button
                  onClick={() => {
                    setShowChatMenu(false);
                    onOpenContactProfile(contact);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200"
                >
                  Ver Perfil & Redes
                </button>
                <button
                  onClick={() => {
                    setShowChatMenu(false);
                    onOpenSnakeGame();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between"
                >
                  <span>🐍 Jogo da Cobrinha</span>
                  <span className="text-[10px] bg-emerald-500/10 px-1.5 py-0.2 rounded font-mono">SECRET</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Thread Canvas */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-3 relative ${
          chatWallpaper === 'doodle' ? 'whatsapp-doodle-bg' : ''
        }`}
        style={
          chatWallpaper === 'cyber'
            ? {
                backgroundImage: `radial-gradient(rgba(0, 168, 132, 0.08) 1.5px, transparent 1.5px)`,
                backgroundSize: '24px 24px',
              }
            : {}
        }
      >
        {/* Encryption Safety Notice Pill */}
        <div className="flex justify-center my-2">
          <div className="max-w-md px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] text-center shadow-xs">
            🔒 As mensagens e chamadas são protegidas com criptografia de ponta a ponta no WhatsApp 2.
          </div>
        </div>

        {/* Message bubbles */}
        {contact.messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} group`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2 shadow-xs relative transition-all ${
                msg.isMe
                  ? 'text-white rounded-tr-xs'
                  : 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 rounded-tl-xs border border-slate-200/80 dark:border-zinc-800'
              }`}
              style={msg.isMe ? { backgroundColor: accentColor } : {}}
            >
              {/* Media image if present */}
              {msg.mediaUrl && (
                <div className="mb-2 rounded-xl overflow-hidden max-h-60">
                  <img
                    src={msg.mediaUrl}
                    alt="Mídia"
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Formatted Text Message */}
              <div className={fontSizeClass}>
                <FormattedText text={msg.text} />
              </div>

              {/* Footer Timestamp & Checkmarks */}
              <div
                className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none ${
                  msg.isMe ? 'text-white/80' : 'text-slate-400 dark:text-zinc-500'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.isMe && (
                  <span>
                    {msg.status === 'read' ? (
                      <CheckCheck className="w-3.5 h-3.5 text-sky-300 drop-shadow-xs" />
                    ) : msg.status === 'delivered' ? (
                      <CheckCheck className="w-3.5 h-3.5" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator bubble */}
        {isTyping && (
          <div className="flex items-start">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl rounded-tl-xs px-4 py-2.5 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Formatting Shortcuts Toolbar */}
      <FormattingToolbar
        textareaRef={textareaRef}
        setText={setInputText}
        accentColor={accentColor}
      />

      {/* Emoji Picker Row Overlay */}
      {showEmojiPicker && (
        <div className="p-2.5 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto select-none animate-in fade-in">
          <span className="text-xs text-slate-400 font-semibold px-1">Emojis:</span>
          {QUICK_EMOJIS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setInputText(prev => prev + emoji);
                textareaRef.current?.focus();
              }}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-lg transition active:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Box Footer Bar */}
      <div className="p-3 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-end gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition ${
            showEmojiPicker ? 'text-emerald-500' : 'text-slate-500 dark:text-zinc-400'
          }`}
          title="Emojis e Reações"
        >
          <Smile className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => {
            // Quick sample image sender simulation
            onSendMessage('📸 Foto compartilhada via WhatsApp 2', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80');
          }}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition"
          title="Anexar foto ou arquivo"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Input Area */}
        <div className="flex-1 bg-slate-100 dark:bg-zinc-800 rounded-2xl px-4 py-2 flex items-center min-h-[44px]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={e => {
              setInputText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder="Mensagem (use *negrito*, _itálico_, ou digite /snake para o jogo)..."
            className="w-full bg-transparent resize-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none max-h-32 leading-relaxed"
          />
        </div>

        {/* Voice Note or Send Button */}
        {inputText.trim() ? (
          <button
            type="button"
            onClick={handleSend}
            className="w-11 h-11 rounded-full text-white flex items-center justify-center shadow-md transition active:scale-90 shrink-0"
            style={{ backgroundColor: accentColor }}
            title="Enviar mensagem"
          >
            <Send className="w-5 h-5 -mr-0.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (isRecordingAudio) {
                handleVoiceNoteComplete();
              } else {
                setIsRecordingAudio(true);
                setRecordingSeconds(0);
              }
            }}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition active:scale-95 shrink-0 ${
              isRecordingAudio
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300'
            }`}
            title={isRecordingAudio ? 'Parar e enviar áudio' : 'Gravar áudio simulado'}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
