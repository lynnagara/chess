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

  this.renderTurnText();
  
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
  if (this.wouldBeChecked(player, opponent, from, newpos)) {
    // would make it CHECK
    return false;
  } else if (player.pieces.map(function(piece) {return piece.position}).indexOf(newpos) > -1) {
    // no move made
    return false;
  } else {
    var piece = this[this.turn].piecesList[idx];
    var isValid = piece.isValidMove(newpos, from.position, player.pieces, opponent.pieces);
    return isValid;
  }
}

Moves.prototype.wouldBeChecked = function (player, opponent, from, newpos) {

  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // Deep copy the player objects
  var playerPieces = deepCopy(player.pieces)
  var opponentPieces = deepCopy(opponent.pieces)

  // Perform the play
  var idx = playerPieces
    .map(function(piece) { return JSON.stringify(piece)})
    .indexOf(JSON.stringify(from));
  
  playerPieces[idx].position = newpos;
  // was there a capture?
  var capturedIdx = opponentPieces.map(function(piece) {return piece.position}).indexOf(newpos);

  var kingPos = playerPieces.filter (
    function(piece) {if (piece.name === 'king') {return true;}}
  )[0].position;

  return opponent.piecesList.some(function(piece, idx) {
    if (capturedIdx === idx) {
      return false; // just return false, this piece is no longer valid
    } else {
      return piece.isValidMove(kingPos, piece.piece.position, playerPieces, opponentPieces);
    }
  }, this);
}

Moves.prototype.isCheck = function (from, newpos, player, opponent) {
  var kingPos = opponent.pieces.filter (
    function(piece) {if (piece.name === 'king') {return true;}}
  )[0].position;
  return player.piecesList.some(function(piece, idx) {
    return piece.isValidMove(kingPos, piece.piece.position, player.pieces, opponent.pieces);
  }, this);
}

Moves.prototype.isCheckMate = function (from, newpos, player, opponent) {
  // Checkmate scenarios - 
  // 1. Is it possible to capture the piece that has just moved into the 'check' position?
  // 2. Can king move to another position?
  // 3. Can another piece block the check?
  function canCaptureCheckingPiece() {
    // Loop through player pieces, and see if you can capture the piece that lost
    return !opponent.piecesList.some(function(piece, idx) {
      return piece.isValidMove(newpos, piece.piece.position, opponent.pieces, player.pieces);
    });
  }

  function canMoveKing() {
    // Get address of all available squares around the king
    var kingPos = opponent.pieces.filter (
      function(piece) {if (piece.name === 'king') {return true;}}
    )[0].position;
    var tiles = [];
    var x, y;
    var yIdx = GLOBALS.cols.indexOf(kingPos.split('')[0]);
    var xIdx = GLOBALS.rows.indexOf(parseInt(kingPos.split('')[1]));
    [0,1,2,3,4,5,6,7,8].forEach(function(i) {
      y = i % 3;
      x = (i - y)/3;
    });

  }

  canMoveKing();
  return true;
  // if (canCaptureCheckingPiece()) {
  //   return false;
  // } else {
  //   canMoveKing();
  //   return true;
  // }
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
  this.renderTurnText();
  if (this.isCheck(from, newpos, player, opponent)) {
    if (this.isCheckMate(from, newpos, player, opponent)) {
      console.log('checkmate');
    } else {
      console.log('check');
    }
  } else {
    console.log('not checked')
  }
}

Moves.prototype.renderTurnText = function () {
  var playerDisplayName;
  this.turn === 'player1' ? playerDisplayName = 'White' : playerDisplayName = 'Black';
  var ctx = this.canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';  
  ctx.fillRect(420, 0, 250, 50);

  ctx.fillStyle = GLOBALS.colors.black;
  ctx.font = '20px sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText(playerDisplayName + '\'s turn', 420, 10);
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

