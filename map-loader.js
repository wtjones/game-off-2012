function MapLoader(){}

MapLoader.prototype.map = null;
MapLoader.prototype.loadMap = function(filePath, cb) {
  $.ajaxSetup({cache: false});
  var self = this;
  $.getJSON(filePath, function(data) {
      self.map = data;
      console.log('gotjson');
      cb(null);
  });
};


MapLoader.prototype.getTile = function(x, y) {
  //var map = this.maps[mapDesc];
  return this.map.layers[0].data[(y * this.map.layers[0].width) + x];
};

MapLoader.prototype.getSize = function(layer) {
  return {x: this.map.layers[0].width, y: this.map.layers[0].height};
};