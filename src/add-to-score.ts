import { createScript } from "./create-script";

createScript("addToScore", {
  fields: {
    lastX: 0,
  },
  attributes: {
    bird: { type: "entity" },
  },
  initialize() {
    this.lastX = this.entity.getPosition().x;
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
