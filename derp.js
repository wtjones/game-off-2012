Crafty.c("Derp", {
    init: function() {
      this.addComponent("2D, Canvas, Tween, Mouse, AI, unitAlive");
      this.bind("TweenEnd", function() {
        Crafty.trigger("DerpTweenEnd");
      });

      this.bind("Click", function() {
        selectedDerp = this;
        selectedBox.x = self.x;
        selectedBox.y = self.y;
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
      this.ridingTile;
    }
  });