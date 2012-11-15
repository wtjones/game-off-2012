function Assets(cb){}

Assets.load = function(cb) {
  Crafty.load(["data/images/dungeon.png",
               "data/images/characters.png"], function() {
  });

  Crafty.sprite(32,"data/images/dungeon.png", {
     floor: [5,0],
     wall1: [2,1],
     stairs: [3,1],
     exit: [19,0]
  });

  Crafty.sprite(32,"data/images/characters.png", {
     hero1: [5,3],
     blob1: [4,7]
  });

  Crafty.sprite(32,"data/images/interface.png", {
     selected: [0,0]
  });

  Crafty.load(["data/images/dungeon.png","data/images/characters.png"], function() {
    cb();
  });
}