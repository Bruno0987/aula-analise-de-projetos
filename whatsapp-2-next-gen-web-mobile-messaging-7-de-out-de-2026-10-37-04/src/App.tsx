/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Contact,
  UserProfile,
  AppSettings,
  Message,
} from './types/whatsapp';
import {
  INITIAL_USER_PROFILE,
  INITIAL_CONTACTS,
} from './utils/mockData';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { ProfileEditModal } from './components/ProfileEditModal';
import { ContactProfileModal } from './components/ContactProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { SnakeGameModal } from './components/SnakeGameModal';
import { BiometricLockModal } from './components/BiometricLockModal';
import { DeviceSimulatorFrame } from './components/DeviceSimulatorFrame';
import { sounds } from './utils/soundEffects';

const STORAGE_KEYS = {
  USER_PROFILE: 'wa2_user_profile_v1',
  CONTACTS: 'wa2_contacts_v1',
  SETTINGS: 'wa2_settings_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  themeColor: '#00A884',
  themeColorKey: 'cyber_emerald',
  themeColorName: 'WhatsApp 2 Esmeralda',
  themeMode: 'dark',
  fontFamily: 'Inter',
  fontSize: 'base',
  chatWallpaper: 'doodle',
  wallpaperOpacity: 0.15,
  biometricLocked: true, // Obligatory biometric authentication on initial launch
  biometricRequired: true,
  autoLockTime: 'immediate',
  deviceFrame: 'web_desktop',
  soundEnabled: true,
};

