import { returnTwo } from "./util";

var Foo = pc.createScript("foo")!;

// initialize code called once per entity
Foo.prototype.initialize = function () {
  //this.lastX = this.entity.getPosition().x;
  console.log(returnTwo());
};

// update code called every frame
Foo.prototype.update = function (dt) {
  // var app = this.app;
  // var birdX = this.bird.getPosition().x;
  // var pipeX = this.entity.getPosition().x;
  // if (pipeX <= birdX && this.lastX > birdX) {
  //   app.fire("game:addscore");
  // }
  // this.lastX = pipeX;
};
