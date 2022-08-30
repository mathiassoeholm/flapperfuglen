const defaultValue = {
  score: 0,
  otherThing: false,
  username: "",
  timeStarted: null as Date | null,
};

type Key = keyof typeof defaultValue;
type Value<K extends Key> = typeof defaultValue[K];

export interface StorageWithoutDefaults {
  setItem<K extends Key>(key: K, value: Value<K>): Promise<void>;
  getItem<K extends Key>(key: K): Promise<Value<K> | undefined>;
}

export interface Storage extends StorageWithoutDefaults {
  getItem<K extends Key>(key: K): Promise<Value<K>>;
}

export const withDefaultValues = (
  storage: StorageWithoutDefaults
): Storage => ({
  ...storage,
  async getItem(key) {
    const item = await storage.getItem(key);
    if (item === undefined) {
      return defaultValue[key];
    }

    return item;
  },
});