export default function App() {
  // 1. User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  // 2. Contacts & Chats State
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  });

  // 3. Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed, biometricLocked: true }; // Always locked on new session
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // 4. Active Navigation State
  const [activeContactId, setActiveContactId] = useState<string | null>('contact-1');
  const [isTyping, setIsTyping] = useState(false);

  // 5. Modal Visibility States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedContactForModal, setSelectedContactForModal] = useState<Contact | null>(null);
  const [isSnakeGameOpen, setIsSnakeGameOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Apply theme color & font dynamically via CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent-color', settings.themeColor);
    root.style.setProperty('--accent-hover', settings.themeColor);
    root.style.setProperty('--app-font', `'${settings.fontFamily}', sans-serif`);

    // Theme mode class management
    if (settings.themeMode === 'light') {
      root.classList.remove('dark', 'amoled');
    } else if (settings.themeMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('amoled');
    } else if (settings.themeMode === 'amoled') {
      root.classList.add('dark', 'amoled');
    }
  }, [settings.themeColor, settings.fontFamily, settings.themeMode]);

  // Handle Auto-lock on Window Blur / Tab change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && settings.autoLockTime === 'immediate') {
        setSettings(prev => ({ ...prev, biometricLocked: true }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [settings.autoLockTime]);

  // Active contact lookup
  const activeContact = contacts.find(c => c.id === activeContactId) || null;

  // Send message handler with simulated contact reply
  const handleSendMessage = (text: string, mediaUrl?: string) => {
    if (!activeContactId) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMessage: Message = {
      id: `m-user-${Date.now()}`,
      senderId: 'me',
      senderName: userProfile.name,
      text,
      timestamp: timeStr,
      status: 'sent',
      isMe: true,
      mediaUrl,
    };

    setContacts(prev =>
      prev.map(c => {
        if (c.id === activeContactId) {
          return {
            ...c,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    // Simulate contact typing and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyTime = new Date();
      const replyTimeStr = `${String(replyTime.getHours()).padStart(2, '0')}:${String(replyTime.getMinutes()).padStart(2, '0')}`;

      let replyText = 'Gostei muito da novidade! O WhatsApp 2 está incrível!';
      if (text.toLowerCase().includes('negrito') || text.toLowerCase().includes('*')) {
        replyText = 'Adorei a formatação em *negrito*! E você já testou o _itálico_ e o ~tachado~?';
      } else if (text.toLowerCase().includes('cor') || text.toLowerCase().includes('tema')) {
        replyText = 'Essa cor ficou linda no layout! Ficou muito moderno.';
      } else if (text.toLowerCase().includes('insta') || text.toLowerCase().includes('perfil')) {
        replyText = 'Vi suas conexões do Instagram e Facebook no seu perfil! Muito prático!';
      } else if (text.toLowerCase().includes('cobrinha') || text.toLowerCase().includes('snake')) {
        replyText = '🐍 O mini game da cobrinha é super viciante! Conseguiu quebrar o recorde?';
      }

      const replyMessage: Message = {
        id: `m-reply-${Date.now()}`,
        senderId: activeContactId,
        senderName: activeContact?.name || 'Contato',
        text: replyText,
        timestamp: replyTimeStr,
        status: 'read',
        isMe: false,
      };

      setContacts(prev =>
        prev.map(c => {
          if (c.id === activeContactId) {
            // Update my message to read and append reply
            const updatedMsgs = c.messages.map(m => (m.isMe ? { ...m, status: 'read' as const } : m));
            return {
              ...c,
              messages: [...updatedMsgs, replyMessage],
            };
          }
          return c;
        })
      );

      sounds.playReceive();
    }, 1400);
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <DeviceSimulatorFrame
      deviceMode={settings.deviceFrame}
      onChangeMode={mode => handleUpdateSettings({ deviceFrame: mode })}
      accentColor={settings.themeColor}
    >
      <div className="flex w-full h-full overflow-hidden select-none">
        {/* Sidebar (Chats List, Search, Profile button, Secret trigger) */}
        <div
          className={`${
            activeContactId && settings.deviceFrame !== 'web_desktop' ? 'hidden md:flex' : 'flex'
          } w-full md:w-auto h-full`}
        >
          <Sidebar
            contacts={contacts}
            activeContactId={activeContactId}
            onSelectContact={id => {
              setActiveContactId(id);
              // Clear unread count on select
              setContacts(prev =>
                prev.map(c => (c.id === id ? { ...c, unreadCount: 0 } : c))
              );
            }}
            userProfile={userProfile}
            onOpenProfileEdit={() => setIsProfileModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onTriggerBiometricLock={() => setSettings(prev => ({ ...prev, biometricLocked: true }))}
            onOpenSnakeGame={() => setIsSnakeGameOpen(true)}
            accentColor={settings.themeColor}
          />
        </div>

        {/* Chat Conversation View */}
        <div
          className={`${
            !activeContactId && settings.deviceFrame !== 'web_desktop' ? 'hidden md:flex' : 'flex'
          } flex-1 h-full`}
        >
          <ChatView
            contact={activeContact}
            onBackMobile={() => setActiveContactId(null)}
            onSendMessage={handleSendMessage}
            onOpenContactProfile={contact => setSelectedContactForModal(contact)}
            onOpenSnakeGame={() => setIsSnakeGameOpen(true)}
            accentColor={settings.themeColor}
            chatWallpaper={settings.chatWallpaper}
            fontSize={settings.fontSize}
            isTyping={isTyping}
          />
        </div>
      </div>

      {/* Mandatory Biometric Lock Screen */}
      <BiometricLockModal
        isOpen={settings.biometricLocked}
        onUnlock={() => setSettings(prev => ({ ...prev, biometricLocked: false }))}
        accentColor={settings.themeColor}
      />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={updated => setUserProfile(updated)}
        accentColor={settings.themeColor}
      />

      {/* Contact Profile Full Card Modal */}
      <ContactProfileModal
        contact={selectedContactForModal}
        isOpen={!!selectedContactForModal}
        onClose={() => setSelectedContactForModal(null)}
        accentColor={settings.themeColor}
      />

      {/* Settings Modal (Fonts, Color theme, AMOLED mode, Biometrics, Secret button) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onTriggerBiometricLock={() => {
          setIsSettingsModalOpen(false);
          setSettings(prev => ({ ...prev, biometricLocked: true }));
        }}
        onOpenSnakeGame={() => {
          setIsSettingsModalOpen(false);
          setIsSnakeGameOpen(true);
        }}
      />

      {/* Secret Snake Arcade Game Modal */}
      <SnakeGameModal
        isOpen={isSnakeGameOpen}
        onClose={() => setIsSnakeGameOpen(false)}
        accentColor={settings.themeColor}
      />
    </DeviceSimulatorFrame>
  );
}
