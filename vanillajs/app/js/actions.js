'use strict';

var Actions = function (chess) {
  this.canvas = chess.canvas;
  this.turn = chess.turn;
  this.board = chess.board;
  this.player1 = chess.player1;
  this.player2 = chess.player2;
  this.selectedTile = null;
}

Actions.prototype.initialise = function () {

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

Actions.prototype.handleSelection = function (tile) {
  
  if (!this.selectedTile) {
    // Check if the tile can be selected
    var listOfPlayerPositions = this[this.turn].pieces.map(function(piece) {return piece.position});
    if (listOfPlayerPositions.indexOf(tile) > -1) {
        this.selectTile(tile);
    }

  } else {
    // Check if valid first..
    this.unselectTile(this.selectedTile);
  }
}

Actions.prototype.selectTile = function (tile) {
    var x = tile.split('')[0];
    var y = parseInt(tile.split('')[1]);
    var ctx = this.canvas.getContext('2d');
    ctx.strokeStyle = GLOBALS.colors.selected;
    ctx.lineWidth = 1;
    ctx.strokeRect(GLOBALS.cols.indexOf(x) * 50 + 1, ((7 - GLOBALS.rows.indexOf(y)) * 50) + 1, 48, 48);    
    this.selectedTile = tile;
}

Actions.prototype.unselectTile = function () {
  var x = this.selectedTile.split('')[0];
  var y = parseInt(this.selectedTile.split('')[1]);
  var ctx = this.canvas.getContext('2d');
  ctx.strokeStyle = this.board.getTileColor(this.selectedTile);
  ctx.lineWidth = 2;
  ctx.strokeRect(GLOBALS.cols.indexOf(x) * 50 + 1, ((7 - GLOBALS.rows.indexOf(y)) * 50) + 1, 48, 48);    
  this.selectedTile = null;
}



