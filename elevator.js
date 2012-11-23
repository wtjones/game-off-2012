Crafty.c("Elevator", {
  init: function() {
    this.addComponent("2D, Canvas, Tween");

    var self = this;
    this.bind("Move", function() {
    });

    this.direction = '';
    this.dest = {x: 0, y: 0};
    this.tilePos = {x: 0, y: 0};
    this.status = '';
    this.lastStatus = '';
    this.lastLastStatus = '';
  },
  moveTurn: function() {
    var tileX = this.tilePos.x;
    var tileY = this.tilePos.y;

    // determine if a unit is standing on tile
    var standingUnit;

    for (var i = 0; i < derps.length; i ++) {
      if (derps[i].tilePos.x === tileX && derps[i].tilePos.y + 1 === tileY) {
        standingUnit = derps[i];
      }
    }

    if (this.status === '' && standingUnit !== undefined) {
      // Change status of rider so that it will simply follow the platform.
      standingUnit.status = 'riding';
      // Add a reference to this elevator for use by unit's AI.
      standingUnit.ridingTile = this;

      this.dest.x = this.x;
      if (this.direction === 'down') {
        if (level.getTile(tileX, tileY + 1) === Level.TILE_EMPTY) {

          this.dest.y = this.y + Level.TILE_SIZE;
          this.tilePos.y++;

          this.tween({x: this.x, y: this.y + Level.TILE_SIZE}, TWEEN_FRAMES)
        } else {
          // Elevator can no longer move. Reset the status of the rider.
          this.status = 'end';
          standingUnit.status = '';
          console.log('end of ride');
        }

      }
    }
  }
});


Crafty.c("ElevatorDown", {
  init: function() {
    this.addComponent("Elevator, elevatorDown");
    this.direction = 'down';
  },

});