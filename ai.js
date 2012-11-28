Crafty.c("AI", {
  moveTurn: function() {
    var tileX = this.tilePos.x;
    var tileY = this.tilePos.y;

    if (this.status !== 'dead' && this.status !== 'exit') {
      this.lastLastStatus = this.lastStatus;
      this.lastStatus = this.status;

      var fallingDeath =
        (this.lastStatus === 'falling'
          && this.lastLastStatus === 'falling'
          && level.getTile(tileX, tileY + 1) !== Level.TILE_EMPTY);

      var spikeDeath = (level.getMapTile(tileX, tileY) === Level.TILE_SPIKES);
      if (this.status === 'riding') {
        // follow platform
        this.dest.x = this.x;
        if (this.ridingTile.direction === 'down') {
          this.dest.y = this.y + Level.TILE_SIZE;
          this.tilePos.y++;

          this.tween({x: this.x, y: this.y + Level.TILE_SIZE}, TWEEN_FRAMES)
        } else {
          this.dest.y = this.y - Level.TILE_SIZE;
          this.tilePos.y--;

          this.tween({x: this.x, y: this.y - Level.TILE_SIZE}, TWEEN_FRAMES)
        }
      } else if (fallingDeath || spikeDeath) {
        this.status = 'dead';
        this.removeComponent('unitAlive');
        this.addComponent('unitDead');
      } else if (level.getTile(tileX + 1, tileY) === Level.TILE_EXIT_OPEN) {
         // move to exit
        this.tilePos.x++;
        this.dest.x = (this.tilePos.x * Level.TILE_SIZE);
        this.dest.y = this.tilePos.y * Level.TILE_SIZE;

        tweenCount += 2;
        this.tween({x: this.dest.x, y: this.dest.y}, TWEEN_FRAMES);
        this.status = 'exiting';
        } else if ((level.getTile(tileX + 1, tileY) === Level.TILE_EMPTY
                    || level.getTile(tileX + 1, tileY) === Level.TILE_SPIKES
                    || level.getTile(tileX + 1, tileY) === Level.TILE_FLOOR_SWITCH)
                    && level.getTile(tileX, tileY + 1) !== Level.TILE_EMPTY) {
        // move right
        this.tilePos.x++;
        this.dest.x = (this.tilePos.x * Level.TILE_SIZE);
        this.dest.y = this.tilePos.y * Level.TILE_SIZE;

        tweenCount += 2;
        this.tween({x: this.dest.x, y: this.dest.y}, TWEEN_FRAMES);
        this.status = 'moving';
      } else if (level.getTile(tileX, tileY + 1) === Level.TILE_EMPTY) {
          this.status = 'falling';
          this.dest.x = this.x;
          this.dest.y = this.y + Level.TILE_SIZE;
          this.tilePos.y++;

          tweenCount += 2;
          this.tween({x: this.x, y: this.y + Level.TILE_SIZE}, TWEEN_FRAMES)
      } else if ((level.getTile(tileX + 1, tileY - 1) === Level.TILE_EMPTY
                || level.getTile(tileX + 1, tileY - 1) === Level.TILE_SPIKES)
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