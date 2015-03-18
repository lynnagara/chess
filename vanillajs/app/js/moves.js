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
  var player = this[this.turn];
  var opponent;
  this[this.turn] === this.player1 ? opponent = this.player2 : opponent = this.player1;


  if (!this.selectedTile) {
    // Check if the tile can be selected
    if (listOfPlayerPositions.indexOf(tile) > -1) {
        this.selectTile(tile);
    }
  } else {
    // Check if the move is valid...
    idx = listOfPlayerPositions.indexOf(this.selectedTile);
    from = this[this.turn].pieces[idx];

    if (this.isValidMove(from, tile, player, opponent, idx)) {
      this.movePiece(from, tile, player, opponent);
    } else {
      this.unselectTile(this.selectedTile);      
    }
  }
}

Moves.prototype.isValidMove = function (from, newpos, player, opponent, idx) {
  if (player.pieces.map(function(piece) {return piece.position}).indexOf(newpos) > -1) {
    return false;
  } else {
    var piece = this[this.turn].piecesList[idx];
    var isValid = piece.isValidMove(newpos, from.position, player, opponent, this.board);
    return isValid;
  }
}

Moves.prototype.movePiece = function (from, newpos, player, opponent) {
  // Get idx in player's array
  var idx = this[this.turn].pieces
    .map(function(piece) { return JSON.stringify(piece)})
    .indexOf(JSON.stringify(from));
  var piece = this[this.turn].piecesList[idx];
  piece.render(newpos, from.position, this.board);
  this.clearTile(from.position);
  // Update array
  this[this.turn].pieces[idx].position = newpos;
  // Check if there is a capture
  var opponentIdx = opponent.pieces.map(function(piece) {return piece.position}).indexOf(newpos);
  if (opponentIdx > -1) {
    // get the index in the opponents list
    opponent.pieces.splice(opponentIdx, 1);
    var captured = opponent.piecesList.splice(opponentIdx, 1)[0];
    opponent.captured.push(captured);
    captured.renderCaptured(player, opponent);
  }

  // It's the other players turn
  this.turn === 'player1' ? this.turn = 'player2' : this.turn = 'player1';
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





