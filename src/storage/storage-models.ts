const defaultValue = {
  score: 0,
  otherThing: false,
  username: "",
  timeStarted: null as Date | null,
};

type Key = keyof typeof defaultValue;
type Value<K extends Key> = typeof defaultValue[K];

export interface StorageWithoutDefaults {
  setItem<K extends Key>(key: K, value: Value<K>): void;
  getItem<K extends Key>(key: K): Value<K> | undefined;
}

export interface Storage extends StorageWithoutDefaults {
  getItem<K extends Key>(key: K): Value<K>;
}

export const withDefaultValues = (
  storage: StorageWithoutDefaults
): Storage => ({
  ...storage,
  getItem(key) {
    const item = storage.getItem(key);
    if (item === undefined) {
      return defaultValue[key];
    }

    return item;
  },
});
