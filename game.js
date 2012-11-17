var level = new Level();
var TWEEN_FRAMES = 20;
var blob;
var tweenCount;
var lastTurnFrames;
var derps = [];
var selectedDerp;
var selectedBox;
var escaped;

$(document).ready(function() {

  Crafty.init(640,480);
  Crafty.canvas.init();

  Crafty.c("Derp", {
    init: function() {
      this.addComponent("2D, Canvas, Tween, AI, unitAlive");
         //.attr({x:63, y:63})
      this.bind("TweenEnd", function() {
            //console.log("TweenEnd " + this);
            Crafty.trigger("DerpTweenEnd");
      });

      var self = this;
      this.bind("Move", function() {
        if (self === selectedDerp) {
          selectedBox.x = self.x;
          selectedBox.y = self.y;
        }
      });

      this.dest = {x: 0, y: 0};
      this.tilePos = {x: 0, y: 0};
      this.status = '';
      this.lastStatus = '';
      this.lastLastStatus = '';
    }
  });

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


  Crafty.scene("main",function() {
    Crafty.background("#000");

    escaped = 0;

    var actorStart = level.getActorStart();
    level.renderLevel();

    selectedBox = Crafty.e("2D, Canvas, selected")
      .attr({x: 0, y: 0, z: 1});

    selectedDerp = Crafty.e("Derp")
       .attr({x: actorStart.x * Level.TILE_SIZE, y: actorStart.y * Level.TILE_SIZE})
       .attr({tilePos: actorStart});

    derps[0] = selectedDerp;
    selectedBox.x = selectedDerp.x;
    selectedBox.y = selectedDerp.y;

    var turnMgr = Crafty.e("TurnMgr");

    // start first turn
    Crafty.trigger("Turn");
  });



  Crafty.scene("loading", function() {
    Assets.load(function() {
      level.loadNextLevel(function(err) {
        console.log('loaded a level!');
        Crafty.scene("main");
      });
    });
  });

  Crafty.scene("loading");

});
