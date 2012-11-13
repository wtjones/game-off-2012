var level = new Level();
var TWEEN_FRAMES = 20;
var blob;
var tweenCount;
var lastTurnFrames;
var derps = [];
var selectedDerp;
var selectedBox;

$(document).ready(function() {

  Crafty.init(640,480);
  Crafty.canvas.init();


  Crafty.c("Derp", {
    init: function() {
      this.addComponent("2D, Canvas, Tween, AI, blob1");
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
    }
  });

  Crafty.c("TurnMgr", {
    init: function() {
      this.bind("Turn", function() {
        console.log("Turn!");
        //var b = Crafty("Derp");

        tweenCount = 0;

        derps.sort(function(a, b) {
          if (a.tilePos.y > b.tilePos.y) {
            return 1;
          } else if (a.tilePos.y === b.tilePos.y) {
            return a.tilePos.x - b.tilePos.y;
          } else if (a.tilePos.y < b.tilePos.y) {
            return -1;
          }
        });
        console.log('order!');
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
          var noWallBlocking = (level.getTile(selectedDerp.tilePos.x - 1, selectedDerp.tilePos.y) === 0);
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
