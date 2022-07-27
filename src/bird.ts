import {
  createScript,
  PlayCanvasScript,
  ThisType,
} from "./class-based-create-script";

type State = "getready" | "play" | "dead";

type This = ThisType<typeof Bird>;
class Bird implements PlayCanvasScript {
  public static __name = "bird";
  public static attributes = {
    velocity: { type: "number" },
  } as const;

  private state: State = "getready";

  public initialize(this: This) {}
}

createScript(Bird);
