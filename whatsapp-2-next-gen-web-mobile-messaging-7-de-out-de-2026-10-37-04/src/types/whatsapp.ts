export type ThemeColorKey = 
  | 'emerald' 
  | 'cyber_emerald' 
  | 'purple' 
  | 'blue' 
  | 'gold' 
  | 'crimson' 
  | 'teal' 
  | 'custom';

export type FontFamilyType = 
  | 'Inter'
  | 'Roboto'
  | 'Plus Jakarta Sans'
  | 'JetBrains Mono'
  | 'Playfair Display'
  | 'Poppins'
  | 'Press Start 2P'
  | 'Orbitron';

export type AvatarFrameId = 
  | 'none'
  | 'cyber'
  | 'gold'
  | 'rainbow'
  | 'pixel'
  | 'fire'
  | 'floral'
  | 'diamond'
  | 'hologram';

export interface SocialConnections {
  instagram: string;
  facebook: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  tiktok?: string;
  discord?: string;
}

export interface UserProfile {
  name: string;
  username: string;
  about: string;
  phone: string;
  avatarUrl: string;
  isAvatarGif: boolean;
  bannerUrl: string;
  bannerType: 'image' | 'gradient' | 'cyber';
  bannerGradient?: string;
  frameId: AvatarFrameId;
  socialConnections: SocialConnections;
  pronouns?: string;
  statusBadge?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isMe: boolean;
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
  reactions?: Record<string, number>;
  mediaUrl?: string;
  mediaType?: 'image' | 'gif';
}

export interface Contact {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isAvatarGif?: boolean;
  avatarFrame?: AvatarFrameId;
  bannerUrl?: string;
  isOnline: boolean;
  lastSeen: string;
  statusText: string;
  phone: string;
  unreadCount: number;
  socialConnections: SocialConnections;
  messages: Message[];
  isPinned?: boolean;
}

export interface AppSettings {
  themeColor: string;
  themeColorKey: ThemeColorKey;
  themeColorName: string;
  themeMode: 'light' | 'dark' | 'amoled';
  fontFamily: FontFamilyType;
  fontSize: 'sm' | 'base' | 'lg';
  chatWallpaper: 'doodle' | 'dark_neon' | 'cyber' | 'minimal';
  wallpaperOpacity: number;
  biometricLocked: boolean;
  biometricRequired: boolean;
  autoLockTime: 'immediate' | '1m' | '5m' | 'tab_blur';
  deviceFrame: 'web_desktop' | 'iphone' | 'android';
  soundEnabled: boolean;
}
