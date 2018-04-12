'use strict';

angular.module('BarchartTest', [
  'ngRoute'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('');

  $routeProvider.otherwise({ redirectTo: '/' });

  $routeProvider.when('/', {
    templateUrl: 'view.html',
    controller: 'ViewController'
  });
}]).
controller('ViewController', ['$scope', 'ViewFactory', function($scope, viewFactory) {
  $scope.toAdd = '';

  $scope.data = viewFactory.get();

  $scope.add = function () {
    viewFactory.add($scope.toAdd);
  };

}]).
service('ViewFactory', ['$interval', function ($interval) {
  var data = [],
      minPrice = 100,
      maxPrice = 1000;

  for(var i = 0; i < 4; i++) {
    data.push(_generateModel());
  }

  this.get = function () {
    return data;
  };

  this.add = function (symbol) {
    data.push(_generateModel(symbol));
  };

  $interval(function () {
    data.forEach(function (item) {
      var newPrice = _generateRandomPrice(minPrice, maxPrice);

      if(newPrice < item.low) {
        item.low = newPrice;
      }
      if(newPrice > item.high) {
        item.high = newPrice;
      }
      item.change = (item.last - newPrice).toFixed(2);
      item.last = newPrice;
    });
  }, 1000);

  function _generateModel (symbol) {
    var price = _generateRandomPrice(minPrice, maxPrice);

    return {
      symbol: symbol ? symbol : Math.random().toString(36).substring(7),
      last: price,
      change: price,
      high: price,
      low: price
    }
  }

  function _generateRandomPrice(min, max) {
    return +(Math.random() * (max - min + 1) + min).toFixed(2);
  }
}]);
