var Player = function (element, color, isStartPlayer) {
  this.color = color;
  this.isStartPlayer = isStartPlayer;
  this.element = element;
}

Player.prototype.initialise = function () {
  base_image = new Image();
  base_image.src = 'images/' + this.color + '/rook.svg';
  var ctx = this.element.getContext('2d');
  base_image.onload = function(){
    ctx.drawImage(base_image, 50, 50);
  }
}

