import type { Entity, Quat, Vec3 } from "playcanvas";
import { registerScript, ThisType } from "./register-script";

type State = "getready" | "play" | "dead";

type This = ThisType<typeof Bird>;

@registerScript("bird")
class Bird extends pc.ScriptType {
  public static attrib = {
    flapVelocity: { type: "number", default: 1 },
    gravity: { type: "number", default: 5 },
    lowestHeight: { type: "number", default: -0.25 },
    radius: { type: "number", default: 0.068 },
  } as const;

  private state: State = "getready";
  private paused = false;
  private velocity = 0;
  private circle = { x: 0, y: 0, r: 0 };
  private rect = { x: 0, y: 0, w: 0, h: 0 };
  private initialPos?: Vec3;
  private initialRot?: Quat;
  private pipes?: Entity[];

  public initialize(this: This) {
    const app = this.app;

    this.initialPos = this.entity.getPosition().clone();
    this.initialRot = this.entity.getRotation().clone();

    this.pipes = app.root.findByTag("pipe") as Entity[];

    app.on("game:pause", () => {
      this.paused = true;
      this.entity.sprite!.speed = 0;
    });

    app.on("game:unpause", () => {
      this.paused = false;
      this.entity.sprite!.speed = 1;
    });

    app.on("game:press", () => {
      this.flap();
    });

    this.on("enable", () => {
      app.on("game:press", () => {
        this.flap();
      });
      this.reset();
    });

    this.on("disable", () => {
      app.off("game:press");
    });

    this.reset();
  }

  public update(this: This, dt: number) {
    if (this.paused) {
      return;
    }

    const playing = this.state === "play";
    const dead = this.state === "dead";

    if (playing) {
      if (this.app.keyboard.wasPressed(pc.KEY_SPACE)) {
        this.flap();
      }
    }

    var pos = this.entity.getPosition();
    var posy = pos.y;

    if (playing || dead) {
      if (pos.y >= this.lowestHeight) {
        this.velocity -= this.gravity * dt;
        posy += this.velocity * dt;
        if (posy < this.lowestHeight) {
          posy = this.lowestHeight;
        }
        this.entity.setPosition(pos.x, posy, 0);

        // Map range -0.75 to -2 to 22.5 to -90
        var zrot = pc.math.clamp(this.velocity, -2, -0.75);
        zrot += 1;
        this.entity.setLocalEulerAngles(0, 0, zrot * 90);
      }
    }

    if (playing) {
      // Check for collision with ground
      if (posy <= this.lowestHeight) {
        this.die(false);
      }

      // Check for collision with pipes
      var rect = this.rect;
      var circle = this.circle;
      circle.x = pos.x;
      circle.y = pos.y;
      circle.r = this.radius;

      for (var i = 0; i < this.pipes!.length; i++) {
        var pipe = this.pipes![i];
        var aabb = pipe.sprite!._meshInstance.aabb; // TODO: Don't use sprite component internals!
        var min = aabb.getMin();
        var max = aabb.getMax();
        rect.x = min.x;
        rect.y = min.y;
        rect.w = max.x - min.x;
        rect.h = pipe.name === "Pipe Top" ? 1000 : max.y - min.y;

        if (circleRectangleIntersect(circle, rect)) {
          this.die(true);
        }
      }
    }
  }

  private reset(this: This) {
    this.velocity = 0;
    this.state = "getready";
    this.entity.setPosition(this.initialPos!);
    this.entity.setRotation(this.initialRot!);
    this.entity.sprite!.speed = 1;
  }

  private flap(this: This) {
    if (this.paused) {
      return;
    }

    if (this.state === "getready") {
      this.app.fire("game:play");
      this.state = "play";
      this.entity.sprite!.speed = 2;
    }

    if (this.state === "play") {
      this.app.fire("game:audio", "Flap");
      this.velocity = this.flapVelocity;
    }
  }

  private die(this: This, hitPipe: boolean) {
    this.state = "dead";
    this.entity.sprite!.speed = 0;
    this.app.fire("game:audio", "Hit");
    this.app.fire("flash:white");
    this.app.fire("game:gameover");
    if (hitPipe) {
      setTimeout(() => {
        this.app.fire("game:audio", "Die");
      }, 500);
    }
  }
}

function circleRectangleIntersect(
  circle: { x: number; y: number; r: number },
  rect: { x: number; y: number; w: number; h: number }
) {
  var cx = circle.x;
  var cy = circle.y;
  var cr = circle.r;
  var rx = rect.x;
  var ry = rect.y;
  var rw = rect.w;
  var rh = rect.h;

  var distX = Math.abs(cx - rx - rw / 2);
  var distY = Math.abs(cy - ry - rh / 2);

  if (distX > rw / 2 + cr) {
    return false;
  }
  if (distY > rh / 2 + cr) {
    return false;
  }

  if (distX <= rw / 2) {
    return true;
  }
  if (distY <= rh / 2) {
    return true;
  }

  var dx = distX - rw / 2;
  var dy = distY - rh / 2;
  return dx * dx + dy * dy <= cr * cr;
}
