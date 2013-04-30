var Training = {
  update: function(){
    if (Training.state.update) Training.state.update();
    Screen.append(Training.textSprite, 2)
    if (Training.state.pass()){
      Training.state = Training.steps.pop();
      if (Training.state.enter) Training.state.enter();
      Training.textSprite.text = Training.state.text;
      if (Training.state.delay) Training.state.pass = Training.delay;
    }
  },
  steps:[],
  textSprite:{
    draw: "text",
    text: "",
    color: "rgb(255,179,13)",
    font: "16pt sans-serif",
    size: new Vector(200,50),
    location: new Vector(10, 100)
  },
  delay: function(){return (this.delay--) == 0;}
}

Training.steps.push({
  text:"Training Complete",
  pass: function(){return false},
  enter: function(){window.location = "/spaceClam/enemyDemo.php";}
});

Training.steps.push({
  text: "1",
  delay: 40
});

Training.steps.push({
  text: "2",
  delay: 40
});

Training.steps.push({
  text: "3",
  delay: 40
});

Training.steps.push({
  text: "Don't forget your training and look for other combos",
  delay: 80
});

Training.steps.push({
  text: "Great - now on to the game",
  delay: 80
});

Training.steps.push({
  text: "Try killing these target by ramming them, then absorb their energy",
  pass: function(){return Hero.state == Hero.states["Absorb Kill"];},
  enter: function(){
    new Dummy(new Vector(100, 150), new Vector(3,0));
    new Dummy(new Vector(200, 150), new Vector(3,0));
  },
  update: function(){
    if (Enemies.list.length == 1 && Hero.state != Hero.states["Ramming"]){
      var dummy = new Dummy(new Vector(100, 150), new Vector(0,3));
      dummy.fire = false;
    }
  }
});

Training.steps.push({
  text: "After destroying your targets, you can press A to absorb their energy",
  delay: 80,
  enter: function(){Hero.energy = 6;}
});

Training.steps.push({
  text: "Good - one more step",
  delay: 80,
  enter: function(){Hero.energy = 6;}
});

Training.steps.push({
  text: "Try killing these target by ramming them",
  pass: function(){return Enemies.list.length == 0 && Hero.state == Hero.states["Ramming"];},
  enter: function(){
    new Dummy(new Vector(100, 150), new Vector(3,0));
    new Dummy(new Vector(200, 150), new Vector(3,0));
  },
  update: function(){
    if (Enemies.list.length == 1 && Hero.state != Hero.states["Ramming"]){
      var dummy = new Dummy(new Vector(100, 150), new Vector(3,0));
      dummy.fire = false;
    }
  }
});

Training.steps.push({
  text: "This time, try hitting two targets",
  delay: 80,
  enter: function(){Hero.energy = 6;}
});

Training.steps.push({
  text: "Notice that when you hit something, your time starts again",
  delay: 80,
  enter: function(){Hero.energy = 6;}
});

Training.steps.push({
  text: "Try killing this target by ramming it",
  pass: function(){return Enemies.list.length == 0 && Hero.state == Hero.states["Ramming"];},
  enter: function(){
    var dummy = new Dummy(new Vector(350, 150), new Vector(0,3));
    dummy.fire = false;
  },
  update: function(){
    if (Enemies.list.length == 0 && Hero.state != Hero.states["Ramming"]){
      var dummy = new Dummy(new Vector(350, 150), new Vector(0,3));
      dummy.fire = false;
    }
  }
});

Training.steps.push({
  text: "In ramming state you are impervious to attack",
  delay: 80,
  enter: function(){Hero.energy = 6;}
});

Training.steps.push({
  text: "Now press S then D to go into Ramming mode",
  pass: function(){return Hero.state == Hero.states["Ramming"];}
});

Training.steps.push({
  text: "Let's try some ramming",
  delay: 80,
  enter: function(){Hero.energy = 6;}
});

