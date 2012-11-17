function Assets(cb){};

Assets.load = function(cb) {
  Crafty.load(["data/images/dungeon.png",
               "data/images/units.png"], function() {

    Crafty.sprite(32,"data/images/dungeon.png", {
       floor: [5,0],
       wall1: [2,1],
       stairs: [3,1],
       exit: [19,0]
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