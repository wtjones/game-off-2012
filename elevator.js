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
    //this.standingUnit;
  },
  moveTurn: function() {
    var tileX = this.tilePos.x;
    var tileY = this.tilePos.y;

    if (this.status === '') {
      // Since movers are sorted (ie moved) right to left,
      // return if there is a simlar neighbor to the right because the right-most mover
      // will initiate the move.
      if (this.direction === 'down') {
        if (level.getTile(tileX + 1, tileY) === Level.TILE_ELEVATOR_DOWN) return;
      } else {
        if (level.getTile(tileX + 1, tileY) === Level.TILE_ELEVATOR_UP) return;
      }

      // build list of movers of same type
      var movers = [];
      var temp;
      if (this.direction === 'down') {
        temp = Crafty("ElevatorDown");
      } else {
        temp = Crafty("ElevatorUp");
      }
      for (var i = 0; i < temp.length; i++) {
        movers[movers.length] = Crafty(temp[i]);
      }

      // determine 'attached' neighbor movers
      var neighbors = [];
      var moverGroup = [];
      moverGroup[0] = this;
      for (var i = 0; i < movers.length; i++) {
        if (movers[i] !== this) {
          if (movers[i].tilePos.x + 1 === this.tilePos.x
              && movers[i].tilePos.y === this.tilePos.y
              && movers[i].direction === this.direction) {
            //neighbors[neighbors.length] = movers[i];
            moverGroup[moverGroup.length] = movers[i];
          }
        }
      }

       // determine units that are standing on movers in this group
      var standingUnits = [];
      var standingCount = 0;
      for (var i = 0; i < derps.length; i ++) {
        for (var j = 0; j < moverGroup.length; j++) {
          if (derps[i].tilePos.x === moverGroup[j].tilePos.x && derps[i].tilePos.y + 1 === moverGroup[j].tilePos.y) {
            // add using same index as moverGroup
            standingUnits[j] = derps[i];
            // Track count separately because length of array would always be
            // length of moverGroup due to gaps in list.
            standingCount++;
          }
        }
      }

      // Are we in initial position and have matched number of riders?
      if (this.status === '' && standingCount === moverGroup.length) {
        for (var i = 0; i < standingUnits.length; i++) {
          // Change status of rider so that it will simply follow the platform.
          standingUnits[i].status = 'riding';
          // Add a reference to this elevator for use by unit's AI.
          standingUnits[i].ridingTile = moverGroup[i];
          moverGroup[i].status = 'moving';
        }
      }
    }


    if (this.status === 'moving') {
      this.dest.x = this.x;
      if (this.direction === 'down') {
        if (level.getTile(tileX, tileY + 1) === Level.TILE_EMPTY) {

          this.dest.y = this.y + Level.TILE_SIZE;
          this.tilePos.y++;

          this.tween({x: this.tilePos.x * Level.TILE_SIZE, y: this.tilePos.y * Level.TILE_SIZE}, TWEEN_FRAMES)
        } else {
          // Elevator can no longer move. Reset the status of the rider.
          this.status = 'end';

          // reset the status of the standing unit
          var standingUnit;
          for (var i = 0; i < derps.length; i ++) {
            if (derps[i].tilePos.x === tileX && derps[i].tilePos.y + 1 === tileY) {
              standingUnit = derps[i];
            }
          }
          standingUnit.status = '';
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