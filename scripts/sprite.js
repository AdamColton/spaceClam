function SpriteLeft(sprite){
  if (sprite.size.x < 0)
    return sprite.location.x + sprite.size.x;
  else
    return sprite.location.x;
}

function SpriteRight(sprite){
  if (sprite.size.x < 0)
    return sprite.location.x
  else
    return sprite.location.x + sprite.size.x;
}

function SpriteTop(sprite){
  if (sprite.size.y < 0)
    return sprite.location.y + sprite.size.y
  else
    return sprite.location.y;
}

function SpriteBottom(sprite){
  if (sprite.size.y < 0)
    return sprite.location.y
  else
    return sprite.location.y + sprite.size.y;
}

function SpriteCenter(sprite){
  return sprite.location.add( sprite.size.divideByNumber(2.0) );
}

function pointInSprite(sprite, point){
  return (point.x >= sprite.location.x) && (point.x < sprite.location.x + sprite.size.x) && (point.y > sprite.location.y) && (point.y < sprite.location.y + sprite.size.y);
}

function SpriteCollision(A,B){
  return (SpriteLeft(A) <= SpriteRight(B) && SpriteRight(A) >= SpriteLeft(B) && SpriteTop(A) <= SpriteBottom(B) && SpriteBottom(A) >= SpriteTop(B));
}

function Decollide(A,B){
  var l = new Vector(SpriteLeft(B.collisionBox) - SpriteRight(A.collisionBox), 0);
  var r = new Vector(SpriteRight(B.collisionBox) - SpriteLeft(A.collisionBox), 0);
  var u = new Vector(0, SpriteTop(B.collisionBox) - SpriteBottom(A.collisionBox));
  var d = new Vector(0, SpriteBottom(B.collisionBox) - SpriteTop(A.collisionBox));
  var offset = l;
  var o_m = offset.magnitude();
  if (o_m > r.magnitude()){
    offset = r;
    o_m = r.magnitude();
  }
  if (o_m > d.magnitude()){
    offset = d;
    o_m = d.magnitude();
  }
  if (o_m > u.magnitude()){
    offset = u;
    o_m = u.magnitude();
  }
  A.location = A.location.add(offset);
}