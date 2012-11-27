Crafty.c("Exit", {
  init: function() {
    this.addComponent("2D, Canvas");

    this.dest = {x: 0, y: 0};
    this.tilePos = {x: 0, y: 0};
    this.status = '';
  },
  open: function() {
    this.status = 'open';
    this.removeComponent("exitClosed");
    this.addComponent("exitOpen");
  },
  close: function() {
    this.status = 'closed';
    this.removeComponent("exitOpen");
    this.addComponent("exitClosed");
  }
});
