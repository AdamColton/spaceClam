<?php $version = "trainingDemo49"; ?>
<html>
  <head>
    <title>Training Demo</title>
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
    <script src="scripts/training.js?<?=$version?>" type="text/javascript"></script>
    <script type="text/javascript">
      function startDemo(){
        var canvas = $("canvas");
        Screen.buffer = $("buffer");
        Screen.ctx = Screen.buffer.getContext("2d");
        Screen.canvasCtx = canvas.getContext("2d");
        
        Screen.init();
        input.init();
        Background.init();
        
        setInterval( StateManager.runCurrentState, Settings.frameDelay );
        ResourceManager.doneLoadingCallback = function(){ StateManager.current = main;}
        ResourceManager.sendRequests();
      }
      
      function main(){
        Background.update();
        Enemies.update();
        Training.update();
        Hero.update();
        Screen.draw();
        if (Hero.health <= 0) StateManager.current = GameOver;
      }
      
      function GameOver(){
        Background.update();
        Screen.append({
          draw: "text",
          text: "Game Over",
          color: "rgb(255,0,0)",
          font: "30pt sans-serif",
          size: new Vector(200,50),
          location: new Vector(200, 400)
        },2)
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
    </style>
  </head>
  <body onload="startDemo();" id="body">
    <canvas id="canvas" width="800" height="600"></canvas>
    <canvas id="buffer" width="800" height="600"></canvas>
  </body>
</html>