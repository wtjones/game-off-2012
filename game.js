var level = new Level();
var TWEEN_FRAMES = 20;
var blob;
var tweenCount;
var lastTurnFrames;

$(document).ready(function() {

  Crafty.init(640,480);
  Crafty.canvas.init();


  Crafty.c("Blob", {
    init: function() {
      this.addComponent("2D, Canvas, Tween, AI, blob1");
         //.attr({x:63, y:63})
      this.bind("TweenEnd", function() {
            console.log("TweenEnd " + this);
            Crafty.trigger("BlobTweenEnd");
      });

      this.dest = {x: 0, y: 0};
      this.tilePos = {x: 0, y: 0};
    }
  });

  Crafty.c("TurnMgr", {
    init: function() {
      this.bind("Turn", function() {
        console.log("Turn!");
        var b = Crafty("Blob");

        tweenCount = 0;

        for (var i = 0; i < b.length; i++) {
          var e = Crafty(b[i]);
          e.move();
        }
        lastTurnFrames = Crafty.frame();

      });

      this.bind("BlobTweenEnd", function() {

        console.log('tweenend tweencount: ' + tweenCount);
        tweenCount -= 1;
        if (tweenCount === 0) {
          console.log('tweencount is zero, sending turn...');
          Crafty.trigger("Turn");
        }
      });

      this.bind("KeyDown", function(e) {
        console.log("KeyDown " + e.key);
        if (e.key === 67) {
          var noWallBlocking = (level.getTile(blob.tilePos.x - 1, blob.tilePos.y) === 0);
          var hasWallToStand = (level.getTile(blob.tilePos.x - 1, blob.tilePos.y + 1) !== 0);
            if (noWallBlocking  && hasWallToStand) {
            var lastBlob = blob;
            blob = Crafty.e("Blob")
              .attr({x: lastBlob.x - Level.TILE_SIZE, y: lastBlob.y})
              .attr({
                tilePos: {
                  x: lastBlob.tilePos.x - 1,
                  y: lastBlob.tilePos.y
                }
              })

            blob.dest.x = lastBlob.dest.x - Level.TILE_SIZE;
            blob.dest.y = lastBlob.dest.y;

            tweenCount += 2;
            var frame = Crafty.frame();
            var frames = TWEEN_FRAMES - Crafty.frame() - lastTurnFrames;
            if (frames < 1) frames = 1;
            blob.tween({x: blob.dest.x, y: blob.dest.y}, frames);
          }
        }
     });
    }
  });


  Crafty.scene("main",function() {
    Crafty.background("#000");

    var actorStart = level.getActorStart();
    level.renderLevel();

    blob = Crafty.e("Blob")
       .attr({x: actorStart.x * Level.TILE_SIZE, y: actorStart.y * Level.TILE_SIZE})
       .attr({tilePos: actorStart});

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
