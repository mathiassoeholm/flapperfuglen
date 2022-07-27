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

type Attributes = { [key: string]: EntityArgs };

function createScript<
  T extends {
    __name: string;
    attributes?: {
      [key: string]: EntityArgs;
    };
    prototype: PlayCanvasScript;
  }
>(ScriptClass: T) {
  const Script = pc.createScript("asffasd")!;
  if (ScriptClass.prototype.initialize) {
    Script.prototype.initialize = ScriptClass.prototype.initialize;
  }
  if (ScriptClass.prototype.update) {
    Script.prototype.update = ScriptClass.prototype.update;
  }
}

interface PlayCanvasScript {
  initialize?: pc.ScriptType["initialize"];
  update?: pc.ScriptType["update"];
}

type ThisType<T extends { attributes: Attributes }> = T extends {
  attributes: infer TAttributes;
}
  ? TAttributes extends { [key: string]: EntityArgs }
    ? T extends new () => infer Q
      ? {
          [K in keyof TAttributes]: EntityTypes[TAttributes[K]["type"]];
        } & ScriptType &
          Q
      : never
    : never
  : never;

type This = ThisType<typeof AddToScore>;

class AddToScore implements PlayCanvasScript {
  public static __name = "addToScore";

  public static attributes = {
    velocity: { type: "number" },
  } as const;

  constructor() {}

  public initialize(this: This) {}

  public update(this: This, dt: number) {}

  private reset() {}
}

createScript(AddToScore);
