// User Types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  website?: string;
  github?: string;
  twitter?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  totalComponents: number;
  totalLikes: number;
  followers: number;
  following: number;
}

// Component Types
export interface Component {
  id: string;
  title: string;
  description: string;
  code: string;
  previewImage: string;
  thumbnailImage?: string;
  category: ComponentCategory;
  tags: string[];
  framework: Framework;
  language: 'typescript' | 'javascript';
  styling: StylingFramework;
  dependencies: string[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  likes: number;
  views: number;
  copies: number;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  sourceType: 'custom' | 'bootstrap' | 'flowbite' | 'radix' | 'shadcn' | 'material-ui' | 'chakra' | 'ant-design';
  sourceUrl?: string;
  livePreviewUrl?: string;
  installCommand?: string;
  usageInstructions?: string;
}

// Collection Types
export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  userId: string;
  userName: string;
  componentIds: string[];
  isPublic: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

// Favorite Types
export interface Favorite {
  id: string;
  userId: string;
  componentId: string;
  createdAt: Date;
}

// Comment Types
export interface Comment {
  id: string;
  componentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  replies: Reply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  createdAt: Date;
}

// Category Types
export type ComponentCategory =
  | 'button'
  | 'card'
  | 'form'
  | 'input'
  | 'navigation'
  | 'modal'
  | 'table'
  | 'layout'
  | 'chart'
  | 'authentication'
  | 'dashboard'
  | 'ecommerce'
  | 'landing-page'
  | 'animation'
  | 'icon'
  | 'badge'
  | 'alert'
  | 'dropdown'
  | 'tooltip'
  | 'slider'
  | 'progress'
  | 'skeleton'
  | 'other';

export type Framework =
  | 'react'
  | 'next'
  | 'vue'
  | 'angular'
  | 'svelte'
  | 'vanilla';

export type StylingFramework =
  | 'tailwind'
  | 'css'
  | 'scss'
  | 'styled-components'
  | 'emotion'
  | 'css-modules';

// Activity Types
export interface Activity {
  id: string;
  userId: string;
  type: 'upload' | 'like' | 'comment' | 'collection' | 'follow';
  targetId: string;
  targetType: 'component' | 'user' | 'collection';
  description: string;
  createdAt: Date;
}

// Follow Types
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

// Component Library Integration
export interface LibraryComponent {
  id: string;
  name: string;
  description: string;
  library: 'bootstrap' | 'flowbite' | 'radix' | 'shadcn' | 'material-ui' | 'chakra' | 'ant-design';
  category: ComponentCategory;
  docsUrl: string;
  installCommand: string;
  example: string;
  tags: string[];
  popularity: number;
  lastUpdated: Date;
}

// Statistics Types
export interface ComponentStats {
  componentId: string;
  dailyViews: { [date: string]: number };
  dailyLikes: { [date: string]: number };
  dailyCopies: { [date: string]: number };
  totalViews: number;
  totalLikes: number;
  totalCopies: number;
  updatedAt: Date;
}
