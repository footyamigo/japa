// Web storage utility to replace AsyncStorage
// Uses localStorage for web compatibility

export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('[Storage] Error getting item:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('[Storage] Error setting item:', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('[Storage] Error removing item:', error);
    }
  },
};

