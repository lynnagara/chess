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
    case 'queen':
      return this.isValidQueenMove(newpos, oldpos, player, opponent, board);
    default:
      return false;
  }
}

Piece.prototype.getMoveDirection = function (newpos, oldpos) {
  return [
    GLOBALS.cols.indexOf(newpos.split('')[0]) - GLOBALS.cols.indexOf(oldpos.split('')[0]),
    GLOBALS.rows.indexOf(parseInt(newpos.split('')[1])) - GLOBALS.rows.indexOf(parseInt(oldpos.split('')[1]))
  ]
}

// Returns an array containing the co-ordinates of squares between two points
// Excluding those squares
Piece.prototype.getSquareList = function (newpos,oldpos) {
  // Make sure its a straight line
  var moveDirection = this.getMoveDirection(newpos, oldpos);

  var list = [];
  var i;
  if (moveDirection[0] === 0 &&  moveDirection[1] === 0) {
    return false;
  }
  if (moveDirection[0] === 0 || moveDirection[1] === 0 || Math.abs(moveDirection[0]) === Math.abs(moveDirection[1])) {
    // forward/backward    

    var stepsCount = Math.abs(moveDirection[0] || moveDirection[1]);
    var nextTile;
    var startX = GLOBALS.cols.indexOf(oldpos.split('')[0]);
    var startY = GLOBALS.rows.indexOf(parseInt(oldpos.split('')[1]));

    var xDirection, yDirection;
    moveDirection[0] === 0 ? yDirection = 0 : yDirection = moveDirection[0] / stepsCount;
    moveDirection[1] === 0 ? xDirection = 0 : xDirection = moveDirection[1] / stepsCount;
    var direction = [yDirection, xDirection]

    for (i=1;i<stepsCount;i++) {
      nextTile = GLOBALS.cols[startX+(i*direction[0])] + GLOBALS.rows[startY + (i*direction[1])]
      list.push(nextTile);
    }
    return list;

  } else {
    // invalid move
    return false;
  }
}

Piece.prototype.isValidPawnMove = function (newpos, oldpos, player, opponent, board) {
  var moveDirection = this.getMoveDirection(newpos, oldpos);

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
  var moveDirection = this.getMoveDirection(newpos, oldpos);
  var tiles;

  if (Math.abs(moveDirection[0]) === Math.abs(moveDirection[1])) {
    tiles = this.getSquareList(newpos, oldpos)
    if (tiles && this.squaresAreEmpty(tiles, player, opponent)) {
      return true;
    }
  }
  return false;
}

Piece.prototype.isValidQueenMove = function (newpos, oldpos, player, opponent, board) {
  var moveDirection = this.getMoveDirection(newpos, oldpos);
  var tiles;
  tiles = this.getSquareList(newpos, oldpos)
  if (tiles && this.squaresAreEmpty(tiles, player, opponent)) {
    return true;
  }
  return false;
}


// Returns true if all the tiles in a given array are empty
// Otherwise returns false
Piece.prototype.squaresAreEmpty = function (tilesArr, player, opponent) {
  var occupiedPositions = player.pieces.concat(opponent.pieces).map(function(piece) {return piece.position});
  return tilesArr.every(function(tile) {
    return occupiedPositions.indexOf(tile) === -1;
  });

}


