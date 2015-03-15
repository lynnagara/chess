describe('Board', function(){
  var canvas, board;
  beforeEach(function() {
    canvas = document.createElement('canvas');
    board = new Board(canvas, 50);
    board.render();
  });
  describe('render()', function() {
    it('renders board without error', function(done) {
      expect(board.tiles).to.have.length(64);
      done();
    });
  });
  describe('getTileColor()', function() {
    it('should return the right tile color', function(done) {
      expect(board.getTileColor('a1')).to.equal('#444444');
      expect(board.getTileColor('d7')).to.equal('#cccccc');
      done();
    });
  });
});