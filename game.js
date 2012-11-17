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
