function Level() {
  this.mapLoader = null;
}

Level.TILE_WALL = 1;
Level.TILE_ACTOR = 2;
Level.TILE_EMPTY = 0;
Level.TILE_SIZE = 32;


Level.prototype.getTile = function(x, y) {
  // first look for an actor on the tile
  var b = Crafty("Derp");
  for (var i = 0; i < b.length; i++) {
    var e = Crafty(b[i]);
    if (e.tilePos.x === x && e.tilePos.y === y) {
      return Level.TILE_ACTOR;
    }
  }

  return this.mapLoader.getTile(0, x, y) > 0 ? Level.TILE_WALL : Level.TILE_EMPTY;
};


Level.prototype.loadNextLevel = function(cb) {
  this.mapLoader = new MapLoader();
  this.mapLoader.loadMap('data/map.json', function(err) {
    cb(null);
  });
}


Level.prototype.renderLevel = function() {
  var mapSize = this.mapLoader.getSize(0);

  for (var y = 0; y < mapSize.y; y++) {
    for (var x = 0; x < mapSize.x; x++) {
      if (this.mapLoader.getTile(0, x, y) > 0) {
        Crafty.e("2D, Canvas, floor")
          .attr({x: x * 32, y: y * 32 });
      }
    }
  }
};


Level.prototype.getActorStart = function() {
  var mapSize = this.mapLoader.getSize(0);

  for (var y = 0; y < mapSize.y; y++) {
    for (var x = 0; x < mapSize.x; x++) {
      if (this.mapLoader.getTile(1, x, y) > 0) {
        return {x: x, y: y};
      }
    }
  }
};