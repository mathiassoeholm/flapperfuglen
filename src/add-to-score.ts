import { createScript } from "./create-script";

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

function createScript2<
  T extends { __name: string; prototype: PlayCanvasScript }
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

class AddToScore implements PlayCanvasScript {
  public static __name = "addToScore";
  public initialize() {}
  public update = (dt) => {};
}

createScript2(AddToScore);
