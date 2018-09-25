var app = angular.module('dictApp', ['ngMaterial','angularUtils.directives.dirPagination', 'ngMessages', 'mgcrea.ngStrap', 'ngRoute','ui.bootstrap']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "index.html"
        
    })
   .when("/search", {
        templateUrl : "search.html"
        
    })
    .when("/home", {
        templateUrl : "home.html"
        
    })
    .when("/logout", {
        templateUrl : "logout.html"
        
    })
    .when("/addSearch", {
        templateUrl : "addSearch.html"
        
    })
    .when("/resume", {
        templateUrl : "resume.html"
        
    })
    .when("/paginate", {
        templateUrl : "test.html"
        
    })
    .when("/login", {
        templateUrl : "login.html"
        
    })
    .when("/signup", {
        templateUrl : "signup.html"
        
    })

 

});



 app.controller('DemoCtrl', function($http,$scope, $q, $log) {

  $http({
        url: '/falcon/things',
        method: "GET",
    })
    .then(function(response) {
        $scope.doc = response.data;
    });

  $http({
        url: '/dictionary/JobSpecResource',
        method: "GET",
    })
    .then(function(response) {

        $scope.jobSpec = response.data;
   
    });
  var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;
    self.QuerySearch   = QuerySearch;
    self.SelectedItemChange = SelectedItemChange;
    self.SearchTextChange   = SearchTextChange;

    function QuerySearch (query) {

/*              results=[];
              counter_title=0;
              angular.forEach($scope.doc, function() {
                this.push($scope.doc[counter_title].id);
                counter_synonyms=0;
                counter_title++;
              },results);*/
      var results = query ? $scope.doc.filter( createFilterFor(query) ) : $scope.doc;

      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
        } else {
      return results;
      }
    }

    function SearchTextChange(text) {
   /*   $log.info('Text changed to ' + text);*/



    }

    function SelectedItemChange(item) {
/*      $log.info('Item changed to ' + JSON.stringify(item));*/
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
      return (item.id.indexOf(lowercaseQuery) === 0);
      };
    }
 });
