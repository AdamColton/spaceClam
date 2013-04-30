var Enemies = {
  list: new List(),
  strategies: [],
  bullets: new List(),
  update: function(){
    Enemies.grid = new Grid();
    Enemies.list.filter(function(enemy){
      if (enemy.health <= 0) Hero.kills++;
      return enemy.health <= 0 || !Screen.onScreen(enemy);
    }).map(function(enemy){Enemies.list.remove(enemy);})
    Enemies.list.methodMap("update");
    if (Enemies.list.length == 0 && Enemies.strategies.length > 0) Enemies.strategies[rand(Enemies.strategies.length)]();
    Enemies.bullets.methodMap("update");
    Enemies.bullets.filter(function(bullet){return !Screen.onScreen(bullet);}).map(function(bullet){Enemies.bullets.remove(bullet);});
  },
  ammo: {
    shot: function(location, velocity){
      this.location = location;
      if (velocity != undefined){
        this.velocity = velocity;
      }
      Enemies.bullets.append(this);
    },
    bigShot: function(location, velocity){
      this.location = location;
      this.velocity = velocity;
      Enemies.bullets.append(this);
    }
  }
}

Enemies.ammo.shot.prototype.image = new ResourceManager.image("img/enemies/shot.png");
Enemies.ammo.shot.prototype.velocity = new Vector(0, 10);
Enemies.ammo.shot.prototype.size = new Vector(10,10);
Enemies.ammo.shot.prototype.damage = 1;
Enemies.ammo.shot.prototype.update = function(){
  this.location = this.location.add(this.velocity);
  Screen.append(this, 2);
  if (SpriteCollision(this, Hero)){
    this.location = new Vector(-100,-100); //offscreen
    Hero.health -= this.damage * Hero.state.damage;
    if (Hero.state.damage > 0) Hero.damaged.play();
  }
}

Enemies.ammo.bigShot.prototype.image = new ResourceManager.image("img/enemies/bigShot.png");
Enemies.ammo.bigShot.prototype.size = new Vector(10,20);
Enemies.ammo.bigShot.prototype.damage = 2;
Enemies.ammo.bigShot.prototype.update = function(){
  this.location = this.location.add(this.velocity);
  Screen.append(this, 2);
  if (SpriteCollision(this, Hero)){
    this.location = new Vector(-100,-100); //offscreen
    Hero.health -= this.damage * Hero.state.bigDamage;
    if (Hero.state.bigDamage > 0) Hero.damaged.play();
  }
}

function Dummy(location, velocity){
  this.location = location;
  this.velocity = velocity;
  this.collisionBox = this;
  Enemies.list.append(this);
}
Dummy.prototype.size = new Vector(40,40);
Dummy.prototype.image = new ResourceManager.image("img/enemies/dummy.png");
Dummy.prototype.health = 2;
Dummy.prototype.fire = true;
Dummy.prototype.update = function(){
  this.location = this.location.add(this.velocity);
  Screen.append(this,2);
  var bigShotVelocity = new Vector(this.velocity.x, this.velocity.y);
  bigShotVelocity.setMagnitude(bigShotVelocity.magnitude()+2);
  if (rand(100)<3 && this.fire) new Enemies.ammo.shot(this.location.add(new Vector(20,5)));
  if (rand(100)>97 && this.fire) new Enemies.ammo.bigShot(this.location.add(new Vector(20,5)), bigShotVelocity);
  Enemies.grid.append(this);
}

function shieldTrainer(location){
  this.location = location;
  this.collisionBox = this;
  Enemies.list.append(this);
  this.delay = 5;
}
shieldTrainer.prototype.size = new Vector(40,40);
shieldTrainer.prototype.velocity = new Vector(0,3);
shieldTrainer.prototype.image = new ResourceManager.image("img/enemies/shieldTrainer.png");
shieldTrainer.prototype.health = 2;
shieldTrainer.prototype.update = function(){
  this.location = this.location.add(this.velocity);
  Screen.append(this,2);
  this.delay-=1;
  if (this.delay == 0){
    this.delay = 5;
    new Enemies.ammo.bigShot(this.location.add(new Vector(20,5)), new Vector(-5,10));
    new Enemies.ammo.bigShot(this.location.add(new Vector(20,5)), new Vector(5,10));
  }
  Enemies.grid.append(this);
}

function Homer(){
  this.location = new Vector(20, -30);
  this.collisionBox = this;
  this.homing = false;
  Enemies.list.append(this);
  this.delay = 5;
}
Homer.prototype.size = new Vector(40,40);
Homer.prototype.velocity = new Vector(0,3);
Homer.prototype.image = new ResourceManager.image("img/enemies/homer.png");
Homer.prototype.health = 2;
Homer.prototype.update = function(){
  if (this.homing){
    var v = new Vector(1,1);
    if (this.location.x > Hero.location.x) v.x = -1;
    if (this.location.y > Hero.location.y) v.y = -1;
    v.setMagnitude(5);
    this.velocity = v;
  } else {
    this.delay--;
    if (this.delay == 0){
      this.delay = 5;
      new Enemies.ammo.bigShot(this.location.add(new Vector(50,20)), new Vector(10,0));
    }
    if (Math.random()<.01) this.homing = true;
  }
  this.location = this.location.add(this.velocity);
  Screen.append(this,2);
  Enemies.grid.append(this);
}

function Radial(location){
  this.location = location;
  this.collisionBox = this;
  this.seekingCenter = true;
  Enemies.list.append(this);
  this.delay = 10;
}
Radial.prototype.size = new Vector(40,40);
Radial.prototype.velocity = new Vector(0,3);
Radial.prototype.image = new ResourceManager.image("img/enemies/radial.png");
Radial.prototype.health = 2;
Radial.prototype.update = function(){
  if (this.seekingCenter){
    var v = new Vector(1,1);
    var center = ScreenCenter()
    if (this.location.x - center.x > 2) v.x = -1;
    if (this.location.y - center.y > 2) v.y = -1;
    if (Math.abs(this.location.x - center.x) < 10 && Math.abs(this.location.y - center.y) < 10 ) this.seekingCenter = false;
    v.setMagnitude(7);
    this.velocity = v;
  } else {
    this.velocity = new Vector(0,0);
  }
  this.delay--;
  if (this.delay == 0){
    this.delay = 50;
    var c = 2*3.1415/20
    for(var i=Math.random() * c; i<2*3.1415; i+=c){
      new Enemies.ammo.shot(this.location, new Polar(8,i));
    }
  }
  this.location = this.location.add(this.velocity);
  Screen.append(this,2);
  Enemies.grid.append(this);
}

function Avoider(location){
  this.location = location
  this.collisionBox = this;
  Enemies.list.append(this);
  this.delay = 20;
}
Avoider.prototype.size = new Vector(40,40);
Avoider.prototype.velocity = new Vector(0,3);
Avoider.prototype.image = new ResourceManager.image("img/enemies/avoider.png");
Avoider.prototype.health = 2;
Avoider.prototype.update = function(){
  var d = Hero.location.subtract(this.location);
  this.delay--;
  if (this.delay <= 0){
    this.delay = 20;
    new Enemies.ammo.shot(this.location, Hero.location.subtract(this.location).setMagnitude(8));
  }
  if (d.magnitude() < 300){
    d.setMagnitude(-5);
  } else {
    d.setMagnitude(5);
  }
  this.location = this.location.add(d);
  Screen.append(this,2);
  Enemies.grid.append(this);
}