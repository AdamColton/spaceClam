ResourceManager.loadingScreen.src = "img/loading.png";
ResourceManager.loadingScreen.location = new Vector(0,0);
ResourceManager.loadingScreen.draw = "fixed";
ResourceManager.loadingScreen.size = new Vector(800,600);
Screen.location = new Vector(0,0);
ResourceManager.loadingScreen.update = function(){
  Screen.append(ResourceManager.loadingScreen, 0);
  var loadingText = {
    font: "20pt sans-serif",
    color: "rgb(255,0,0)",
    text: "Loading " + ResourceManager.loaded + " of " + (ResourceManager.loaded + ResourceManager.requests.length),
    size: new Vector(200,20),
    location: new Vector(100,300),
    draw: "text"
  }
  Screen.append(loadingText,1);
  Screen.draw();
}
