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
      this.ridingTile;
    }
  });