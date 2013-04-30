function reset(){
  Hero.bullets = new List();
  Hero.location = new Vector(380,500);
  Hero.velocity = new Vector(0,0);
  Hero.state = Hero.states.base;
  Hero.image = Hero.library.base;
  Hero.kills = 0;
  Hero.health = 4;
  Hero.energy = 4;
  
  Enemies.list = new List();
  Enemies.bullets = new List();
  
  StateManager.current = main;
}