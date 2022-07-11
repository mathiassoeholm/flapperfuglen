import { returnTwo } from "./util";

var Bar = pc.createScript("bar")!;

// initialize code called once per entity
Bar.prototype.initialize = function () {
  //this.lastX = this.entity.getPosition().x;
  console.log(returnTwo() + returnTwo());
};

// update code called every frame
Bar.prototype.update = function (dt) {
  // var app = this.app;
  // var birdX = this.bird.getPosition().x;
  // var pipeX = this.entity.getPosition().x;
  // if (pipeX <= birdX && this.lastX > birdX) {
  //   app.fire("game:addscore");
  // }
  // this.lastX = pipeX;
};
