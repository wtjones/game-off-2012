function Assets(cb){};

Assets.load = function(cb) {
  Crafty.load(["data/images/map.png",
               "data/images/units.png"], function() {

    Crafty.sprite(32,"data/images/map.png", {
       wall: [0,0],
       exit: [1,0],
       spikes: [2,0],
    });

    Crafty.sprite(32,"data/images/units.png", {
       unitAlive: [0,0],
       unitDead: [1,0]
    });

    Crafty.sprite(32,"data/images/interface.png", {
       selected: [0,0]
    });

    cb();
  });
}