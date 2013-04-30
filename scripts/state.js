var StateManager = {
  current: false,
  runCurrentState: function(){
    if (StateManager.current) StateManager.current();
  }
}