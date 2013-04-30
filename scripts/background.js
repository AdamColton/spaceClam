var Background = {
  starLevels: 4,
  starCount: 100,
  blackBackground: {
    draw: "fixed",
    image: new ResourceManager.image("img/background/blankBackground.png"),
    size: new Vector(800,600),
    location: new Vector(0,0)
  },
  init: function(){
    var i;
    Background.starImages = [];
    for(i=0; i<Background.starLevels; i++){
      Background.starImages[i] = new ResourceManager.image("img/background/star"+i+".png");
    }
    Background.stars = new List();
    for(i=0; i<Background.starCount; i++){
      Background.stars.append(new Star());
    }
  },
  update: function(){
    Screen.append(Background.blackBackground, 0);
    Background.stars.methodMap("update");
  }
}

function Star(){
  this.level = rand(Background.starLevels);
  this.location = new Vector( rand(Settings.screenSize.x), rand(Settings.screenSize.y));
  this.image = Background.starImages[this.level];
  this.c = Math.random();
}
Star.prototype.update = function(){
  this.location.y += Background.starLevels - this.level + this.c;
  if (this.location.y > Settings.screenSize.y){
    this.level = rand(Background.starLevels);
    this.location = new Vector( rand(Settings.screenSize.x), 0);
    this.image = Background.starImages[this.level];
  }
  Screen.append(this, 1);
}
Star.prototype.size = new Vector(3,3);