import type { LocalStorageKeys, StoredValues } from '@/types/storage';
import { isEmpty, isNull } from 'lodash';

class ClientStorage {
  getItem = (key: LocalStorageKeys) => {
    const storedValue = localStorage.getItem(key);
    if (isNull(storedValue)) {
      return storedValue;
    }

    const parsedValue = JSON.parse(storedValue);
    return isEmpty(parsedValue) ? null : parsedValue;
  };

  setItem = <K extends LocalStorageKeys>(key: K, value: StoredValues[K]) =>
    localStorage.setItem(key, JSON.stringify(value));

  hasItem = (key: LocalStorageKeys): boolean => !isEmpty(this.getItem(key));

  removeItem = (key: LocalStorageKeys) => localStorage.removeItem(key);

  clear = localStorage.clear;
}

/** Instance designed to help simplify client storage usage */
export default new ClientStorage();
