import type { Entity, ScriptType, Vec2, Vec3, Vec4 } from "playcanvas";

type EntityArgs = Parameters<pc.ScriptAttributes["add"]>[1];
interface EntityTypes {
  boolean: boolean;
  number: number;
  string: string;
  json: null;
  asset: null;
  entity: Entity;
  rgb: null;
  rgba: null;
  vec2: Vec2;
  vec3: Vec3;
  vec4: Vec4;
  curve: null;
}

export type ThisType<T> = T extends new (...args: any[]) => infer Q
  ? (T extends { attrib: infer TAttributes }
      ? TAttributes extends { [key: string]: EntityArgs }
        ? {
            [K in keyof TAttributes]: EntityTypes[TAttributes[K]["type"]];
          }
        : {}
      : {}) &
      ScriptType &
      Q
  : never;

/**
 * Decorator used to register a Script class.
 *
 * @param name The chosen name for the script, usually just camelCase version of the ClassName.
 */
export function registerScript(name: string) {
  return function <
    T extends typeof ScriptType & {
      attrib?: { [key: string]: EntityArgs };
    }
  >(Script: T) {
    pc.registerScript(Script, name);

    const attributes = Script.attrib;
    if (attributes) {
      Object.keys(attributes).forEach((key) => {
        Script.attributes.add(key, attributes[key]);
      });
    }
  };
}
