class ClientStorage {
  getItem = (key: string) => JSON.parse(localStorage.getItem(key) || '{}');

  setItem = (key: string, value: unknown) =>
    localStorage.setItem(key, JSON.stringify(value));

  hasItem = (key: string) => Boolean(this.getItem(key));

  removeItem = localStorage.removeItem;

  clear = localStorage.clear();
}

/** Instance designed to help simplify client storage usage */
export default new ClientStorage();
