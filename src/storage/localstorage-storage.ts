import { StorageWithoutDefaults, withDefaultValues } from "./storage-models";

const storageWithoutDefaults: StorageWithoutDefaults = {
  async setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  async getItem(key) {
    const item = localStorage.getItem(key);
    if (item === null) {
      return undefined;
    }

    return JSON.parse(item);
  },
};

export const storage = withDefaultValues(storageWithoutDefaults);
