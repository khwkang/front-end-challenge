// Native implementation of resource loader based on jQuery ajax

(function(global) {

  // cache storage for resources sucsessfully loaded 
  var _resources = {};
  
  var tinyRequire = function(paths, callback) {

    // uncached paths storage 
    var uncachedPaths = [];
    // ajax requests
    var requests = [];

    for (var i = 0; i < paths.length; i++) {
      var currentPath = paths[i];
      // check if resource is already cached
      if (!_resources[currentPath]) {
        // store uncached path names
        uncachedPaths.push(currentPath);
        // initialize the ajax requests based on resources type(JSON/others) and store it
        requests.push(
          /.*\.json/.test(currentPath) ?
            $.getJSON(currentPath) :
            $.get(currentPath)
        );
      }
    }

    // when all the requests have been resolved
    $.when.apply($, requests).done(function() { 
      for (var i = 0; i < uncachedPaths.length; i++) {
        var currentUncachedPath = uncachedPaths[i];
        // cache the sucsessfuly retrieved data into resources storage
        _resources[currentUncachedPath] = arguments[i][0];
      }

      // copy of finalized resources 
      var dependingResources = [];

      // get the cached resources into finalized resources storage
      for (var j = 0; j < paths.length; j++) {
        var currentPath = paths[j];
        dependingResources.push(_resources[currentPath]);
      }
      // feed the callback function with finalized resources
      callback.apply(global, dependingResources);
    });
  }

  // export the module to global 
  global.tinyRequire = tinyRequire;
}(this));
