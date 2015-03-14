describe('Board', function(){
  describe('render()', function() {
    var canvas, board;
    beforeEach(function() {
      canvas = document.createElement('canvas');
      board = new Board(canvas, 80);
      board.render();
    });
    it('renders board without error', function(done) {
      expect(board.tiles).to.have.length(64);
      done();
    });
  });
});