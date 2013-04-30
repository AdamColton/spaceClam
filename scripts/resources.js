var ResourceManager = {
  requests: [],
  doneLoadingCallback: null,
  loaded:0,
  loadingScreen: {
    image: new Image(),
    src: null,
    loaded: false,
    update: null
  },
  updateLoadingScreen: null,
  image: function(path){
    var img = new Image();
    ResourceManager.requests.push( {img: img, path: path} );
    return img;
  },
  sendRequests: function(){
    if (ResourceManager.loadingScreen.src != null && ResourceManager.loadingScreen.loaded == false){
      ResourceManager.loadingScreen.image.onload = function(){
        ResourceManager.loadingScreen.loaded = true;
        Screen.update(); 
        ResourceManager.sendRequests();
      }
      ResourceManager.loadingScreen.image.src = ResourceManager.loadingScreen.src+"?"+Settings.imageVersion;
    } else if (ResourceManager.requests.length == 0){
      ResourceManager.doneLoadingCallback();
    } else {
      var request = ResourceManager.requests.pop();
      request.img.onload = ResourceManager.sendRequests;
      request.img.src = request.path+"?"+Settings.imageVersion;
      if (console) console.log(request.path);
      ResourceManager.loaded++;
      if (ResourceManager.loadingScreen.update != null) ResourceManager.loadingScreen.update();
    }
  }
}