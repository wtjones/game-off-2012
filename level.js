function Level() {
  this.mapLoader = null;
  this.currentLevel = 1;

  // load level manifest
  $.ajaxSetup({cache: false});
  var self = this;

  $.ajax({
    url: 'data/levels.json',
    dataType: 'json',
    async: false,
    success: function(data) {
        self.manifest = data;
        console.log(data);
        console.log(self.manifest[0].fileName);
    }
  });

}

//
// static constants
//
Level.TILE_SIZE = 32;
Level.TILE_ACTOR = -1;
Level.TILE_EMPTY = 0;

// tiles from editor are 1-based
Level.TILE_WALL = 1;
Level.TILE_EXIT_OPEN = 6;
Level.TILE_EXIT_CLOSED = 7;
Level.TILE_FLOOR_SWITCH = 8;
Level.TILE_ELEVATOR_UP = 11;
Level.TILE_ELEVATOR_DOWN = 12;
Level.TILE_SPIKES = 16;

Level.TILE_START = 21;

/**
 * Gets the tile from static map data.
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}
 */
Level.prototype.getMapTile = function(x, y) {
  var size = this.mapLoader.getSize();
  // treat out of bounds as a wall;
  if (x < 0 || y < 0 || x > size.x || y > size.y) {
    return Level.TILE_WALL;
  } else {
   var tile = this.mapLoader.getTile(x, y);
    // ignore special tiles and movers
    return (tile !== Level.TILE_START
      && tile !== Level.TILE_ELEVATOR_DOWN
      && tile !== Level.TILE_ELEVATOR_UP) ? tile : Level.TILE_EMPTY;
  }
};


/**
 * Checks for an actor/mover before looking at map data.
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}
 */
Level.prototype.getTile = function(x, y) {
  // first look for an actor on the tile
  var b
  b = Crafty("Derp");
  for (var i = 0; i < b.length; i++) {
    var e = Crafty(b[i]);
    if (e.tilePos.x === x && e.tilePos.y === y) {
      return Level.TILE_ACTOR;
    }
  }

  b = Crafty("ElevatorDown");
  for (var i = 0; i < b.length; i++) {
    var e = Crafty(b[i]);
    if (e.tilePos.x === x && e.tilePos.y === y) {
      return Level.TILE_ELEVATOR_DOWN;
    }
  }

  b = Crafty("ElevatorUp");
  for (var i = 0; i < b.length; i++) {
    var e = Crafty(b[i]);
    if (e.tilePos.x === x && e.tilePos.y === y) {
      return Level.TILE_ELEVATOR_UP;
    }
  }

  b = Crafty("Exit");
  for (var i = 0; i < b.length; i++) {
    var e = Crafty(b[i]);
    if (e.tilePos.x === x && e.tilePos.y === y) {
      if (e.status === 'open') {
        return Level.TILE_EXIT_OPEN;
      } else {
        return Level.TILE_EXIT_CLOSED;
      }
    }
  }
  return this.getMapTile(x, y);
};



Level.prototype.loadLevel = function() {
  this.mapLoader = new MapLoader();
  var fileName = this.manifest[this.currentLevel - 1].fileName;
  //this.mapLoader.loadMap('data/levels/level-' + this.currentLevel + '.json');
  this.mapLoader.loadMap('data/levels/' + fileName);

  return;
};

Level.prototype.setLevel = function(level) {
  this.currentLevel = level;
  this.loadLevel();
};

Level.prototype.setNextLevel = function() {
  this.currentLevel++;
  this.loadLevel();
};

Level.prototype.getLevel = function() {
  return this.currentLevel;
};

Level.prototype.getMaxLevel = function() {
  return this.manifest.length;
};

Level.prototype.getCaption = function() {
  return this.manifest[this.currentLevel - 1].caption;
};

Level.prototype.renderLevel = function() {
  var mapSize = this.mapLoader.getSize(0);

  for (var y = 0; y < mapSize.y; y++) {
    for (var x = 0; x < mapSize.x; x++) {
      var tileType = '';
      switch (this.mapLoader.getTile(x, y)){
        case Level.TILE_WALL:
          tileType = 'wall';
          break;
        case Level.TILE_EXIT_CLOSED:
          tileType = 'Exit';
          break;
        case Level.TILE_EXIT_OPEN:
          tileType = 'Exit';
          break;
        case Level.TILE_FLOOR_SWITCH:
          tileType = 'FloorSwitch';
          break;
        case Level.TILE_ELEVATOR_UP:
          tileType = 'ElevatorUp';
          break;
        case Level.TILE_ELEVATOR_DOWN:
          tileType = 'ElevatorDown';
          break;
        case Level.TILE_SPIKES:
          tileType = 'spikes';
          break;
      }

      if (tileType !== '') {
        var newE = Crafty.e("2D, Canvas, " + tileType)
          .attr({x: x * 32, y: y * 32, tilePos: {x: x, y: y} });
        // set door status
        if (this.mapLoader.getTile(x, y) === Level.TILE_EXIT_CLOSED) newE.close();
        if (this.mapLoader.getTile(x, y) === Level.TILE_EXIT_OPEN) newE.open();

      }
    }
  }
};


Level.prototype.getActorStart = function() {
  var mapSize = this.mapLoader.getSize(0);

  for (var y = 0; y < mapSize.y; y++) {
    for (var x = 0; x < mapSize.x; x++) {
      if (this.mapLoader.getTile(x, y) === Level.TILE_START) {
        return {x: x, y: y};
      }
    }
  }
};
