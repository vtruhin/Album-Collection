/* Album Collection Controllers */
 
var albumControllers = angular.module('albumControllers', []);

/**
 * Retrieves an album collection.
 *
 * @param $scope                  An object that
 *                                refers to the
 *                                application
 *                                model.
 * 
 * @param albumResourceService    Provides RESTful
 *                                services.               
 */

albumControllers.controller('retrieveCollectionController', ['$scope', 'albumResourceService',
  function ($scope, albumResourceService) {
    
    $scope.collection = albumResourceService.query();
    $scope.orderProp = 'artist';
    
    console.log('Albums retrieved');
    
    $scope.order = function (input) {
      
      switch(input) {
        case 'Title':
          $scope.orderProp = 'title';
          break;
        case 'Artist':
          $scope.orderProp = 'artist';
          break;
        case 'Year':
          $scope.orderProp = 'year';
          break;
        default:
          $scope.orderProp = 'artist';
      }
    };
  }
]);

/**
 * Retrieves an album from a collection.
 * 
 * @param $routeParams    Provides access to route
 *                        parameters.                 
 */

albumControllers.controller('retrieveAlbumController', ['$scope', '$routeParams', 'albumResourceService',
  function ($scope, $routeParams, albumResourceService) {
    
    $scope.album = albumResourceService.get({albumTitle: $routeParams.albumTitle});
    
    console.log('Album retrieved');
  }
]);

/**
 * Updates an album in a collection.
 *
 * @param $modalInstance   Contains information
 *                         about $modal service.
 * 
 * @param album            Album in the current
 *                         scope.
 */

albumControllers.controller('updateAlbumController', ['$scope', '$modalInstance', 'album', 'albumResourceService',
  function ($scope, $modalInstance, album, albumResourceService) {
    
    $scope.albumCopy = {
      title  : album.title,
      artist : album.artist,
      genre  : album.genre,
      tracks : [],
      year   : album.year
    }
    
    $scope.trackListing = {
      tracks : [{track: ""}]
    }
    
    for(i = 0; i < album.tracks.length; i++) {
      $scope.trackListing.tracks[i] = {track: album.tracks[i]};
    }
    
    $scope.removeTrack = function (index) {
      
      for(i = index; i < $scope.trackListing.tracks.length - 1; i++) {
        $scope.trackListing.tracks[i] = $scope.trackListing.tracks[i + 1];
      }
      
      $scope.trackListing.tracks.pop();
    };
    
    $scope.addTrack = function (index) {
      
      for(i = $scope.trackListing.tracks.length; i > index + 1; i--) {
        $scope.trackListing.tracks[i] = $scope.trackListing.tracks[i - 1];
      }
      
      $scope.trackListing.tracks[index + 1] = {track: ""};
    };
    
    $scope.ok = function () {
      
      var originalTitle = album.title;
      
      for(i = 0; i < $scope.trackListing.tracks.length; i++) {
        if($scope.trackListing.tracks[i].track) {
          $scope.albumCopy.tracks.push($scope.trackListing.tracks[i].track);
        }
      }
      
      var updateAlbum = albumResourceService.get({albumTitle: originalTitle}, function () {
        
        updateAlbum.title  = $scope.albumCopy.title;
        updateAlbum.artist = $scope.albumCopy.artist;
        updateAlbum.genre  = $scope.albumCopy.genre;
        updateAlbum.tracks = $scope.albumCopy.tracks;
        updateAlbum.year   = $scope.albumCopy.year;
        
        updateAlbum.$update({albumTitle: originalTitle});
        
        console.log('Album updated');
      });
      
      $modalInstance.close($scope.albumCopy);
    };
    
    $scope.cancel = function () {
      
      $modalInstance.dismiss('cancel');
    };
  }
]);

/**
 * Creates a modal for updating an album.
 *
 * @param $modal    Service for creating AngularJS
 *                  modal windows.
 *
 * @see             ui.bootstrap.modal
 */

albumControllers.controller('updateAlbumModalController',  ['$scope', '$modal',
  function ($scope, $modal) {
    
    $scope.updateAlbum = function () {
      
      var modalInstance = $modal.open({
        templateUrl : 'modals/editAlbumModal.html',
        controller  : 'updateAlbumController',
        resolve     : {
          album     : function () {
            return $scope.album;
          }
        }
      });
      
      modalInstance.result.then(function (updateAlbum) {
        $scope.album.title = updateAlbum.title;
        $scope.album.artist = updateAlbum.artist;
        $scope.album.genre = updateAlbum.genre;
        $scope.album.tracks = updateAlbum.tracks;
        $scope.album.year = updateAlbum.year;
      });
      
    };
  }
]);

/**
 * Removes an album from the collection.
 *
 * @param $location   Service that parses the URL
 *                    in the browser's address bar
 */

albumControllers.controller('removeAlbumController', ['$scope', '$location', '$modalInstance', 'album', 'albumResourceService',
  function ($scope, $location, $modalInstance, album, albumResourceService) {
    
    $scope.album = album;
    
    $scope.ok = function () {
      
      albumResourceService.delete({albumTitle: album.title}, function () {
        
        $location.path('#');
        
        console.log('Album removed');
      });
      
      $modalInstance.close();
    };
    
    $scope.cancel = function () {
      
      $modalInstance.dismiss('cancel');
    };
  }
]);

/* creates a modal for confirming album removal */

albumControllers.controller('removeAlbumModalController',  ['$scope', '$modal',
  function ($scope, $modal) {
    
    $scope.removeAlbum = function () {
      
      var modalInstance = $modal.open({
        templateUrl : 'modals/removeAlbumModal.html',
        controller  : 'removeAlbumController',
        resolve     : {
          album     : function () {
            return $scope.album;
          }
        }
      });
    };
  }
]);


/* initializes the scope of the dropdown menu */

albumControllers.controller('dropdownController', ['$scope',
  function ($scope) {
    
    $scope.options = ['Title', 'Artist', 'Year'];
  }
]);

/* validates user input */

albumControllers.controller('inputValidationController', ['$scope',
  function ($scope) {
    
    $scope.keyValidate = function (key) {
      
      var charecterCode = (key.which) ? key.which : event.keyCode
      
      if (charecterCode < 48 || charecterCode > 57) {
        return false;
      }
      
      return true;
    };
  } 
]);
