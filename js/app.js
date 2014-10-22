var angularCF = angular.module("angularCF", ['ngAnimate'])

    // Set a global constant for use elsewhere
    .constant("HTTP_BASE_URL", "http://104.131.190.213/rest/resttest/")

//  SERVICES

    // A simple, remote http service
    .factory("ArtService", ['$http', '$q', 'HTTP_BASE_URL', function($http, $q, HTTP_BASE_URL){

        var all = function(){
            var deferred = $q.defer();

            $http.get(HTTP_BASE_URL+'artService.json').success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        };

    //  MODULE
        return {
            all: all
        };
    }])

    // A simple, global data management service
    .factory("CartService", ['$rootScope', '$http', '$q', function($rootScope, $http, $q){
        var items = [],
            CART_UPDATED = "CART::UPDATED"; // custom event name

        var add = function(art){
            items.push(art);

            $rootScope.$broadcast(CART_UPDATED, items.length);
        };

        var onCartUpdate = function($scope, handler){
            $rootScope.$on(CART_UPDATED, function(event, length){
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

        init();
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