Crafty.c("FloorSwitch", {
  init: function() {
    this.addComponent("2D, Canvas, floorSwitch");

    this.direction = '';
    this.dest = {x: 0, y: 0};
    this.tilePos = {x: 0, y: 0};
  },
  doTurn: function() {
    for (var i = 0; i < derps.length; i++) {
      if (this.tilePos.x === derps[i].tilePos.x && this.tilePos.y === derps[i].tilePos.y) {
        Crafty.trigger("FloorSwitchAction");
      }
    }
  }
});