const defaultValue = {
  score: 0,
  otherThing: false,
  username: undefined as string | undefined,
} as const;

type Key = keyof typeof defaultValue;
type Value<K extends Key> = typeof defaultValue[K];

export interface Storage {
  setItem<K extends Key>(key: K, value: Value<K>): void;
  getItem<K extends Key>(key: K): Value<K>;
}
