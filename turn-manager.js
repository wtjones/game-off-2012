Crafty.c("TurnMgr", {
  init: function() {
    this.disable = true;
    this.bind("EnterFrame", this.handleEnterFrame);
    this.bind("Turn", this.handleTurn);

    this.bind("KeyDown", function(e) {
      console.log("KeyDown " + e.key);
      switch (e.key) {
        case 67:
          // clone action
          var validStatus = (selectedDerp.status === '' || selectedDerp.status === 'moving');
          var noWallBlocking = (level.getTile(selectedDerp.tilePos.x - 1, selectedDerp.tilePos.y) === Level.TILE_EMPTY);
          var hasWallToStand = (level.getTile(selectedDerp.tilePos.x - 1, selectedDerp.tilePos.y + 1) !== 0);

          if (noWallBlocking  && hasWallToStand && validStatus) {
            var lastDerp = selectedDerp;
            selectedDerp = Crafty.e("Derp")
              .attr({x: lastDerp.x - Level.TILE_SIZE, y: lastDerp.y})
              .attr({
                tilePos: {
                  x: lastDerp.tilePos.x - 1,
                  y: lastDerp.tilePos.y
                }
              })

            derps[derps.length] = selectedDerp;
            selectedDerp.dest.x = lastDerp.dest.x - Level.TILE_SIZE;
            selectedDerp.dest.y = lastDerp.dest.y;

            var frames = TWEEN_FRAMES - Crafty.frame() - lastTurnFrames;
            if (frames < 1) frames = 1;
            selectedDerp.tween({x: selectedDerp.dest.x, y: selectedDerp.dest.y}, frames);
          }
          break;
        case 82:
          Crafty.trigger("LevelReset");
          this.reset();
          return;
          break;
      }
   });
  },
  handleEnterFrame: function() {
    if (this.disable) return;

    turnFrames++;

    if (turnFrames === TWEEN_FRAMES) {
      Crafty.trigger("Turn", "frames");
    }
  },
  handleTurn: function() {
      tweenCount = 0;
      turnFrames = 0;
      this.disable = false;
      // sort function for units and movers
      var tileSort = function(a, b) {
        if (a.tilePos.x > b.tilePos.x) {
          return -1;
        } else if (a.tilePos.x === b.tilePos.x) {
          return b.tilePos.y - a.tilePos.y;
        } else if (a.tilePos.x < b.tilePos.x) {
          return 1;
        }
      };


      // sort units from right to left and top to bottom
      derps.sort(tileSort);

      // put all movers in an array
      var movers = [];

      var moversTemp = Crafty("ElevatorDown");
      for (var i = 0; i < moversTemp.length; i++) {
        movers[movers.length] = Crafty(moversTemp[i]);
      }

      moversTemp = Crafty("ElevatorUp");
      for (var i = 0; i < moversTemp.length; i++) {
        movers[movers.length] = Crafty(moversTemp[i]);
      }

      movers.sort(tileSort);

      // remove exiting units and determine if level is over
      var active = 0;
      for (var i = derps.length - 1; i >= 0; i--) {
        if (derps[i].status !== 'dead' && derps[i].status !== 'stuck' & derps[i].status !== 'exiting') {
          active++;
        }
        if (derps[i].status === 'exiting') {
          escaped++;
          if (selectedDerp === derps[i]) {
            selectedDerp = null;
          }
          var deleteUnit = derps[i];
          derps.splice(i, 1);
          deleteUnit.destroy();
        }
      }

      if (escaped > 1) {
        this.reset();
        Crafty.trigger("LevelLose");
        return;
      }

      if (escaped === 1 && active === 0) {
        this.reset();
        Crafty.trigger("LevelWin");
        return;
      }

      // move non-unit movers
      for (var i = 0; i < movers.length; i++) {
        movers[i].moveTurn();
      }

      // if selected unit was removed, reassign it.
      if (selectedDerp === null) {
        if (derps.length > 0) {
          selectedDerp = derps[derps.length - 1];
          selectedBox.x = selectedDerp.x;
          selectedBox.y = selectedDerp.y;
        } else {
            selectedBox.destroy();
        }
      }


      // apply unit moves
      for (var i = 0; i < derps.length; i++) {
        //console.log('x: ' + derps[i].tilePos.x + ' y: ' + derps[i].tilePos.y);
        derps[i].moveTurn();
      }
      lastTurnFrames = Crafty.frame();
    }, // Turn

  reset: function() {
    this.disable = true;
    //this.unbind("EnterFrame", this.handleEnterFrame);
  }
});