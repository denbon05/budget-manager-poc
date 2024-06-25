import type { GoogleOAuthRedirectQuery } from './auth';

export interface StoredGDrive {
  id: string;
}

export type StoredValues = {
  isSideBarVisible: boolean;
  isDarkThemeEnabled: boolean;
  google: GoogleOAuthRedirectQuery;
  isGDriveFolderDetected: boolean;
  gDriveFolder: StoredGDrive;
};

export type LocalStorageKeys = keyof StoredValues;
