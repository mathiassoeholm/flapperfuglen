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

const createScript = <
  TAttributes extends {
    [key: string]: EntityArgs;
  }
>(
  name: string,
  {
    attributes,
    initialize,
    update,
  }: {
    attributes?: TAttributes;
    initialize?: (this: pc.ScriptType) => void;
    update?: (
      this: pc.ScriptType & {
        [K in keyof TAttributes]: EntityTypes[TAttributes[K]["type"]];
      },
      dt: number
    ) => void;
  } = {}
) => {
  var Script = pc.createScript(name)!;

  if (attributes) {
    Object.keys(attributes).forEach((a) =>
      Script.attributes.add(a, attributes![a])
    );
  }

  Script.prototype.initialize = function () {
    initialize?.call(this);
  };

  Script.prototype.update = function (dt) {
    update?.call(this, dt);
  };
};

let lastX = 0;

createScript("addToScore", {
  attributes: {
    bird: { type: "entity" },
    pos: { type: "vec4" },
  },
  initialize() {
    lastX = this.entity.getPosition().x;
  },
  update() {
    const app = this.app;
    const birdX = this.bird.getPosition().x;
    const pipeX = this.entity.getPosition().x;

    if (pipeX <= birdX && lastX > birdX) {
      app.fire("game:addscore");
    }
    lastX = pipeX;
  },
});
