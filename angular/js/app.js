/**
 * Create an angular module (referenced in `ng-app` on the DOM).
 *
 * Below uses method chaining for simplicity and presentation purposes. It is
 * best practice to separate your files and bring them together through some
 * build process (grunt/gulp have a lot of tools).
 */
angular.module("angularCF", ['ngAnimate'])

    // Set a global constant for use elsewhere through dependency injection
    .constant("HTTP_BASE_URL", "/rest/resttest/")

//  SINGLETON SERVICES

    // A simple, remote http service using the module pattern
    .factory("ArtService", ['$rootScope', '$http', '$q', 'HTTP_BASE_URL', function($rootScope, $http, $q, HTTP_BASE_URL){
        var ART_EDIT = "edityoartyo",
            ART_UPDATED ="artupdatedyo"; // custom event names

        var all = function(){
            var deferred = $q.defer();

            // You could easily just return this line here. Using $q is purely a preference
            $http.get(HTTP_BASE_URL+'artService.json').success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        };

        var edit = function(art){
            art = angular.copy(art);
            if (art) {
                // Broadcast an event from the root level scope
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

                    // Resolve the promise with the arguments received in this callback
                    deferred.resolve.apply(this, arguments);
                }).error(deferred.reject);
            }

            return deferred.promise;
        };

    //  EVENT HELPERS
        // This is a convenience/helper method for subscribing to events
        var onArtEdit = function($scope, handler){
            $scope.$on(ART_EDIT, function(event, art){
                if (handler)
                    handler(art);
            });
        };

        var onArtUpdated = function($scope, handler){
            $scope.$on(ART_UPDATED, function(event, art){
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

    // A "local" data management service singleton
    .factory("CartService", ['$rootScope', '$http', function($rootScope, $http){
        var items = [],
            CART_UPDATED = "CART::UPDATED"; // custom event name

        var add = function(art){
            items.push(art);

            $rootScope.$broadcast(CART_UPDATED, items.length);
        };

    //  EVENT HELPERS
        var onCartUpdate = function($scope, handler){
            $scope.$on(CART_UPDATED, function(event, length){
                if (handler)
                    handler(length);
            });
        };

    //  MODULE
        return {
            add: add,
            items: function(){ // just showing you can have a function right here
                return items;
            },
            onCartUpdate: onCartUpdate
        };
    }])

//  CONTROLLERS

    // A controller using $scope to get data to the DOM
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
            // Absolutely not the way I'd normally do it. Just for preso purposes.
            for (var i = 0, len = $scope.artPieces.length; i < len; i++) {
                if (art.ID == $scope.artPieces[i].ID) {
                    $scope.artPieces.splice(i, 1);
                    break;
                }
            }
        }

        // Some methods on the scope are just pass through methods
        // like this case where we just want to call ArtService without
        // having to write extra code like `addToCart` above.
        $scope.editArt = ArtService.edit;

    //  EVENT LISTENERS
        // Use the event helper on `ArtService` to subscribe to art update events.
        // This approach has the advantage of not having to mess with `$rootScope`
        // and not having to know the event names being dispatched.
        ArtService.onArtUpdated($scope, function(art){
            // Again, another time I wouldn't do this normally.
            for (var i = 0, len = $scope.artPieces.length; i < len; i++) {
                if (art.ID == $scope.artPieces[i].ID) {
                    $scope.artPieces[i] = angular.copy(art);
                    break;
                }
            }
        });

        // Initialize the controller (see above)
        init();
    })

    // A controller not using `$scope` to get data to the DOM
    .controller('EditArtController', function($scope, $timeout, ArtService){
        // By creating this we always have a way of getting the context of the
        // controller. See more here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
        var self = this;

        // A public method available on the DOM
        self.save = function(){
            ArtService.update(self.selectedArt).then(null, function(errors){
                alert(errors);
            })
        };

    //  EVENT LISTENERS
        // Subscribe to edit events
        ArtService.onArtEdit($scope, function(art){
            // If you uncomment this `$timeout`, you can see a delayed DOM
            // update in the modal.

            // $timeout(function(){
                self.selectedArt = art;
            // }, 1000);
        });
    })

    // Another controller not using `$scope` to provide DOM access
    .controller("CartController", function($scope, CartService){
        var self = this; // simple helper for avoiding `this` issues
        self.cartLength = 0; // Public variable available in the DOM
        self.items = []; // Public variable available in the DOM

    //  EVENT LISTENERS
        CartService.onCartUpdate($scope, function(length){
            self.cartLength = length; // Set the length to update the DOM

            // Get the latest items from the cart. This isn't used in the DOM
            // but you could switch out the `{{cartLength}}` binding to use
            // {{items.length}} to see the array. You can also spit out the
            // array using the `json` filter `{{items | json}}`.
            self.items = CartService.items();
        });
    });