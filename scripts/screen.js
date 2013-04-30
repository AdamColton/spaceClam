var Screen = {
  init: function(){
    Screen._half = Settings.screenSize.divideByNumber(2);
    Screen._offset = new Vector(-Settings.screenSize.x/2, -Settings.screenSize.y/2);
    Screen.location = new Vector(0,0);
    Screen.resetDrawSprites();
  },
  onScreen: function(sprite){
    return sprite.draw == "fixed" || sprite.draw == "slice" || sprite.draw == "fixedtext" || (SpriteRight(sprite) > ScreenLeft() && SpriteLeft(sprite) < ScreenRight() && SpriteTop(sprite) < ScreenBottom() && SpriteBottom(sprite) > ScreenTop());
  },
  follow: function(sprite){
    Screen._follow = sprite;
  },
  update: function(){
    if (Screen._follow){
      Screen.location = SpriteCenter(Screen._follow).subtract( Screen._half ).toInts();
    }
  },
  drawFixed: function(sprite){
      Screen.ctx.drawImage(sprite.image, sprite.location.x, sprite.location.y);
  },
  drawRelative:function(sprite){
    var drawAt = sprite.location.subtract(Screen.location).toInts();
    Screen.ctx.drawImage(sprite.image, drawAt.x, drawAt.y);
  },
  drawSprite: function(sprite){
    var drawAt = sprite.location.subtract(Screen.location).toInts();
    Screen.ctx.drawImage(sprite.image, sprite.size.x*sprite.frame, sprite.size.y*sprite.state, sprite.size.x, sprite.size.y, drawAt.x, drawAt.y, sprite.size.x, sprite.size.y);
  },
  drawSliced:function(sprite){
    Screen.ctx.drawImage(sprite.image, 0, 0, sprite.size.x, sprite.size.y, sprite.location.x, sprite.location.y, sprite.size.x, sprite.size.y);
  },
  drawText: function(sprite){
    var drawAt = sprite.location.subtract(Screen.location).toInts();
    Screen.ctx.lineWidth = 1;
    Screen.ctx.font = sprite.font;
    Screen.ctx.fillStyle = sprite.color;
    Screen.ctx.beginPath();
    Screen.ctx.fillText(sprite.text, drawAt.x, drawAt.y);
    Screen.ctx.stroke();
  },
  drawFixedText: function(sprite){
    Screen.ctx.lineWidth = 1;
    Screen.ctx.font = sprite.font;
    Screen.ctx.fillStyle = sprite.color;
    Screen.ctx.beginPath();
    Screen.ctx.fillText(sprite.text, sprite.location.x, sprite.location.y);
    Screen.ctx.stroke();
  },
  drawLine:function(sprite){
    var drawAt = sprite.location.subtract(Screen.location).toInts();
    Screen.ctx.lineWidth = sprite.width;
    Screen.ctx.strokeStyle = sprite.color;
    Screen.ctx.beginPath();
    Screen.ctx.moveTo(drawAt.x, drawAt.y);
    Screen.ctx.lineTo(drawAt.x + sprite.size.x, drawAt.y + sprite.size.y);
    Screen.ctx.stroke();
  },
  append: function(sprite, layer){
    Screen.drawSprites[layer].push(sprite);
  },
  draw: function(){
    Screen.update();
    var layer, i , j;
    for(i=0; i<Screen.drawSprites.length; i++){
      layer = [];
      for(j in Screen.drawSprites[i]){
        if (Screen.onScreen(Screen.drawSprites[i][j])) { layer.push(Screen.drawSprites[i][j]); }
      }
      layer.sort(sortLayer);
      for(j=0; j<layer.length; j++){
        sprite = layer[j];
        if (sprite.draw == "fixed"){
          Screen.drawFixed(sprite);
        }else if (sprite.draw == "line"){
          Screen.drawLine(sprite);
        }else if (sprite.draw == "slice"){
          Screen.drawSliced(sprite);
        }else if (sprite.draw == "text"){
          Screen.drawText(sprite);
        }else if (sprite.draw == "fixedtext"){
          Screen.drawFixedText(sprite);
        }else if (sprite.draw == "sprite"){
          Screen.drawSprite(sprite);
        }else{
          Screen.drawRelative(sprite);
        }
      }
    }
    Screen.resetDrawSprites();
    Screen.canvasCtx.drawImage( Screen.buffer, 0, 0);
  },
  resetDrawSprites: function(){
    Screen.drawSprites = [];
    for(var i=0; i<Settings.layers; i++) { Screen.drawSprites.push([]); }
  }
};

function localToGlobal(v){
  var r = SpriteCenter(Hero).subtract(Screen._half).add(v).add(new Vector(-7,-7));
  return r;
}

function sortLayer(a,b){
  var a_y = a.location.y;
  var b_y = b.location.y;
  if (a.collisionBox) a_y = a.collisionBox.location.y;
  if (b.collisionBox) b_y = b.collisionBox.location.y;
  return a_y - b_y;
}

function ScreenTop(){
  return Screen.location.y;
}

function ScreenBottom(){
  return Screen.location.y + Settings.screenSize.y;
}

function ScreenLeft(){
  return Screen.location.x;
}

function ScreenRight(){
  return Screen.location.x + Settings.screenSize.x;
}

function ScreenWidth(){
  return Settings.screenSize.x;
}

function ScreenHeight(){
  return Settings.screenSize.y;
}

function ScreenCenter(){
  return Screen.location.add(new Vector(Settings.screenSize.x/2, Settings.screenSize.y/2));
}