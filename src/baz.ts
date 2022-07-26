import { returnTwo } from "./util";

var Baz = pc.createScript("baz")!;

// initialize code called once per entity
Baz.prototype.initialize = function () {
  //this.lastX = this.entity.getPosition().x;
  console.log(returnTwo() + "2");
};

// update code called every frame
Baz.prototype.update = function (dt) {
  // var app = this.app;
  // var birdX = this.bird.getPosition().x;
  // var pipeX = this.entity.getPosition().x;
  // if (pipeX <= birdX && this.lastX > birdX) {
  //   app.fire("game:addscore");
  // }
  // this.lastX = pipeX;
};
