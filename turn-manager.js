Crafty.c("TurnMgr", {
    init: function() {
      this.bind("Turn", function() {
        console.log("Turn!");

        tweenCount = 0;

        // sort units from right to left and top to bottom
        derps.sort(function(a, b) {
          if (a.tilePos.x > b.tilePos.x) {
            return -1;
          } else if (a.tilePos.x === b.tilePos.x) {
            return b.tilePos.y - a.tilePos.y;
          } else if (a.tilePos.x < b.tilePos.x) {
            return 1;
          }
        });

        // remove exiting units and determine if level is over
        var active = 0;
        for (var i = derps.length - 1; i >= 0; i--) {
          if (derps[i].status !== 'dead' && derps[i].status !== 'stuck') {
            active++;
          }
          if (derps[i].status === 'exiting') {
            escaped++;
            if (selectedDerp === derps[i]) {
              selectedDerp = null;
            }
            derps[i].destroy();
            derps.splice(i, 1);
          }
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
          console.log('x: ' + derps[i].tilePos.x + ' y: ' + derps[i].tilePos.y);
          derps[i].move();
        }

        lastTurnFrames = Crafty.frame();

      });

      this.bind("DerpTweenEnd", function() {

        //console.log('tweenend tweencount: ' + tweenCount);
        tweenCount -= 1;
        if (tweenCount === 0) {
          //console.log('tweencount is zero, sending turn...');
          Crafty.trigger("Turn");
        }
      });

      this.bind("KeyDown", function(e) {
        console.log("KeyDown " + e.key);
        if (e.key === 67) {
          // clone
          var noWallBlocking = (level.getTile(selectedDerp.tilePos.x - 1, selectedDerp.tilePos.y) === Level.TILE_EMPTY);
          var hasWallToStand = (level.getTile(selectedDerp.tilePos.x - 1, selectedDerp.tilePos.y + 1) !== 0);
            if (noWallBlocking  && hasWallToStand) {
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

            tweenCount += 2;
            var frame = Crafty.frame();
            var frames = TWEEN_FRAMES - Crafty.frame() - lastTurnFrames;
            if (frames < 1) frames = 1;
            selectedDerp.tween({x: selectedDerp.dest.x, y: selectedDerp.dest.y}, frames);
          }
        }
     });
    }
  });