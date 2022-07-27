import { GraphNode, Quat, Vec3 } from "playcanvas";
import { createScript } from "./create-script";

type State = "getready" | "play" | "dead";
const initialState: State = "getready";

createScript("bird", {
  attributes: {
    flapVelocity: { type: "number", default: 1 },
    gravity: { type: "number", default: 5 },
    lowestHeight: { type: "number", default: -0.25 },
    radius: { type: "number", default: 0.068 },
  },
  fields: {
    velocity: 0,
    state: initialState as State,
    paused: false,
    circle: { x: 0, y: 0, r: 0 },
    rect: { x: 0, y: 0, w: 0, h: 0 },
    initialPos: undefined as Vec3 | undefined,
    initialRot: undefined as Quat | undefined,
    pipes: undefined as GraphNode[] | undefined,
  },
  initialize() {
    const app = this.app;
    this.initialPos = this.entity.getPosition().clone();
    this.initialRot = this.entity.getRotation().clone();
    this.pipes = app.root.findByTag("pipe");

    app.on("game:pause", () => {
      this.paused = true;
      this.entity.sprite!.speed = 0;
    });

    app.on("game:unpause", () => {
      this.paused = false;
      this.entity.sprite!.speed = 1;
    });

    app.on("game:press", (x, y) => {
      this.flap();
    });

    this.on("enable", () => {
      app.on("game:press", (x, y) => {
        this.flap();
      });

      this.reset(this);
    });

    this.on("disable", function () {
      app.off("game:press");
    });

    // this.reset();

    this.reset();
  },
  helpers: {
    reset: (script) => {
      script.reset;
    },
  },
});
