function $(elId){ return document.getElementById(elId); }
function rand(n){ return Math.floor(Math.random() * n);}
function map(f, arr){
  var l =[];
  for(var i=0; i<arr.length; i++){
    l.push(f(arr[i]));
  }
  return l;
}