<?php $version = "enemyDemo110"; ?>
<html>
  <head>
    <title>Enemy Demo</title>
    <script src="scripts/library.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/vector.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/linkedList.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/grid.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/input.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/state.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/resources.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/screen.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/sprite.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/background.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/hero.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/enemy.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/loading.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/reset.js?<?=$version?>" type="text/javascript"></script>
    <script type="text/javascript">
      function startDemo(){
        var canvas = $("canvas");
        Screen.buffer = $("buffer");
        Screen.ctx = Screen.buffer.getContext("2d");
        Screen.canvasCtx = canvas.getContext("2d");
        
        $("instructions").innerHTML = Hero.instructions();
        
        Screen.init();
        input.init();
        Background.init();
        
        setInterval( StateManager.runCurrentState, Settings.frameDelay );
        ResourceManager.doneLoadingCallback = function(){ StateManager.current = doneLoading;}
        ResourceManager.sendRequests();
        
        Enemies.strategies.push(function(){
          for(var i=0; i<4 ; i++){
            new Dummy( new Vector(rand(300)+50, -30), new Vector(rand(6)-3, Math.random()+3));
          }
        });
        Enemies.strategies.push(function(){
          new Homer();
        });
        Enemies.strategies.push(function(){
          new shieldTrainer( new Vector(rand(300)+50, -30));
        });
        Enemies.strategies.push(function(){
          new Radial( new Vector(rand(300)+50, -20) );
        });
        Enemies.strategies.push(function(){
          new Avoider( new Vector(rand(300)+50, -20) );
        });
        Enemies.strategies.push(function(){
          new shieldTrainer( new Vector(rand(300)+50, -30));
          new shieldTrainer( new Vector(rand(300)+50, -30));
        });
        Enemies.strategies.push(function(){
          new Dummy( new Vector(rand(300)+50, -30), new Vector(rand(6)-3, Math.random()+3));
          new Radial( new Vector(rand(300)+50, -20) );
        });
        Enemies.strategies.push(function(){
          new Dummy( new Vector(rand(300)+50, -30), new Vector(rand(6)-3, Math.random()+3));
          new Homer( new Vector(rand(300)+50, -20) );
        });
      }
      
      function doneLoading(){
        Screen.append(ResourceManager.loadingScreen,0);
        Screen.append({
          font: "20pt sans-serif",
          color: "rgb(255,0,0)",
          text: "Press arrow keys to start",
          size: new Vector(200,20),
          location: new Vector(100,300),
          draw: "text"},1)
        Screen.draw();
        if (input.up || input.down || input.left || input.right) StateManager.current = main;
      }
      
      function main(){
        Background.update();
        Enemies.update();
        Hero.update();
        Screen.draw();
        if (Hero.health <= 0) StateManager.current = GameOver;
      }
      
      function GameOver(){
        Background.update();
        Screen.append({
          draw: "text",
          text: "Game Over - Press Space to play again",
          color: "rgb(255,0,0)",
          font: "30pt sans-serif",
          size: new Vector(200,50),
          location: new Vector(35, 400)
        },2);
        Screen.append({
          draw: "text",
          text: "Score: " + Hero.kills,
          color: "rgb(247,255,92)",
          font: "30pt sans-serif",
          size: new Vector(200,50),
          location: new Vector(300, 200)
        },2);
        if (input.space) reset();
        Screen.draw()
      }
      
      var Settings = {
        frameDelay: 25,
        screenSize: new Vector(800,600),
        layers: 4,
        imageVersion: "enemy1",
        acceleration: .5
      }
    </script>
    <style>
      #buffer{
        display: none;
      }
      canvas{
        cursor: none;
      }
      #game{
        float:left;
      }
      #instructionContainer{
        padding-left: 810px;
      }
    </style>
  </head>
  <body onload="startDemo();" id="body">
    <div id="game">
      <canvas id="canvas" width="800" height="600"></canvas>
      <canvas id="buffer" width="800" height="600"></canvas>
    </div>
    <div  id="instructionContainer">
      <h3>Key Combos</h3>
      <div id="instructions"></div>
    </div>
  </body>
</html>