Crafty.c("FloorSwitch", {
  init: function() {
    this.addComponent("2D, Canvas, floorSwitch");

    this.direction = '';
    this.dest = {x: 0, y: 0};
    this.tilePos = {x: 0, y: 0};
    this.standingUnit = null;
  },
  doTurn: function() {
    var hasUnit = false;
    for (var i = 0; i < derps.length; i++) {
      if (this.tilePos.x === derps[i].tilePos.x && this.tilePos.y === derps[i].tilePos.y) {
        hasUnit = true;
        if (this.standingUnit !== derps[i]) {
          this.standingUnit = derps[i];
          hasUnit = true;
          Crafty.trigger("FloorSwitchAction");
        }
      }
    }
    if (!hasUnit) {
      this.standingUnit = null;
    }
  }
});