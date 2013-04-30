var Hero = {
  bullets: new List(),
  library:{
    base: new ResourceManager.image("img/ship.png"),
    ram: new ResourceManager.image("img/ram.png"),
    charge: new ResourceManager.image("img/charge.png")
  },
  location: new Vector(380,500),
  size: new Vector(40,40),
  velocity: new Vector(0,0),
  health: 4,
  energy: 4,
  maxEnergy: 6,
  damaged: document.createElement("audio"),
  kills: 0,
  update: function(){
    if (input.up) Hero.velocity.y -= Settings.acceleration * Hero.state.acceleration;
    if (input.down) Hero.velocity.y += Settings.acceleration * Hero.state.acceleration;
    if (input.left) Hero.velocity.x -= Settings.acceleration * Hero.state.acceleration;
    if (input.right) Hero.velocity.x += Settings.acceleration * Hero.state.acceleration;
    Hero.velocity.x *= .99;
    Hero.velocity.y *= .99;
    Hero.location = Hero.location.add(Hero.velocity);
    if (Hero.location.x < 0) Hero.location.x = 0;
    if (Hero.location.x + Hero.size.x > Settings.screenSize.x) Hero.location.x = Settings.screenSize.x - Hero.size.x;
    if (Hero.location.y < 0) Hero.location.y = 0;
    if (Hero.location.y + Hero.size.y > Settings.screenSize.y) Hero.location.y = Settings.screenSize.y - Hero.size.y;
    
    if (input.f && Hero.state.map.f != undefined) Hero.changeState( Hero.state.map.f );
    if (input.a && Hero.state.map.a != undefined) Hero.changeState( Hero.state.map.a );
    if (input.s && Hero.state.map.s != undefined) Hero.changeState( Hero.state.map.s );
    if (input.d && Hero.state.map.d != undefined) Hero.changeState( Hero.state.map.d );
    Hero.baseStateCountDown--;
    if (Hero.baseStateCountDown == 0) {
      Hero.state = Hero.states.base;
      Hero.image = Hero.library.base
    }

    Hero.collisions = 0;
    if(typeof Enemies != "undefined"){
      for(var enemy=Enemies.list.first(); enemy!=Enemies.list.end; enemy=enemy.next){
        if (SpriteCollision(Hero, enemy.payload)){
          enemy.payload.health--;
          Hero.collisions++;
          Hero.health -= Hero.state.collision;
          Hero.state.collided = true;
        }
      }
    }
    
    if (Hero.state.update) Hero.state.update();
    
    Screen.append(Hero, 2);
    Hero.bullets.methodMap("update");
    Hero.bullets.filter(function(bullet){return !Screen.onScreen(bullet);}).map(function(bullet){Hero.bullets.remove(bullet);});
    HUD.update();
  },
  changeState: function(newStateName){
    var newState = Hero.states[newStateName];
    if (Hero.energy + newState.energy >= 0){
      Hero.state = newState;
      Hero.state.collided = false;
      Hero.energy += newState.energy;
      if (Hero.energy > Hero.maxEnergy) Hero.energy = Hero.maxEnergy;
      Hero.baseStateCountDown = Hero.state.duration;
      if (Hero.state.enter) Hero.state.enter();
    }
  },
  states: {
    base: {
      duration: -1,
      acceleration: 1,
      energy: 0,
      collision: 1,
      damage: 1,
      bigDamage: 1,
      map: {
        f: "Single Shot",
        a: "Charge Energy",
        s: "Basic Shield",
        d: "Boost"
      },
    },
    "Single Shot": {
      duration: 20,
      acceleration: 1,
      energy: -1,
      collision: 1,
      damage: 1,
      bigDamage: 1,
      map: {},
      enter: function(){
        new Hero.ammo.shot(Hero.location.add(new Vector(20,-5)));
      }
    },
    "Charge Energy": {
      duration: 40,
      acceleration: .25,
      energy: 1,
      collision: 1,
      damage: 1,
      bigDamage: 1,
      map: {
        d: "Teleport"
      },
      enter: function(){Hero.image = Hero.library.charge}
    },
    "Break": {
      duration: 20,
      acceleration: 1,
      energy: 0,
      collision: 1,
      damage: 1,
      bigDamage: 1,
      map: {},
      enter: function(){
        Hero.velocity = new Vector(0,0);
      }
    },
    "Basic Shield": {
      duration: 40,
      acceleration: 1,
      energy: -1,
      collision: .5,
      damage: 0,
      bigDamage: .5,
      map: {
        f: "Fire Shield",
        d: "Ramming",
        a: "Big Shield"
      },
      update: function(){
        Hero.state.location = Hero.location.add(new Vector(-20, -20));
        Screen.append(Hero.state, 2);
      },
      image: new ResourceManager.image("img/sheild.png"),
      size: new Vector(80, 80)
    },
    "Big Shield": {
      duration: 20,
      acceleration: 1,
      energy: -1,
      collision: 1,
      damage: 0,
      bigDamage: 0,
      map: {
        s: "Cool Down"
      },
      update: function(){
        Hero.state.location = Hero.location.add(new Vector(-20, -20));
        for(var bullet=Enemies.bullets.first(); bullet!=Enemies.bullets.end; bullet=bullet.next){
          if (bullet.payload.damage == 2 && SpriteCollision(bullet.payload, Hero.state)){
            bullet.payload.location = new Vector(-100,-100);
            Hero.energy += 2;
            if (Hero.energy > Hero.maxEnergy) Hero.energy = Hero.maxEnergy;
          }
        }
        Screen.append(Hero.state, 2);
      },
      image: new ResourceManager.image("img/bigShield.png"),
      size: new Vector(80, 80)
    },
    "Cool Down": {
      duration: 20,
      acceleration: 1,
      energy: -1,
      collision: 1,
      damage: 1,
      bigDamage: 1,
      map: {
        a: "Boost Hull"
      },
      enter: function(){Enemies.bullets = new List();}
    },
    "Boost Hull": {
      duration: 20,
      acceleration: 1,
      energy: -1,
      collision: 1,
      damage: 1,
      bigDamage: 1,
      map: {},
      enter: function(){
        Hero.health++;
      }
    },
    "Ramming": {
      duration: 40,
      acceleration: 2,
      energy: -1,
      collision: 0,
      damage: 0,
      bigDamage: 0,
      map: {},
      update: function(){
        Hero.state.collisions += Hero.collisions;
        if (Hero.collisions > 0) Hero.baseStateCountDown = 40;
        if (input.a && Hero.state.collisions){
          Hero.energy += Hero.state.collisions;
          Hero.changeState("Absorb Kill");
        }
      },
      enter: function(){
        Hero.image = Hero.library.ram;
        Hero.state.collisions = 0;
      }
    },
    "Absorb Kill": {
      duration: 20,
      acceleration: 0,
      energy: 0,
      collision: 1,
      damage: 2,
      bigDamage: 1,
      map: {}
    },
    "Fire Shield": {
      duration: 60,
      acceleration: .1,
      energy: -1,
      collision: 0,
      damage: 0,
      bigDamage: 0,
      map: {
        s: "Radial Fire",
        a: "Set Mine"
      },
      update: function(){
        Hero.state.location = Hero.location.add(new Vector(-20, -20));
        if(typeof Enemies != "undefined"){
          for(var enemy=Enemies.list.first(); enemy!=Enemies.list.end; enemy=enemy.next){
            if (SpriteCollision(Hero.state, enemy.payload)) enemy.payload.health--;
          }
        }
        Screen.append(Hero.state, 2);
      },
      image: new ResourceManager.image("img/fireshield.png"),
      size: new Vector(80, 80)
    },
    "Radial Fire": {
      duration: 20,
      acceleration: 1,
      energy: -1,
      collision: 1,
      damage: 1,
      bigDamage: 1,
      map: {},
      enter: function(){
        for(var i=0; i<2*3.1415; i+=.1){
          new Hero.ammo.chainShot(Hero.location, new Polar(8,i));
        }
      }
    },
    "Boost": {
      duration: 40,
      acceleration: 3,
      energy: -1,
      collision: 1,
      damage: 1,
      bigDamage: 1,
      map: {
        f: "Cluster Fire",
        a: "Break"
      }
    },
    "Cluster Fire": {
      duration: 20,
      acceleration: 3,
      energy: -1,
      collision: 1,
      damage: 1,
      bigDamage: 1,
      enter: function(){
        var velocity;
        for(var i=0; i<30; i++){
          velocity = new Vector(Hero.velocity.x, Hero.velocity.y);
          velocity.rotate(Math.random()-.5);
          velocity.setMagnitude(velocity.magnitude()+2+Math.random());
          new Hero.ammo.chainShot(SpriteCenter(Hero), velocity);
        }
      },
      map: {
      }
    },
    "Teleport": {
      duration: 20,
      acceleration: 0,
      energy: -1,
      collision: 1,
      damage: 1,
      bigDamage: 1,
      enter: function(){
        Hero.location = new Vector(380,500);
      },
      map: {
      }
    },
    "Set Mine": {
      duration: 20,
      acceleration: 1,
      energy: -1,
      collision: 1,
      damage: 1,
      bigDamage: 1,
      enter: function(){
        new Hero.ammo.mine(Hero.location);
      },
      map: {
      }
    }
  },
  baseStateCountDown: 0,
  bulletUpdate: function(){
    this.location = this.location.add(this.velocity);
    Screen.append(this, 2);
    if (typeof Enemies != "undefined"){
      var self = this;
      if(typeof Enemies != "undefined"){
        var checkHit = function(enemy){
          Hero.checkHit(self, enemy);
        }
        Enemies.list.map(checkHit);
      }
    }
  },
  checkHit: function(bullet, enemy){
    if (SpriteCollision(bullet, enemy.collisionBox)){
      enemy.health -= bullet.damage;
      bullet.location = new Vector(-100,-100); //offscreen
    }
  },
  ammo: {
    shot: function(location){
      this.location = location;
      Hero.ammo.shot.sound.play();
      Hero.bullets.append(this);
    },
    chainShot: function(location, velocity){
      this.location = location;
      this.velocity = velocity;
      Hero.bullets.append(this);
    },
    mine: function(location){
      this.location = location;
      Hero.bullets.append(this);
    }
  },
  instructions: function(){
    var instructions = "";
    for(var state in Hero.states){
      var keyCombos = ""
      for(var key in Hero.states[state].map){
        keyCombos += "<li>" + key.toUpperCase() + " &rarr; " + Hero.states[state].map[key] + "</li>";
      }
      if (keyCombos != "") instructions += "<h3>From " + state + "</h3><ul>" + keyCombos + "</ul>";
    }
    return instructions;
  }
}
Hero.state = Hero.states.base;
Hero.image = Hero.library.base;
Hero.damaged.setAttribute('src','sound/damage.wav');
Hero.damaged.load();
for(var state in Hero.states){ Hero.states[state].name = state;}

