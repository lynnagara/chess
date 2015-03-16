describe('Piece', function (){
  var piece, canvas;

  beforeEach(function() {

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
      expect(piece.isValidMove('a5','a2', player, opponent, board)).to.equal(false);
      expect(piece.isValidMove('a5','d2', player, opponent, board)).to.equal(false);
      expect(piece.isValidMove('d4','d2', player, opponent, board)).to.equal(true);
      done();
    });
  });
  describe('getSquareList()', function () {
    it ('returns the list of squares 2 points', function (done) {
      // same cell
      expect(piece.getSquareList('a2','a2')).to.equal(false)
      // foward/backward
      expect(piece.getSquareList('a2','a5')).to.deep.equal(['a4','a3']);
      expect(piece.getSquareList('d5','d4')).to.deep.equal([]);
      // sideways
      expect(piece.getSquareList('c1','a1')).to.deep.equal(['b1']);
      expect(piece.getSquareList('f1','a1')).to.deep.equal(['b1','c1','d1','e1']);
      // diagonal
      expect(piece.getSquareList('a1','d4')).to.deep.equal(['c3','b2']);
      // invalid
      expect(piece.getSquareList('a1','d3')).to.equal(false);
      expect(piece.getSquareList('b1','b1')).to.equal(false);
      // finish
      done();
    });
  });
});