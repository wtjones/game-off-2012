function Assets(cb){};

Assets.load = function(cb) {
  Crafty.load(["data/levels/map.png",
               "data/sprites.png"],
               function() {
    Crafty.sprite(32,"data/levels/map.png", {
       wall: [0, 0],
       exitOpen: [0, 1],
       exitClosed: [1, 1],
       elevatorUp: [0, 2],
       elevatorDown: [1, 2],
       spikes: [0, 3],
    });

    Crafty.sprite(32,"data/sprites.png", {
       unitAlive: [0,0],
       unitDead: [1,0],
       selected: [0, 1]
    });

    cb();
  });
}