Hero.ammo.shot.prototype.size = new Vector(10,20);
Hero.ammo.shot.prototype.velocity = new Vector(0,-10);
Hero.ammo.shot.prototype.image = new ResourceManager.image("img/shot.png");
Hero.ammo.shot.prototype.update = Hero.bulletUpdate;
Hero.ammo.shot.prototype.damage = 2;
Hero.ammo.shot.sound = document.createElement("audio");
Hero.ammo.shot.sound.setAttribute('src','sound/sound2.wav');
Hero.ammo.shot.sound.load();

Hero.ammo.mine.prototype.size = new Vector(20,20);
Hero.ammo.mine.prototype.image = new ResourceManager.image("img/mine.png");
Hero.ammo.mine.prototype.triggered = false;
Hero.ammo.mine.prototype.update = function(){
  if(typeof Enemies != "undefined"){
    var self = this;
    var checkHit = function(enemy){
      if (SpriteCollision(self, enemy.collisionBox)){
        enemy.health = 0;
        self.triggered = true
      }
    }
    Enemies.list.map(checkHit);
  }
  if (this.triggered){
    for(var i=0; i<2*3.1415; i+=.1){
      var v = new Polar(8,i);
      new Hero.ammo.chainShot(this.location.add(v), v);
    }
    Hero.bullets.remove(this)
  } else {
    Screen.append(this, 1);
  }
};

