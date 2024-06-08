export interface SnackNotificationOpts {
  text: string;
  color?: 'danger' | 'warn' | 'success' | 'info';
  closeText?: string;
  onCloseAction?: () => void;
}
