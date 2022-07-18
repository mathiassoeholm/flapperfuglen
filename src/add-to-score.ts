import { Entity, Vec2, Vec3, Vec4 } from "playcanvas";

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

type This<
  TFields extends {
    [key: string]: any;
  },
  TAttributes extends {
    [key: string]: EntityArgs;
  }
> = pc.ScriptType & {
  [K in keyof TAttributes]: EntityTypes[TAttributes[K]["type"]];
} & TFields;

const createScript = <
  TFields extends {
    [key: string]: any;
  },
  TAttributes extends {
    [key: string]: EntityArgs;
  }
>(
  name: string,
  {
    fields,
    attributes,
    initialize,
    update,
  }: {
    fields?: TFields;
    attributes?: TAttributes;
    initialize?: (this: This<TFields, TAttributes>) => void;
    update?: (this: This<TFields, TAttributes>, dt: number) => void;
  } = {}
) => {
  var Script = pc.createScript(name)!;

  if (attributes) {
    Object.keys(attributes).forEach((a) =>
      Script.attributes.add(a, attributes![a])
    );
  }

  Script.prototype.initialize = function (this: This<TFields, TAttributes>) {
    if (fields) {
      Object.keys(fields).forEach(
        (f: keyof TFields) => ((this as any)[f] = fields[f])
      );
    }
    initialize?.call(this);
  };

  Script.prototype.update = function (this: This<TFields, TAttributes>, dt) {
    update?.call(this, dt);
  };
};

createScript("addToScore", {
  fields: {
    lastX: 0,
  },
  attributes: {
    bird: { type: "entity" },
    pos: { type: "vec4" },
  },
  initialize() {
    this.lastX = this.entity.getPosition().x;
    console.log(this.pos);
  },
  update() {
    const app = this.app;
    const birdX = this.bird.getPosition().x;
    const pipeX = this.entity.getPosition().x;

    if (pipeX <= birdX && this.lastX > birdX) {
      app.fire("game:addscore");
    }
    this.lastX = pipeX;
  },
});
