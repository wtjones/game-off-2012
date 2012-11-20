function MapLoader(){}

MapLoader.prototype.map = null;
MapLoader.prototype.loadMap = function(filePath) {
  $.ajaxSetup({cache: false});
  var self = this;

  $.ajax({
    url: filePath,
    dataType: 'json',
    async: false,
    success: function(data) {
        self.map = data;
        console.log('gotjson');
    }
  });

};


MapLoader.prototype.getTile = function(x, y) {
  //var map = this.maps[mapDesc];
  return this.map.layers[0].data[(y * this.map.layers[0].width) + x];
};

MapLoader.prototype.getSize = function(layer) {
  return {x: this.map.layers[0].width, y: this.map.layers[0].height};
};