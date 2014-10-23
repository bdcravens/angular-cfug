var angularCF = angular.module("angularCF", ['ngAnimate'])

    // Set a global constant for use elsewhere
    .constant("HTTP_BASE_URL", "http://104.131.190.213/rest/resttest/")

//  SERVICES

    // A simple, remote http service
    .factory("ArtService", ['$rootScope', '$http', '$q', 'HTTP_BASE_URL', function($rootScope, $http, $q, HTTP_BASE_URL){
        var ART_EDIT = "edityoartyo",
            ART_UPDATED ="artupdatedyo"; // custom event names

        var all = function(){
            var deferred = $q.defer();

            $http.get(HTTP_BASE_URL+'artService.json').success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        };

        var edit = function(art){
            art = angular.copy(art);
            if (art) {
                $rootScope.$broadcast(ART_EDIT, art);
            }
        };

        var update = function(art){
            var deferred = $q.defer();

            // Just toggle to use either approach
            if (true){
                $rootScope.$broadcast(ART_UPDATED, art);
                deferred.resolve();
            } else {
                $http.put(HTTP_BASE_URL+'artService.json', art).success(function(){
                    // Dispatch the event to notify listeners first
                    $rootScope.$broadcast(ART_UPDATED, art);

                    deferred.resolve.apply(this, arguments);
                }).error(deferred.reject);
            }

            return deferred.promise;
        };

        var onArtEdit = function($scope, handler){
            $rootScope.$on(ART_EDIT, function(event, art){
                if (handler)
                    handler(art);
            });
        };

        var onArtUpdated = function($scope, handler){
            $rootScope.$on(ART_UPDATED, function(event, art){
                if (handler)
                    handler(art);
            });
        };

    //  MODULE
        return {
            all: all,
            edit: edit,
            update: update,
            onArtEdit: onArtEdit,
            onArtUpdated: onArtUpdated
        };
    }])

    // A simple, global data management service
    .factory("CartService", ['$rootScope', '$http', function($rootScope, $http){
        var items = [],
            CART_UPDATED = "CART::UPDATED"; // custom event name

        var add = function(art){
            items.push(art);

            $rootScope.$broadcast(CART_UPDATED, items.length);
        };

        var onCartUpdate = function($scope, handler){
            $scope.$on(CART_UPDATED, function(event, length){
                if (handler)
                    handler(length);
            });
        };

    //  MODULE
        return {
            add: add,
            items: function(){
                return items;
            },
            onCartUpdate: onCartUpdate
        };
    }])

//  CONTROLLERS

    // Using $scope
    .controller("ArtController", function($scope, ArtService, CartService){
        $scope.artPieces = null;

        var init = function(){
            ArtService.all().then(function(results){
                $scope.artPieces = results;
            }, function(error){
                $scope.artPieces = [];

                // maybe show an error here?
            });
        };

        $scope.addToCart = function(art){
            CartService.add(art);
        };

        $scope.deleteArt = function(art){
            for (var i = 0, len = $scope.artPieces.length; i < len; i++) {
                if (art.ID == $scope.artPieces[i].ID) {
                    $scope.artPieces.splice(i, 1);
                    break;
                }
            }
        }

        $scope.editArt = ArtService.edit;

        ArtService.onArtUpdated($scope, function(art){
            for (var i = 0, len = $scope.artPieces.length; i < len; i++) {
                if (art.ID == $scope.artPieces[i].ID) {
                    $scope.artPieces[i] = angular.copy(art);
                    break;
                }
            }
        });

        init();
    })

    .controller('EditArtController', function($scope, $timeout, ArtService){
        var editArt = this;

        editArt.save = function(){
            ArtService.update(editArt.selectedArt).then(null, function(errors){
                alert(errors);
            })
        };

        ArtService.onArtEdit($scope, function(art){
            // $timeout(function(){
                editArt.selectedArt = art;
            // }, 0); // value just to show it update
        });
    })

    // Different controller syntax
    .controller("CartController", function($scope, CartService){
        var cart = this; // simple helper for avoiding `this` issues
        cart.cartLength = 0;
        cart.items = [];

        CartService.onCartUpdate($scope, function(length){
            cart.cartLength = length;
            cart.items = CartService.items();
        });
    });