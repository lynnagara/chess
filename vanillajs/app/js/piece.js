'use strict';

var Piece = function(canvas, color, piece, playForwardDirection) {
  this.canvas = canvas;
  this.color = color;
  this.piece = piece;
  this.playForwardDirection = playForwardDirection;
  this.image = new Image();
  this.image.src = 'images/' + this.color + '/' + this.piece.name + '.svg';
}

Piece.prototype.initialise = function () {
  var self = this;
  this.image.onload = function () {
    self.render(self.piece.position);
  }
}

Piece.prototype.render = function (newpos, oldpos, board) {
  var ctx = this.canvas.getContext('2d');
  var xPos = newpos.split('')[0].charCodeAt(0) - 96;
  var yPos = 9 - newpos.split('')[1];
  if (board) {
    var bgColor = board.getTileColor(newpos);
    ctx.fillStyle = bgColor;
    ctx.fillRect(xPos * 50 - 50, yPos * 50 - 50, 50, 50); 
  }
  var img = this.image;
  ctx.drawImage(
    img, 
    xPos * 50 - 50 + 3, // centering
    yPos * 50 - 50
  );
}

Piece.prototype.renderCaptured = function (player, opponent) {
  var xOffset = 450; // 5 * 8
  var ctx = this.canvas.getContext('2d');
  var num = player.captured.length + opponent.captured.length;
  var xPos = (num - 1) % 5;
  console.log(num % 5)
  var yPos = (num - xPos) / 5;
  var img = this.image;
  ctx.drawImage(
    img, 
    xPos * 50 + xOffset, // centering
    yPos * 50
  );

}

Piece.prototype.isValidMove = function (newpos, oldpos, player, opponent, board) {
  switch(this.piece.name) {
    case 'pawn':
      return this.isValidPawnMove(newpos, oldpos, player, opponent, board);
      break;
    case 'bishop':
      return this.isValidBishopMove(newpos, oldpos, player, opponent, board);
      break;
    case 'rook':
      return this.isValidRookMove(newpos, oldpos, player, opponent, board);
      break;
    case 'queen':
      return this.isValidQueenMove(newpos, oldpos, player, opponent, board);
      break;
    case 'king':
      return this.isValidKingMove(newpos, oldpos, player, opponent, board);
      break;
    case 'knight':
      return this.isValidKnightMove(newpos, oldpos, player, opponent, board);
      break;
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
  var opponentPositions = opponent.pieces.map(function(piece) {return piece.position});
  var directionMultiplier;
  this.playForwardDirection ? directionMultiplier = 1 : directionMultiplier = -1;

  // Move straight ahead
  if (moveDirection[0] === 0) {
    if (moveDirection[1] === 1 * directionMultiplier) {
      // Same column, 1 step forward
      if (this.squaresAreEmpty([newpos], player, opponent)) {
        if (opponentPositions.indexOf(newpos) === -1) {
          return true;
        }
      }
    } else if (moveDirection[1] === 2 * directionMultiplier) {
      var tile = newpos.split('')[0] + parseInt(newpos.split('')[1] - directionMultiplier);
      var tilesArr = [newpos, tile]
      var startingPawnPosition;
      directionMultiplier === 1 ? startingPawnPosition = 2 : startingPawnPosition = 7;
      return parseInt(oldpos.split('')[1]) === startingPawnPosition && this.squaresAreEmpty(tilesArr, player, opponent);
    }
  } else if (Math.abs(moveDirection[0]) === 1 && opponentPositions.indexOf(newpos) !== -1) {
    return true;
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

Piece.prototype.isValidRookMove = function (newpos, oldpos, player, opponent, board) {
  var moveDirection = this.getMoveDirection(newpos, oldpos);
  var tiles;

  if (Math.abs(moveDirection[0]) === 0 || Math.abs(moveDirection[1] === 0)) {
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

Piece.prototype.isValidKingMove = function (newpos, oldpos, player, opponent, board) {
  var moveDirection = this.getMoveDirection(newpos, oldpos);
  var tiles;

  if (Math.abs(moveDirection[0]) === 1 || Math.abs(moveDirection[1] === 1)) {
    tiles = this.getSquareList(newpos, oldpos)
    if (tiles && this.squaresAreEmpty(tiles, player, opponent)) {
      return true;
    }
  }
  return false;
}

Piece.prototype.isValidKnightMove = function (newpos, oldpos, player, opponent, board) {
  var moveDirection = this.getMoveDirection(newpos, oldpos);
  if ((Math.abs(moveDirection[0]) + Math.abs(moveDirection[1]) === 3) && Math.abs(moveDirection[0]) !== 0 && Math.abs(moveDirection[1]) !== 0) {
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


