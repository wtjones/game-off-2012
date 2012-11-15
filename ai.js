Crafty.c("AI", {
  move: function() {
    var tileX = this.tilePos.x;
    var tileY = this.tilePos.y;

    if (this.status !== 'dead' && this.status !== 'exit') {
      this.lastStatus = this.status;

      if (level.getTile(tileX + 1, tileY) === Level.TILE_EXIT) {
         // move to exit
        this.tilePos.x++;
        this.dest.x = (this.tilePos.x * Level.TILE_SIZE);
        this.dest.y = this.tilePos.y * Level.TILE_SIZE;

        tweenCount += 2;
        this.tween({x: this.dest.x, y: this.dest.y}, TWEEN_FRAMES);
        this.status = 'exiting';
      } else if (
              level.getTile(tileX + 1, tileY) !== Level.TILE_WALL
              && level.getTile(tileX + 1, tileY) !== Level.TILE_ACTOR
              && level.getTile(tileX, tileY + 1) !== 0
      ) {
        // move right
        this.tilePos.x++;
        this.dest.x = (this.tilePos.x * Level.TILE_SIZE);
        this.dest.y = this.tilePos.y * Level.TILE_SIZE;

        tweenCount += 2;
        this.tween({x: this.dest.x, y: this.dest.y}, TWEEN_FRAMES);
        this.status = 'moving';
      } else if (level.getTile(tileX, tileY + 1) === 0) {
        // move down
          this.lastStatus = this.status;
          if (this.lastStatus === 'falling' && level.getTile(tileX, tileY + 2) === Level.TILE_WALL) {
            this.status = 'dead';
          } else {
            this.status = 'falling';
          }
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
        this.status = 'climbing';
      } else {
        this.status = 'stuck';
      }
    }
    //console.log('move tweencount: ' + tweenCount);
  }
});