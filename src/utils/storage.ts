import { Preferences } from '@capacitor/preferences';

export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
    try {
      await Preferences.set({ key, value });
    } catch {
      // ignore
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      const { value } = await Preferences.get({ key });
      if (value !== null && value !== undefined) {
        return value;
      }
    } catch {
      // ignore
    }
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    try {
      await Preferences.remove({ key });
    } catch {
      // ignore
    }
  }
};
