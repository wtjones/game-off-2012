function Level() {
  this.mapLoader = null;
  this.currentLevel = 1;
}

Level.TILE_SIZE = 32;
Level.TILE_ACTOR = -1;
Level.TILE_EMPTY = 0;
Level.TILE_WALL = 1;
Level.TILE_EXIT = 2;
Level.TILE_SPIKES = 3;
Level.TILE_ELEVATOR_UP = 4;
Level.TILE_START = 5;

/**
 * Gets the tile from static map data.
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}
 */
Level.prototype.getMapTile = function(x, y) {
  var tile = this.mapLoader.getTile(x, y);
  // ignore special tiles
  return (tile !== Level.TILE_START) ? tile : Level.TILE_EMPTY;
};


/**
 * Checks for an actor/mover before looking at map data.
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}
 */
Level.prototype.getTile = function(x, y) {
  // first look for an actor on the tile
  var b = Crafty("Derp");
  for (var i = 0; i < b.length; i++) {
    var e = Crafty(b[i]);
    if (e.tilePos.x === x && e.tilePos.y === y) {
      return Level.TILE_ACTOR;
    }
  }

  return this.getMapTile(x, y);
};



Level.prototype.loadLevel = function(level) {
  this.mapLoader = new MapLoader();
  this.mapLoader.loadMap('data/levels/level-' + this.currentLevel + '.json');

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

Level.prototype.renderLevel = function() {
  var mapSize = this.mapLoader.getSize(0);

  for (var y = 0; y < mapSize.y; y++) {
    for (var x = 0; x < mapSize.x; x++) {
      var tileType = '';
      switch (this.mapLoader.getTile(x, y)){
        case Level.TILE_WALL:
          tileType = 'wall';
          break;
        case Level.TILE_EXIT:
          tileType = 'exit';
          break;
        case Level.TILE_SPIKES:
          tileType = 'spikes';
          break;
      }

      if (tileType !== '') {
        Crafty.e("2D, Canvas, " + tileType)
          .attr({x: x * 32, y: y * 32 });
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
