$(document).ready(function() {

  var TWEEN_FRAMES = 20;
  var blob;
  var tweenCount;
  var level = new Level();

  Crafty.init(640,480);
  Crafty.canvas.init();


  Crafty.load(["data/images/dungeon.png",
               "data/images/characters.png"], function() {
  });

// This will create entities called floor, wall1 and stairs
  Crafty.sprite(32,"data/images/dungeon.png", {
     floor: [5,0],
     wall1: [2,1],
     stairs: [3,1]
  });

  // This will create entities called hero1 and blob1
  Crafty.sprite(32,"data/images/characters.png", {
     hero1: [5,3],
     blob1: [4,7]
  });


  Crafty.c("Blob", {
    init: function() {
      this.addComponent("2D, Canvas, Tween, AI, blob1");
         //.attr({x:63, y:63})
      this.bind("TweenEnd", function() {
            console.log("TweenEnd " + this);
            Crafty.trigger("BlobTweenEnd");

            //blob.tween({x: blob.x + 50, y: blob.y}, 60);
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
            blob.tween({x: blob.dest.x, y: blob.dest.y}, TWEEN_FRAMES);
          }
        }
     });
    }
  });

  Crafty.c("AI", {
    _desiredPos: {x: 0, y: 0},
    move: function() {
      var tileX = this.tilePos.x;
      var tileY = this.tilePos.y;

      if (level.getTile(tileX + 1, tileY) === 0 && level.getTile(tileX + 1, tileY + 1) !== 0 ) {
        // move right
        this.tilePos.x++;
        this.dest.x = (this.tilePos.x * Level.TILE_SIZE);
        this.dest.y = this.tilePos.y * Level.TILE_SIZE;

        tweenCount += 2;
        this.tween({x: this.dest.x, y: this.dest.y}, TWEEN_FRAMES);

      } else if (level.getTile(tileX, tileY + 1) === 0) {
        // move down
        this.dest.x = this.x;
        this.dest.y = this.y + Level.TILE_SIZE;
        this.tilePos.y++;

        tweenCount += 2;
        this.tween({x: this.x, y: this.y + Level.TILE_SIZE}, TWEEN_FRAMES)
      } else if (level.getTile(tileX + 1, tileY - 1) === 0
                && level.getTile(tileX + 1, tileY) === Level.TILE_ACTOR
                && level.getTile(tileX, tileY - 1) === 0) {
        // climb actor
        this.dest.x = this.x + Level.TILE_SIZE;
        this.dest.y = this.y - Level.TILE_SIZE;
        this.tilePos.x++;
        this.tilePos.y--;

        tweenCount += 2;
        this.tween({x: this.dest.x, y: this.dest.y}, TWEEN_FRAMES)
      }
      console.log('move tweencount: ' + tweenCount);
    }
  });

  // Let's draw us a Hero and a Blob
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
    Crafty.load(["data/images/dungeon.png","data/images/characters.png"], function() {
      level.loadNextLevel(function(err) {
        console.log('loaded a level!');
        Crafty.scene("main");
      });
    });
  });

Crafty.scene("loading");

});
