var GLOBALS = {
  colors: {
    white: '#cccccc',
    black: '#444444'
  }
}

var Game = function () {
  this.canvas = document.createElement('canvas');
  this.canvas.id = 'chess';
  document.body.appendChild(this.canvas);
};

Game.DEFAULTS = {
  colors: {
    white: '#cccccc',
    black: '#444444'   
  }
}

Game.prototype.initialise = function () {
  var tileSizeInPx = 50;
  this.board = new Board(this.canvas, tileSizeInPx);
  this.board.render();
  // Set up player pieces
  var player1 = new Player(this.canvas, 'white', true);
  player1.initialise();
  // var player2 = new Player('black', false);
}



function initialise () {
  var chess = new Game();
  chess.initialise();
}


initialise();