/*
Grids are used for collision detection. They provide a fast way to check an area for sprites.
*/
function GridLocation(v){
  var dx = (v.x % 40);
  var dy = (v.y % 40);
  if (dx < 0) dx += 40
  if (dy < 0) dy += 40
  var x = v.x - dx;
  var y = v.y - dy;
  return new Vector(x,y);
}

function Grid(){
}
Grid.prototype.get = function(v){
  v = GridLocation(v);
  if (this[v.x] === undefined) {
    this[v.x] = {};
    this[v.x][v.y] = new List();
  } else if (this[v.x][v.y] === undefined) {
    this[v.x][v.y] = new List();
  }
  return this[v.x][v.y];
};
Grid.prototype.append = function(sprite){
  return this.get(sprite.collisionBox.location).append(sprite);
};
Grid.prototype.occupied = function(v){
  v = GridLocation(v);
  if (this[v.x] === undefined) return false;
  if (this[v.x][v.y] === undefined) return false;
  return !this[v.x][v.y].isEmpty();
}
Grid.prototype.remove = function(obj){
  return this.get(obj.collisionBox.location).remove(obj);
}

function SingleGrid(){
}
SingleGrid.prototype.get = function(v){
  v = GridLocation(v);
  if (this[v.x] === undefined) return;
  return this[v.x][v.y];
};
SingleGrid.prototype.add = function(sprite){
  var v = GridLocation(sprite.collisionBox.location);
  if (this[v.x] === undefined) this[v.x] = {};
  this[v.x][v.y] = sprite;
};
SingleGrid.prototype.occupied = function(v){
  v = GridLocation(v);
  if (this[v.x] === undefined) return false;
  if (this[v.x][v.y] === undefined) return false;
  return true;
}
SingleGrid.prototype.remove = function(obj){
  var v = GridLocation(obj.collisionBox.location);
  delete this[v.x][v.y];
}