Training.steps.push({
  text: "Try killing this target with either your base weapon or a cluster fire.",
  pass: function(){return Enemies.list.length == 0 && Enemies.bullets.length == 0;},
  enter: function(){
    var dummy = new Dummy(new Vector(0, 150), new Vector(3,0));
    dummy.fire = false;
    var velocity = new Vector(0,5);
    for(var i=0; i<800; i+=30){
      new Enemies.ammo.bigShot(new Vector(i,0), velocity);
    }
  }
});

Training.steps.push({
  text: "This will also absorb energy from big rounds, lets try.",
  delay: 80,
  enter: function(){Hero.energy = 2;}
});

Training.steps.push({
  text: "Now press S then A to activate the big shield",
  pass: function(){return Hero.state == Hero.states["Big Shield"];}
});

Training.steps.push({
  text: "Those were small munitions, but the shield won't protect you from bigger rounds.",
  delay: 80,
  enter: function(){Hero.energy = 6;}
});

Training.steps.push({
  text: "Now destroy the target",
  pass: function(){return Enemies.list.length == 0;}
});

Training.steps.push({
  text: "Press S",
  pass: function(){return Enemies.bullets.length == 0;},
  enter: function(){
    var dummy = new Dummy(new Vector(0, 150), new Vector(2,0));
    dummy.fire = false;
    for(var i=0; i<800; i+=50){
      new Enemies.ammo.shot(new Vector(i,0));
    }
  }
});

Training.steps.push({
  text: "1",
  delay: 40
});

Training.steps.push({
  text: "2 (Remember S for Shield)",
  delay: 40
});

Training.steps.push({
  text: "3",
  delay: 40
});

Training.steps.push({
  text: "Good now use your shield (S) to protect yourself, then destroy the target",
  delay: 80,
  enter: function(){Hero.energy = 6;}
});

Training.steps.push({
  text: "Try killing this target with either your base weapon or a cluster fire.",
  pass: function(){return Enemies.list.length == 0;},
  enter: function(){
    var dummy = new Dummy(new Vector(350, 150), new Vector(0,0));
    dummy.fire = false;
  }
});

Training.steps.push({
  text: "Ok - lets refill your energy and try some fighting",
  delay: 80,
  enter: function(){Hero.energy = 6;}
});

Training.steps.push({
  text:"Good Job. This is a cluster fire.",
  delay: 120
});

Training.steps.push({
  text: "Now press D then F (if you're out of energy, press A until you have 2)",
  pass: function(){return Hero.state == Hero.states["Cluster Fire"];}
});

Training.steps.push({
  text: "OK - start moving again",
  pass: function(){return input.up || input.down || input.left || input.right;}
});

Training.steps.push({
  text:"Good Job. This brings you to a complete stop",
  delay: 120
});

Training.steps.push({
  text: "Press D, then before the bar empties press A.",
  pass: function(){return Hero.state == Hero.states["Break"];}
});

Training.steps.push({
  text:"Some actions can be chained for special moves",
  delay: 120
});

Training.steps.push({
  text: "Press D and then the arrow keys to boost.",
  pass: function(){return input.d;}
});

Training.steps.push({
  text: "Press S to activate your shield",
  pass: function(){return input.s;}
});

Training.steps.push({
  text:"The purble bar is the timer for your current mode",
  delay: 120
});

Training.steps.push({
  text: "Press A again. Notice the purple bar at the top.",
  pass: function(){return input.a;}
});

Training.steps.push({
  text: "Some actions use energy. You can hold up to 6 energy.",
  delay: 120
});

Training.steps.push({
  text: "Press A to Charge. This will add one energy.",
  pass: function(){return input.a;}
});

Training.steps.push({
  text: "Press F to Fire a single shot. This will use one energy.",
  pass: function(){return input.f;}
});

Training.steps.push({
  text:"You have a lot of momentum, so be light on the controls",
  delay: 120
});

Training.steps.push({
  text: "Use the arrow keys to Move around",
  pass: function(){return input.up || input.down || input.left || input.right;}
});

Training.state = {
  pass: function(){return true;}
}