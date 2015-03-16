describe('Piece', function (){
  var piece, canvas;
  var GLOBALS;

  beforeEach(function() {
    GLOBALS = {
      colors: {
        white: '#cccccc',
        black: '#444444',
        selected: '#ff0000'
      },
      rows: [1,2,3,4,5,6,7,8],
      cols: ['a','b','c','d','e','f','g','h']
    }

    canvas = document.createElement('canvas');
    color = 'white';
    p = {name:'pawn', position:'a2'}
    piece = new Piece(canvas, color, p);
    piece.initialise();
  });
  describe('initalise()', function () {
    it('creates piece successfully', function (done) {
      expect(piece.color).to.equal('white');
      expect(piece.image.src).to.contain('/images/white/pawn.svg');
      done();
    });
  });

  describe('isValidMove()', function () {
    var board, player, opponent;
    beforeEach(function() {
      board = new Board(canvas, 50);
      board.render();
      player = new Player(canvas, 'white');
      opponent = new Player(canvas, 'black');
      player.initialise();
      opponent.initialise();
    });
    it ('validates moves correctly', function (done) {
      expect(piece.isValidMove('a3','a2', player, opponent, board)).to.equal(true);
      done();
    });
  });
});