Hero.ammo.chainShot.prototype.size = new Vector(10,10);
Hero.ammo.chainShot.prototype.image = new ResourceManager.image("img/smallShot.png");
Hero.ammo.chainShot.prototype.update = Hero.bulletUpdate;
Hero.ammo.chainShot.prototype.damage = 3;

var HUD = {
  HealthBar: new ResourceManager.image("img/healthbar.png"),
  EnergyBar: new ResourceManager.image("img/energybar.png"),
  update: function(){
    var i;
    for(i=0; i<Hero.health; i++){
      Screen.append({
        image: HUD.HealthBar,
        size: new Vector(10,20),
        location: new Vector(770-i*15, 10)
      },2);
    }
    for(i=0; i<Hero.energy; i++){
      Screen.append({
        image: HUD.EnergyBar,
        size: new Vector(10,20),
        location: new Vector(10+i*15, 10)
      },2);
    }
    if (Hero.baseStateCountDown > 0){
      Screen.append({
        draw: "line",
        width: 3,
        color: "rgb(255,0,255)",
        location: new Vector(400 - Hero.baseStateCountDown*3, 30),
        size: new Vector(6*Hero.baseStateCountDown, 0),
      },2);
    }
    if (Hero.state != Hero.states.base){
      Screen.append({
        draw: "text",
        text: Hero.state.name,
        color: "rgb(255,0,255)",
        font: "16pt sans-serif",
        size: new Vector(200,50),
        location: new Vector(400 - Hero.state.name.length * 5, 20)
      },2)
    }
    Screen.append({
      draw: "text",
      text: "Kills: "+Hero.kills,
      color: "rgb(255,179,13)",
      font: "16pt sans-serif",
      size: new Vector(200,50),
      location: new Vector(10, 570)
    },3)
  }
}