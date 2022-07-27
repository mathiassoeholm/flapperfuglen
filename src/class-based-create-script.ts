import { Entity, ScriptType, Vec2, Vec3, Vec4 } from "playcanvas";

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

export function createScript<
  T extends {
    __name: string;
    attributes?: {
      [key: string]: EntityArgs;
    };
    prototype: PlayCanvasScript;
  }
>(ScriptClass: T) {
  const Script = pc.createScript(ScriptClass.__name)!;
  if (ScriptClass.attributes) {
    Object.keys(ScriptClass.attributes).forEach((a) =>
      Script.attributes.add(a, ScriptClass.attributes![a])
    );
  }

  if (ScriptClass.prototype.initialize) {
    Script.prototype.initialize = ScriptClass.prototype.initialize;
  }

  if (ScriptClass.prototype.update) {
    Script.prototype.update = ScriptClass.prototype.update;
  }
}

export interface PlayCanvasScript {
  initialize?: pc.ScriptType["initialize"];
  update?: pc.ScriptType["update"];
}

export type ThisType<T> = T extends {
  attributes: infer TAttributes;
} & (new () => infer Q)
  ? TAttributes extends { [key: string]: EntityArgs }
    ? {
        [K in keyof TAttributes]: EntityTypes[TAttributes[K]["type"]];
      } & ScriptType &
        Q
    : never
  : never;
