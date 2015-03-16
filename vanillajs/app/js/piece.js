'use strict';

var Piece = function(canvas, color, piece) {
  this.canvas = canvas;
  this.color = color;
  this.piece = piece;
  this.image = new Image();
  this.image.src = 'images/' + this.color + '/' + this.piece.name + '.svg';
}

Piece.prototype.initialise = function () {
  this.render(this.piece.position);
}

Piece.prototype.render = function (newpos, oldpos) {
  var ctx = this.canvas.getContext('2d');
  var x_pos = newpos.split('')[0].charCodeAt(0) - 96;
  var y_pos = 9 - newpos.split('')[1];
  var img = this.image;
  this.image.onload = function(){
    ctx.drawImage(
      img, 
      x_pos * 50 - 50 + 3, // centering
      y_pos * 50 - 50
    );
  }
}

Piece.prototype.isValidMove = function (newpos, oldpos, player, opponent, board) {
  switch(this.piece.name) {
    case 'pawn':
      return this.isValidPawnMove(newpos, oldpos, player, opponent, board);
      break;
    case 'bishop':
      return this.isValidBishopMove(newpos, oldpos, player, opponent, board);
    default:
      return false;
  }
}


Piece.prototype.isValidPawnMove = function (newpos, oldpos, player, opponent, board) {
  // Can't move to a tile occupied by the current player
  var playerPositions = player.pieces.map(function(piece) {return piece.position});
  var moveDirection = [ 
    GLOBALS.cols.indexOf(newpos.split('')[0]) - GLOBALS.cols.indexOf(oldpos.split('')[0]),
    GLOBALS.rows.indexOf(parseInt(newpos.split('')[1])) - GLOBALS.rows.indexOf(parseInt(oldpos.split('')[1]))
  ]
  // Move straight ahead
  if (moveDirection[0] === 0) {
    if (moveDirection[1] === 1) {
      // Same column, 1 step forward
      return this.squaresAreEmpty([newpos], player, opponent);
    } else if (moveDirection[1] === 2) {
      var tile = newpos.split('')[0] + parseInt(newpos.split('')[1] - 1);
      var tilesArr = [newpos, tile]
      return parseInt(oldpos.split('')[1]) === 2 && this.squaresAreEmpty(tilesArr, player, opponent);
    }
  }
  return false;
}

Piece.prototype.isValidBishopMove = function (newpos, oldpos, player, opponent, board) {

}


// Returns true if all the tiles in a given array are empty
// Otherwise returns false
Piece.prototype.squaresAreEmpty = function (tilesArr, player, opponent) {
  var occupiedPositions = player.pieces.concat(opponent.pieces).map(function(piece) {return piece.position});
  return tilesArr.every(function(tile) {
    return occupiedPositions.indexOf(tile) === -1;
  });

}


