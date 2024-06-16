import type { LocalStorageKeys } from '@/types/storage';
import { isEmpty } from 'lodash';

class ClientStorage {
  getItem = (key: LocalStorageKeys): string =>
    JSON.parse(localStorage.getItem(key) || '{}');

  setItem = (key: string, value: unknown) =>
    localStorage.setItem(key, JSON.stringify(value));

  hasItem = (key: LocalStorageKeys): boolean => !isEmpty(this.getItem(key));

  removeItem = localStorage.removeItem;

  clear = localStorage.clear();
}

/** Instance designed to help simplify client storage usage */
export default new ClientStorage();
