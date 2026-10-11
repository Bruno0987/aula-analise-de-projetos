import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Link2,
  Instagram,
  Facebook,
  Twitter,
  Github,
  Linkedin,
  Upload,
  Check,
  User,
  Phone,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { UserProfile, AvatarFrameId, SocialConnections } from '../types/whatsapp';
import { AvatarWithFrame } from './AvatarWithFrame';
import { AVATAR_FRAMES, PRESET_AVATARS, PRESET_BANNERS } from '../utils/mockData';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  accentColor: string;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  accentColor,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'frame' | 'banner' | 'social'>('profile');
  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });
  const [showSavedToast, setShowSavedToast] = useState(false);

  const fileInputAvatarRef = useRef<HTMLInputElement | null>(null);
  const fileInputBannerRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData(prev => ({
          ...prev,
          avatarUrl: reader.result as string,
          isAvatarGif: isGif,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData(prev => ({
          ...prev,
          bannerUrl: reader.result as string,
          bannerType: 'image',
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSocialChange = (key: keyof SocialConnections, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialConnections: {
        ...prev.socialConnections,
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    onSaveProfile(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" style={{ color: accentColor }} />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Editar Perfil WhatsApp 2
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 px-6 bg-slate-50/50 dark:bg-zinc-950/40 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={activeTab === 'profile' ? { borderColor: accentColor, color: accentColor } : {}}
          >
            <User className="w-3.5 h-3.5" />
            <span>Dados & Foto</span>
          </button>

          <button
            onClick={() => setActiveTab('frame')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'frame'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={activeTab === 'frame' ? { borderColor: accentColor, color: accentColor } : {}}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Moldura da Foto</span>
          </button>

          <button
            onClick={() => setActiveTab('banner')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'banner'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={activeTab === 'banner' ? { borderColor: accentColor, color: accentColor } : {}}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Plano de Fundo</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'social'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={activeTab === 'social' ? { borderColor: accentColor, color: accentColor } : {}}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Conexões Sociais</span>
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live Card Preview Banner & Avatar */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm bg-slate-100 dark:bg-zinc-950">
            {/* Banner Preview */}
            <div
              className="h-28 w-full bg-cover bg-center transition-all relative"
              style={
                formData.bannerType === 'image'
                  ? { backgroundImage: `url(${formData.bannerUrl})` }
                  : { background: formData.bannerGradient || 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)' }
              }
            >
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Profile Bar with Avatar */}
            <div className="px-5 pb-4 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="flex items-end gap-3.5 -mt-10">
                <AvatarWithFrame
                  src={formData.avatarUrl}
                  alt={formData.name}
                  frameId={formData.frameId}
                  isGif={formData.isAvatarGif}
                  size="xl"
                  showBadge={false}
                />
                <div className="mb-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {formData.name || 'Seu Nome'}
                    </h3>
                    <BadgeCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                    @{formData.username || 'usuario'}
                  </p>
                </div>
              </div>

              {/* Social badges mini bar in preview */}
              <div className="flex items-center gap-2 text-xs">
                {formData.socialConnections.instagram && (
                  <span className="flex items-center gap-1 px-2 py-0.8 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-[11px] font-medium">
                    <Instagram className="w-3 h-3" />
                    <span>@{formData.socialConnections.instagram}</span>
                  </span>
                )}
                {formData.socialConnections.facebook && (
                  <span className="flex items-center gap-1 px-2 py-0.8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px] font-medium">
                    <Facebook className="w-3 h-3" />
                    <span>/{formData.socialConnections.facebook}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* TAB 1: Profile Data & Avatar Photo */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                  Foto de Perfil (Suporta arquivos estáticos ou GIF animado)
                </label>

                {/* Hidden File Input */}
                <input
                  ref={fileInputAvatarRef}
                  type="file"
                  accept="image/*,.gif"
                  onChange={handleAvatarFileUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputAvatarRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-800 dark:text-white transition"
                  >
                    <Upload className="w-4 h-4 text-emerald-500" />
                    <span>Carregar Foto ou GIF do Computador</span>
                  </button>

                  <span className="text-xs text-slate-400">ou escolha uma opção rápida:</span>
                </div>

                {/* Preset Avatars & GIFs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-3">
                  {PRESET_AVATARS.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          avatarUrl: preset.url,
                          isAvatarGif: preset.isGif,
                        }))
                      }
                      className={`flex flex-col items-center p-2 rounded-xl border text-center transition ${
                        formData.avatarUrl === preset.url
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                          : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <AvatarWithFrame
                        src={preset.url}
                        alt={preset.name}
                        isGif={preset.isGif}
                        size="sm"
                        showBadge={false}
                      />
                      <span className="text-[10px] font-medium text-slate-700 dark:text-zinc-300 mt-1 line-clamp-1">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Nome de Exibição</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome"
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Nome de Usuário (@handle)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400">@</span>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="usuario"
                      className="w-full text-xs py-2.5 pl-7 pr-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Recado / Status</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.about}
                  onChange={e => setFormData(prev => ({ ...prev, about: e.target.value }))}
                  placeholder="Sobre você..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Número de Telefone</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+55 11 99999-9999"
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Pronomes
                  </label>
                  <input
                    type="text"
                    value={formData.pronouns || ''}
                    onChange={e => setFormData(prev => ({ ...prev, pronouns: e.target.value }))}
                    placeholder="Ex: Ele/Dele ou Ela/Dela"
                    className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Molduras de Foto */}
          {activeTab === 'frame' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Moldura da Foto do Perfil
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                  Escolha um efeito dinâmico ou aura luminosa ao redor da sua foto.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {AVATAR_FRAMES.map(frame => (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, frameId: frame.id }))}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition ${
                      formData.frameId === frame.id
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <AvatarWithFrame
                      src={formData.avatarUrl}
                      alt={frame.name}
                      frameId={frame.id}
                      isGif={formData.isAvatarGif}
                      size="sm"
                      showBadge={false}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {frame.name}
                        </span>
                        {formData.frameId === frame.id && (
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                        {frame.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Plano de Fundo (Banner) */}
          {activeTab === 'banner' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Plano de Fundo do Perfil (Capa/Banner)
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                  Personalize o topo do seu perfil com imagens ou gradientes modernos.
                </p>
              </div>

              {/* Upload custom banner */}
              <input
                ref={fileInputBannerRef}
                type="file"
                accept="image/*"
                onChange={handleBannerFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputBannerRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-800 dark:text-white transition"
              >
                <Upload className="w-4 h-4 text-emerald-500" />
                <span>Carregar Imagem de Fundo do Computador</span>
              </button>

              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-2">
                  Planos de Fundo e Gradientes Predefinidos:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESET_BANNERS.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          bannerType: b.type,
                          bannerUrl: b.url || '',
                          bannerGradient: b.gradient || '',
                        }))
                      }
                      className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 hover:border-emerald-500 text-left p-3 flex items-center justify-between transition"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition"
                        style={
                          b.type === 'image'
                            ? { backgroundImage: `url(${b.url})` }
                            : { background: b.gradient }
                        }
                      />
                      <div className="relative z-10 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-white text-xs font-semibold">
                        {b.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Conexões Sociais (Instagram, Facebook, etc.) */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Conexões e Redes Sociais
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
                  Preencha suas contas do Instagram, Facebook e outras redes para exibir no seu perfil do WhatsApp 2.
                </p>
              </div>

              {/* Instagram */}
              <div className="p-3.5 rounded-2xl border border-pink-200 dark:border-pink-900/40 bg-pink-50/30 dark:bg-pink-950/10 space-y-1.5">
                <label className="text-xs font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1.5">
                  <Instagram className="w-4 h-4" />
                  <span>Instagram (@usuário)</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">instagram.com/</span>
                  <input
                    type="text"
                    value={formData.socialConnections.instagram || ''}
                    onChange={e => handleSocialChange('instagram', e.target.value)}
                    placeholder="seu_usuario"
                    className="flex-1 text-xs py-2 px-3 rounded-xl border border-pink-300 dark:border-pink-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
                  />
                </div>
              </div>

              {/* Facebook */}
              <div className="p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/10 space-y-1.5">
                <label className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <Facebook className="w-4 h-4" />
                  <span>Facebook (usuário ou ID)</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">facebook.com/</span>
                  <input
                    type="text"
                    value={formData.socialConnections.facebook || ''}
                    onChange={e => handleSocialChange('facebook', e.target.value)}
                    placeholder="seu_perfil"
                    className="flex-1 text-xs py-2 px-3 rounded-xl border border-blue-300 dark:border-blue-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Twitter / X */}
              <div className="p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Twitter className="w-4 h-4 text-sky-500" />
                  <span>X / Twitter</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">x.com/</span>
                  <input
                    type="text"
                    value={formData.socialConnections.twitter || ''}
                    onChange={e => handleSocialChange('twitter', e.target.value)}
                    placeholder="username"
                    className="flex-1 text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* GitHub */}
              <div className="p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">github.com/</span>
                  <input
                    type="text"
                    value={formData.socialConnections.github || ''}
                    onChange={e => handleSocialChange('github', e.target.value)}
                    placeholder="username"
                    className="flex-1 text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div className="p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <span>LinkedIn</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">linkedin.com/in/</span>
                  <input
                    type="text"
                    value={formData.socialConnections.linkedin || ''}
                    onChange={e => handleSocialChange('linkedin', e.target.value)}
                    placeholder="seu-perfil"
                    className="flex-1 text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            {showSavedToast ? <Check className="w-4 h-4" /> : null}
            <span>{showSavedToast ? 'Perfil Salvo!' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
