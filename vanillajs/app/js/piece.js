'use strict';

var Piece = function(canvas, color, piece) {
  this.canvas = canvas;
  this.color = color;
  this.piece = piece;
}

Piece.prototype.initialise = function () {
  this.render(this.piece.position);
}

Piece.prototype.render = function (newpos, oldpos) {
  var image = new Image();
  image.src = 'images/' + this.color + '/' + this.piece.name + '.svg';
  var ctx = this.canvas.getContext('2d');
  var x_pos = newpos.split('')[0].charCodeAt(0) - 96;
  var y_pos = 9 - newpos.split('')[1];
  image.onload = function(){

    ctx.drawImage(
      image, 
      x_pos * 50 - 50 + 3, // centering
      y_pos * 50 - 50
    );
  }

}