import { Entity } from "playcanvas";
import { createScript } from "./create-script";

// The correct way to verify the availability of the local storage API taken from:
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable() {
  try {
    var storage = window.localStorage,
      x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

createScript("game", {
  fields: {
    score: 0,
    bestScore: 0,
  },
  initialize() {
    const app = this.app;

    if (storageAvailable()) {
      this.bestScore = parseInt(
        localStorage.getItem("Flappy Bird Best Score") || "0"
      );
    }

    app.on(
      "game:menu",
      function () {
        app.fire("flash:black");

        setTimeout(function () {
          app.root.findByName("Game Over Screen")!.enabled = false;
          app.root.findByName("Menu Screen")!.enabled = true;

          app.root.findByName("Game")!.findByName("Bird")!.enabled = false;
          app.fire("pipes:reset");
          app.fire("ground:start");
        }, 250);
      },
      this
    );

    app.on("game:getready", () => {
      app.fire("flash:black");

      setTimeout(() => {
        app.root.findByName("Menu Screen")!.enabled = false;
        app.root.findByName("Game Screen")!.enabled = true;

        this.score = 0;
        app.fire("ui:score", this.score);

        (app.root.findByName("Get Ready") as Entity).sprite!.enabled = true;
        (app.root.findByName("Tap") as Entity).sprite!.enabled = true;

        app.root.findByName("Game")!.findByName("Bird")!.enabled = true;
      }, 250);
    });

    app.on("game:play", () => {
      app.fire("pipes:start");
      app.fire("ui:fadegetready");
    });

    app.on("game:pause", () => {
      app.root.findByName("Pause Button")!.enabled = false;
      app.root.findByName("Play Button")!.enabled = true;
    });

    app.on("game:unpause", () => {
      app.root.findByName("Play Button")!.enabled = false;
      app.root.findByName("Pause Button")!.enabled = true;
    });

    app.on("game:gameover", () => {
      app.root.findByName("Game Screen")!.enabled = false;
      app.root.findByName("Game Over Screen")!.enabled = true;

      app.fire("pipes:stop");
      app.fire("ground:stop");
      app.fire("ui:fadeingameover");
      app.fire("ui:showscoreboard", this.score, this.bestScore);

      // Check if we have a new high score and write it to local storage
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        if (storageAvailable()) {
          localStorage.setItem("Flappy Bird Best Score", this.score.toString());
        }
      }

      setTimeout(() => {
        app.fire("game:audio", "Swoosh");
      }, 500);
    });

    app.on("game:addscore", () => {
      this.score++;
      app.fire("ui:score", this.score);
      app.fire("game:audio", "Point");
    });

    app.on("game:share", () => {
      if (navigator.share && pc.platform.mobile) {
        const shareData = {
          title: "Flappy Bird",
          text: `I scored ${this.score} in Flappy Bird! Beat that!`,
          url: "https://playcanv.as/p/2OlkUaxF/",
        };
        navigator.share(shareData);
      } else {
        var left = screen.width / 2 - 640 / 2;
        var top = screen.height / 2 - 380 / 2;

        var shareText = encodeURIComponent(
          "I scored " +
            this.score +
            " in Flappy Bird! Beat that! http://flappybird.playcanvas.com/ Powered by @playcanvas #webgl #html5"
        );
        var shareUrl = "https://twitter.com/intent/tweet?text=" + shareText;

        var popup = window.open(
          shareUrl,
          "name",
          "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
            640 +
            ", height=" +
            380 +
            ", top=" +
            top +
            ", left=" +
            left
        );
        if (popup) {
          popup.focus();
        }
      }
    });

    app.on("game:audio", (slot) => {
      this.entity.sound!.play(slot);
    });
  },
});
