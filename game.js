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

/**
 * This is a kludge to work around a bug that occurs when reseting the scene.
 * The TurnMgr seems to duplicate events.
 * @param  {[type]} level [description]
 * @return {[type]}       [description]
 */
function navigateToLevel(level) {
  var goUrl = window.location.protocol + "//"
    + window.location.host
    + window.location.pathname
    + "?startlevel=" + level.toString();
    console.log(goUrl);
  window.location = goUrl;
}

$(document).ready(function() {

  Crafty.init(640,480);
  Crafty.canvas.init();

  turnMgr = Crafty.e("TurnMgr");

  Crafty.bind("LevelLose", function() {
    console.log ('levelLose');

    Crafty.e("HTML")
      .attr({
        x: Crafty.canvas._canvas.getContext('2d').canvas.width / 2 - 250,
        y: Crafty.canvas._canvas.getContext('2d').canvas.height / 2 - 50, w:500, h:100})
      .append("<div style='background-color:black;color:white;'><center>Level Lost.<br>To win, only one unit may exit.</center></div>");

  });

  Crafty.bind("LevelReset", function() {
    var goLevel = (level.getLevel() * 1);
    navigateToLevel(goLevel);
  });

  Crafty.bind("LevelWin", function() {
    // not sure why it thinks getLevel() returns a string
    var goLevel = (level.getLevel() * 1) + 1;
    navigateToLevel(goLevel);
    //level.setNextLevel();
    //Crafty.scene("main");
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


    var dialog = Crafty.e("HTML")
      .attr({
        x: Crafty.canvas._canvas.getContext('2d').canvas.width / 2 - 250,
        y: Crafty.canvas._canvas.getContext('2d').canvas.height / 2 - 50, w:500, h:100})
      .append("<div style='background-color:black;color:white;'><center>To win, only one unit may exit. Press space bar to begin.</center></div>");

    var id;
    this.bind("KeyDown", function(e) {
      console.log("KeyDown " + e.key);
      if (e.key === 32) {
        dialog.destroy();
        this.unbind("KeyDown", id);
        var resetNotice = Crafty.e("HTML")
        .attr({
          x: Crafty.canvas._canvas.getContext('2d').canvas.width / 2 - 250,
          y: Crafty.canvas._canvas.getContext('2d').canvas.height - 20, w:500, h:20})
        .append("<div style='background-color:black;color:white;'><center>Press r to reset.</center></div>");

        console.log('triggering a turn!');
        Crafty.trigger("Turn");
      }
    });
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
