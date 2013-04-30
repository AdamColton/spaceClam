var input = {
  up: false,
  down: false,
  left: false,
  right: false,
  a: false,
  s: false,
  d: false,
  f: false,
  space: false,
  keyEvent:function(e, val){
    switch(input.getKeynum(e)){
      case 38:
        input.up = val;
        break;
      case 40:
        input.down = val;
        break;
      case 37:
        input.left = val;
        break;
      case 39:
        input.right = val;
        break;
      case 65:
        input.a = val;
        break;
      case 83:
        input.s = val;
        break;
      case 68:
        input.d = val;
        break;
      case 70:
        input.f = val;
        break;
      case 32:
        input.space = val;
        break;
      case 17:
      case 116:
      case 123:
        //Allows the user to hit F5 or ctrl+F5
        return true;
    }
    return false;
  },
  keydownEvent:function(e){
    return input.keyEvent(e, true);
  },
  keyupEvent:function(e){
    return input.keyEvent(e, false);
  },
  getKeynum: function(e){
    if(window.event){
      // IE
      return e.keyCode;
    }else if(e.which){
      // Netscape/Firefox/Opera
      return e.which;
    }
  },
  init: function(){
    window.onkeydown = input.keydownEvent;
    window.onkeyup = input.keyupEvent;
  }
};