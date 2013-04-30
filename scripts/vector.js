function Vector(x,y){
  this.x = x;
  this.y = y;
}

Vector.prototype.add = function(other){
  return new Vector(this.x + other.x, this.y + other.y);
};

Vector.prototype.reverse = function(other){
  this.x = -this.x;
  this.y = -this.y;
  return this;
}

Vector.prototype.toInts = function(){
  return new Vector(Math.round(this.x), Math.round(this.y));
};

Vector.prototype.subtract = function(other){
  return new Vector(this.x - other.x, this.y - other.y);
};

Vector.prototype.angle = function(){
  return Math.atan2(this.x, this.y);
};

Vector.prototype.rotate = function(angle){
  angle += this.angle();
  var magnitude = this.magnitude();
  this.x = Math.sin(angle) * magnitude;
  this.y = Math.cos(angle) * magnitude;
  return this;
};

Vector.prototype.setMagnitude = function(m){
  if (this.magnitude() === 0){
    this.x = 0;
    this.y = 0;
  } else {
    var d = m / this.magnitude();
    this.x *= d;
    this.y *= d;
  }
  return this;
};

Vector.prototype.magnitude = function(){
  return Math.sqrt(this.x*this.x + this.y*this.y);
};

Vector.prototype.divideByNumber = function(n){
  return new Vector(this.x/n, this.y/n);
};

Vector.prototype.arr = function(){
  return [this.x, this.y];
};

Vector.prototype.isEqual = function(other){
  return this.x == other.x && this.y == other.y;
};

function Polar(magnitude, angle){
  return new Vector(Math.sin(angle) * magnitude, Math.cos(angle) * magnitude);
}

function Distance(v1, v2){
  return Math.sqrt((v1.x-v2.x)*(v1.x-v2.x) + (v1.y-v2.y)*(v1.y-v2.y));
}