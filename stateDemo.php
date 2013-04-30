<?php $version = 96; ?>
<html>
  <head>
    <title>State Demo</title>
    <script src="scripts/library.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/input.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/state.js?<?=$version?>" type="text/javascript"></script>
    <script>
      function startDemo(){
        input.init();
        setInterval( StateManager.runCurrentState, Settings.frameDelay );
        StateManager.current = state1;
      }
      
      function state1(){
        State1Counter += 1;
        $("body").innerHTML = "State 1: "+State1Counter + "<br /> Hold up to change state";
        if (input.up) StateManager.current = state2;
      }
      var State1Counter = 0;
      
      function state2(){
        State2Counter += 1;
        $("body").innerHTML = "State 2: "+State2Counter + "<br /> Hold up to change state";
        if (input.up) StateManager.current = state1;
      }
      var State2Counter = 0;
      
      var Settings = {
        frameDelay: 1000
      }
    </script>
  </head>
  <body onload="startDemo();" id="body">
  </body>
</html>