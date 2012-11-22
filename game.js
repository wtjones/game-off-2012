var level = new Level();
var TWEEN_FRAMES = 20;
var tweenCount;
var turnFrames;
var lastTurnFrames;
var derps;
var selectedDerp;
var selectedBox;
var escaped;
var turnMgr;
var currentLevel;

$(document).ready(function() {

  Crafty.init(640,480);
  Crafty.canvas.init();

  turnMgr = Crafty.e("TurnMgr");

  Crafty.bind("LevelLose", function() {
    console.log ('levelLose');
    Crafty.scene("main");
  });

  Crafty.bind("LevelWin", function() {
    level.setNextLevel();
    Crafty.scene("main");
  });

  Crafty.scene("main",function() {
    Crafty.background("#000");

    level.loadLevel(currentLevel);
    escaped = 0;
    derps = [];

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

    // start first turn
    console.log('triggering a turn!');
    initialTurnHandled = false;
    Crafty.trigger("Turn");
  });


  Crafty.scene("loading", function() {
    Assets.load(function() {
      var skipToLevel = getParameterByName('startlevel');
      if (jQuery.isNumeric(skipToLevel)) {
        level.setLevel(skipToLevel);
      } else {
        level.setLevel(1);
      }
      Crafty.scene("main");
    });
  });


  Crafty.scene("loading");

});
