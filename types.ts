export enum AppId {
  SETTINGS = 'settings',
  FILES = 'files',
  BROWSER = 'browser',
  MEDIA = 'media'
}

export interface AppConfig {
  id: AppId;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}