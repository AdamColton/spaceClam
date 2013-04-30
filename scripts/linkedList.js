var guidGenerator = function(){
  var counter = 0;
  return function (){
    counter++;
    return counter;
  };
}();

function Node(payload, list){
  this.prev = null;
  this.next = null;
  this.payload = payload;
  this.list = list;
}

function List(){
  this.start = new Node(null, this);
  this.end = new Node(null, this);
  this.start.next = this.end;
  this.end.prev = this.start;
  this.length = 0;
}

List.prototype.append = function(payload){
  this.length++;
  var node = new Node(payload, this);
  node.next = this.end;
  node.prev = this.end.prev;
  this.end.prev.next = node;
  this.end.prev = node;
  if (!payload.guid) payload.guid = guidGenerator();
  this[payload.guid] = node;
  return List;
};

List.prototype.remove = function(payload){
  node = this[payload.guid];
  if (node === undefined){
    console.log("error");
  }
  node.prev.next = node.next;
  node.next.prev = node.prev;
  node.prev = null;
  node.next = null;
  delete this[payload.guid];
  this.length--;
  return this;
};

List.prototype.next = function(payload){
  var node = this[payload.guid];
  if (node.next === this.end){
    return this.start.next.payload;
  } else {
    return node.next.payload;
  }
}
List.prototype.prev = function(payload){
  var node = this[payload.guid];
  if (node.prev === this.start){
    return this.end.prev.payload;
  } else {
    return node.prev.payload;
  }
}

//depricated
List.prototype.first = function(){
  return this.start.next;
};

List.prototype.isEmpty = function(){
  return this.start.next === this.end;
};

List.prototype.get = function(i){
  i = i % this.length;
  var node = this.first();
  for(var n=0; n<i ; n++){
    node = node.next;
  }
  return node.payload;
}

List.prototype.map = function(func){
  var arr = [];
  var funcResult;
  for(var i=this.first() ; i!=this.end ; i=i.next){
    funcResult = func(i.payload);
    if (funcResult !== null && funcResult !== undefined) arr.push(funcResult);
  }
  return arr;
}

List.prototype.methodMap = function(meth){
  var arr = [];
  var funcResult;
  for(var i=this.first() ; i!=this.end ; i=i.next){
    funcResult = i.payload[meth]();
    if (funcResult !== null && funcResult !== undefined) arr.push(funcResult);
  }
  return arr;
}

List.prototype.filter = function(func){
  var l = new List();
  for(var i=this.first() ; i!=this.end ; i=i.next){
    if (func(i.payload)) l.append(i.payload);
  }
  return l;
}

//returns the first match
List.prototype.match = function(func){
  var l = new List();
  for(var i=this.first() ; i!=this.end ; i=i.next){
    if (func(i.payload)) return i.payload;
  }
}