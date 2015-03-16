'use strict';

var Moves = function (chess) {
  this.canvas = chess.canvas;
  this.turn = chess.turn;
  this.board = chess.board;
  this.player1 = chess.player1;
  this.player2 = chess.player2;
  this.selectedTile = null;
}

Moves.prototype.initialise = function () {

  function handleClick (event) {
    // Get the tile name
    var x = GLOBALS.cols[Math.floor(event.clientX / 50)];
    var y = 9 - GLOBALS.rows[Math.floor(event.clientY / 50)];
    if (!x || !y) return;
    var tile = x + y;

    this.handleSelection(tile);

  }

  // Add event listeners
  this.canvas.addEventListener('mousedown', handleClick.bind(this), false);
}

Moves.prototype.handleSelection = function (tile) {
  
  var listOfPlayerPositions = this[this.turn].pieces.map(function(piece) {return piece.position});
  var from, turn, idx;

  if (!this.selectedTile) {
    // Check if the tile can be selected
    if (listOfPlayerPositions.indexOf(tile) > -1) {
        this.selectTile(tile);
    }
  } else {
    // Check if the move is valid...
    turn = this.turn;
    idx = listOfPlayerPositions.indexOf(this.selectedTile);
    from = this[this.turn].pieces[idx];

    if (this.isValidMove(from, tile, idx)) {
      this.movePiece(from, tile, turn);
    } else {
      this.unselectTile(this.selectedTile);      
    }
  }
}

Moves.prototype.isValidMove = function (from, toPos, idx) {
  var piece = this[this.turn].piecesList[idx];
  var player = this[this.turn];
  var opponent;
  this[this.turn] === this.player1 ? opponent = this.player2 : opponent = this.player1;
  var isValid = piece.isValidMove(toPos, from.position, player, opponent, this.board);
  return isValid;
}

Moves.prototype.movePiece = function (from, newpos, turn) {

  var image = new Image();
  image.src = 'images/' + this[turn].color + '/' + from.name + '.svg';
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
  this.clearTile(from.position);
  // Update array
  var idx = this[this.turn].pieces
    .map(function(piece) { return JSON.stringify(piece)})
    .indexOf(JSON.stringify(from));
  this[this.turn].pieces[idx].position = newpos;
}

Moves.prototype.selectTile = function (tile) {
    var x = tile.split('')[0];
    var y = parseInt(tile.split('')[1]);
    var ctx = this.canvas.getContext('2d');
    ctx.strokeStyle = GLOBALS.colors.selected;
    ctx.lineWidth = 1;
    ctx.strokeRect(GLOBALS.cols.indexOf(x) * 50 + 1, ((7 - GLOBALS.rows.indexOf(y)) * 50) + 1, 48, 48);    
    this.selectedTile = tile;
}

Moves.prototype.unselectTile = function () {
  var x = this.selectedTile.split('')[0];
  var y = parseInt(this.selectedTile.split('')[1]);
  var ctx = this.canvas.getContext('2d');
  ctx.strokeStyle = this.board.getTileColor(this.selectedTile);
  ctx.lineWidth = 2;
  ctx.strokeRect(GLOBALS.cols.indexOf(x) * 50 + 1, ((7 - GLOBALS.rows.indexOf(y)) * 50) + 1, 48, 48);    
  this.selectedTile = null;
}

Moves.prototype.clearTile = function (tile) {
  var x = tile.split('')[0];
  var y = parseInt(tile.split('')[1]);
  var ctx = this.canvas.getContext('2d');
  ctx.fillStyle = this.board.getTileColor(tile);
  ctx.fillRect(GLOBALS.cols.indexOf(x) * 50, ((7 - GLOBALS.rows.indexOf(y)) * 50), 50, 50);    
  this.selectedTile = null;
}





