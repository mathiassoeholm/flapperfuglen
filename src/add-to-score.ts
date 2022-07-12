type EntityArgs = Parameters<pc.ScriptAttributes["add"]>[1];

const createScript = <
  TAttributes extends {
    [key: string]: EntityArgs;
  }
>(
  name: string,
  create: () => {
    attributes?: TAttributes;
    initialize?: (this: pc.ScriptType) => void;
    update?: (this: pc.ScriptType, dt: number) => void;
  }
) => {
  var Script = pc.createScript(name)!;

  const script = create();

  if (script.attributes) {
    Object.keys(script.attributes).forEach((a) =>
      Script.attributes.add(a, script.attributes![a])
    );
  }

  Script.prototype.initialize = function () {
    script.initialize?.call(this);
  };

  Script.prototype.update = function (dt) {
    script.update?.call(this, dt);
  };
};

createScript("addToScore", () => {
  let lastX = 0;

  return {
    attributes: {
      bird: { type: "entity" },
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
  };
});
