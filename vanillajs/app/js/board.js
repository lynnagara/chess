
//      A    B    C    D    E    F    G    H
//
// 1    #    #    #    #    #    #    #    #    1
//
// 2    #    #    #    #    #    #    #    #    2
//
// 3    #    #    #    #    #    #    #    #    3
//
// 4    #    #    #    #    #    #    #    #    4
//
// 5    #    #    #    #    #    #    #    #    5
//
// 6    #    #    #    #    #    #    #    #    6
//
// 7    #    #    #    #    #    #    #    #    7
//
// 8    #    #    #    #    #    #    #    #    8
//
//      A    B    C    D    E    F    G    H



var Board = function (element, tileSizeInPx) {
  this.element = element;
  this.tileSizeInPx = tileSizeInPx;
}

Board.prototype.render = function () {
  this.element.width = this.tileSizeInPx * 8;
  this.element.height = this.tileSizeInPx * 8;

  var i, j;
  this.tiles = []; // 1d array containing the address of all 64 tiles
  var rows = [1,2,3,4,5,6,7,8];
  var cols = ['a','b','c','d','e','f','g','h'];

  rows.forEach(function(row, rowIdx) {
    cols.forEach(function(col, colIdx) {
      this.tiles.push(row + col);
      // render the tile
      var x = rowIdx * this.tileSizeInPx;
      var y = colIdx * this.tileSizeInPx;
      var ctx = this.element.getContext('2d');
      if ((rowIdx+colIdx) % 2 === 0) {
        ctx.fillStyle = GLOBALS.colors.white;
      } else {
        ctx.fillStyle = GLOBALS.colors.black;
      }
      ctx.fillRect(x, y, this.tileSizeInPx, this.tileSizeInPx); 
    }, this);
  }, this);



  return true;
}