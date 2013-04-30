<?php $version = "movementDemo36"; ?>
<html>
  <head>
    <title>Movement Demo</title>
    <script src="scripts/library.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/vector.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/linkedList.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/input.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/state.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/resources.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/loading.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/screen.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/sprite.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/background.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/hero.js?<?=$version?>" type="text/javascript"></script>
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
        ResourceManager.doneLoadingCallback = function(){ StateManager.current = main;}
        ResourceManager.sendRequests();
      }
      
      function main(){
        Background.update();
        Hero.update();
        Screen.draw();
      }
      
      var Settings = {
        frameDelay: 25,
        screenSize: new Vector(800,600),
        layers: 4,
        imageVersion: 2,
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