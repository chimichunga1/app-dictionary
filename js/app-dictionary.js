var app = angular.module('dictApp', ['ngMaterial','angularUtils.directives.dirPagination', 'ngMessages', 'mgcrea.ngStrap', 'ngRoute','ui.bootstrap']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "index.html"
    })
   .when("/Search", {
        templateUrl : "search.html"
    })
    .when("/home", {
        templateUrl : "MaintenanceSearch.html"
    })
    .when("/Maintenance", {
        templateUrl : "MaintenanceSearch.html"
    })
    .when("/login", {
        templateUrl : "login.html"
    })
});



 app.controller('DemoCtrl', function($http,$scope, $q, $log) {

  $http({
        url: '/falcon/app-dictionary/things',
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


 



      app.controller('listdata',function($scope, $http){

          LoadAllData = function(){
            $http({
                  url: '/falcon/app-dictionary/things',
                  method: "GET",
                  })
              .then(function(response) {
                  $scope.doc = response.data;
          });
        };

        LoadAllData();
        $scope.users = []; //declare an empty array
        $scope.sort = function(keyname){
          $scope.valueten = 6;
          $scope.sortKey = keyname;   //set the sortKey to the param passed
          $scope.reverse = !$scope.reverse; //if true make it false and vice versa
          $scope.itemsPerPage = $scope.valueten;
        }
      });


      //================================================//
      app.controller('addCtrl', function($scope, $http) {
           $http({
              url:'https://restcountries.eu/rest/v2/all',
              method:'GET'
                })
           .then(function(response) {
              $scope.doc_countries = response.data;
          });
      });
      //================================================//

      app.controller('token_controller', function($scope, $http) {
        CheckTokenLogin = function() {
          var myToken = localStorage.getItem('TOKEN');
          if(myToken == '' || myToken == undefined){
                swal({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Non authorized user!',
        
              }).then(function(){
                  window.location.href = '/dict-app/index.html';
            });    
          }
        }
        CheckTokenLogin();
      });

      //================================================//
      app.controller('dictionary_list', function($scope, $http, $filter, $mdToast, $mdDialog) {

        $scope.LogoutForm = function(){

          localStorage.setItem('TOKEN','');
          var myToken = localStorage.getItem('TOKEN');
          window.location.href = '/app-dictionary/';
             
        }
      $scope.LoginForm =  function(){

        $email = $scope.email;
        $password = $scope.password;
        $scope.credentials = {'email':$email,'password':$password};


        $http({
              url: 'http://black-widow.remotestaff.com/falcon/auth/01/admin',
              method: "POST",
              data: $scope.credentials
                  })
          .then(function(response) {

            $scope.token = response.data.jwt;
            if($scope.token == undefined)
            {
          swal({
            type: 'error',
            title: 'Oops...',
            text: 'Please try again!',
          })
            }
            else
            {
              api($scope.token)
            }
       }).catch(function(error){
          swal({
            type: 'error',
            title: 'Oops...',
            text: 'Please try again!',
      
          });
       });

      function api(token){
            $http({
              url: '/falcon/app-dictionary/Login',
              method: "POST",
              headers:{'TOKEN':token},
              data: {'auth':token,'email':$email,'password':$password}
              }).then(function(response){
            localStorage.setItem('TOKEN',token);
            $scope.authData = response.data;
           if($scope.authData != undefined)
           {
                          swal(
                            'Sucess!',
                            'Welcome!'+response.data.admin_email,
                            'success'
                  ).then(function(){
                window.location.href = '/app-dictionary/home.html#!/Maintenance';
            });    
           }
        });
      }
      
    LoadAuthData();
    }
      function LoadauthData(auth){
        if(auth==undefined){
          console.log('no auth found')
        }
        else
        {
        $scope.auth = auth;
      }
    }
      LoadAuthData = function(){
            $http({
                  url: '/falcon/app-dictionary/Login',
                  method: "GET",
                  })
              .then(function(response) {
                  $scope.doc_auth = response.data;
          });
        };
      LoadAllData = function(){
            $http({
                  url: '/falcon/app-dictionary/things',
                  method: "GET",
                  })
              .then(function(response) {
                  var myToken = localStorage.getItem('TOKEN');
                  $scope.doc = response.data;
          });
        };
      GetTokenData = function(){
          var myToken = localStorage.getItem('TOKEN');
          if(myToken == '' || myToken == undefined)
          {

            $scope.doc_user_authenticated = 'empty';
            console.log($scope.doc_user_authenticated,'EMPTY');   
          }

          else
          {
         
         console.log(myToken);
            $http({
                  url: '/falcon/app-dictionary/GetTokenData',
                  method: "POST",
                  headers:{'TOKEN':myToken}
                  })
              .then(function(response) {
               
                $scope.doc_user_authenticated = response.data;
          });
        }
      };

        GetTokenData();





    function authMiddleware(authService, $state) {
        var authMiddleware = this;
        //if user is not logged in re-direct to login route
        authMiddleware.run = function(event){
          LoadAuthData();
            if($scope.auth.admin_fname == 'Roselyn'){
               console.log('EWRROR');
            }
        };
          return {
          run : authMiddleware.run
        };
    };



    SetLimit = function(){
      if($scope.pageSize == null){
        $scope.pageSize =5;
      };    
    };

    ClearInput = function(){
    $scope.chips={}
    $scope.chips.job_title=[];
    $scope.chips.synonymous=[];
    $scope.chips.misspell=[];
    $scope.chips.suggestion=[];

    }

    SetLimit();
    LoadAllData();

    //==PAGINATION FUNCTION==========//
      $scope.page = 1;

      
      $scope.pageChanged = function() {
        var startPos = ($scope.page - 1) * 3;
        //$scope.displayItems = $scope.totalItems.slice(startPos, startPos + 3);
        console.log($scope.page);
      };
    //==PAGINATION FUNCTION==========//
      $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
      }
    //CHANGE FUNCTION FOR LIMIT BY OPTION//
    $scope.change = function(){
        $NumPerPage = $scope.pageSize;
        console.log($scope.pageSize);
    };
    //CHANGE FUNCTION FOR LIMIT BY OPTION//

      $scope.chips={}
      $scope.chips.job_title=[];
      $scope.chips.synonymous=[];
      $scope.chips.misspell=[];
      $scope.chips.suggestion=[];
      $scope.AddNewDictForm = function(){
      var myToken = localStorage.getItem('TOKEN');
        if(myToken == '' || myToken == undefined)
        {
           swal({
            type: 'error',
            title: 'Oops...',
            text: 'Fields must not be empty!',
      
          })
           LoadAllData();
           ClearInput();
        }
        else
        {

          if($scope.chips.job_title == '' || $scope.chips.synonymous == '' || $scope.chips.misspell == '' || $scope.chips.suggestion == ''){
          ////SWEETALERT FUNCTION/////
                        swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Fields must not be empty!',
                })
          ////SWEETALERT FUNCTION/////

            }

            else

            {

            $scope.doc = [];
            $scope.doc.push($scope.chips.job_title,$scope.chips.synonymous,$scope.chips.misspell,$scope.chips.suggestion);
                      $http({
                    url: '/falcon/app-dictionary/AddNewDict',
                    method: "POST",
                    data: $scope.doc
                        })
                .then(function(response) {
                 LoadAllData();
                 ClearInput();
             });
            ////SWEETALERT FUNCTION/////
                    swal(
                  'Sucess!',
                  'You saved a new Data!',
                  'success'
                );
                    LoadAllData();
                 ClearInput();
            ////SWEETALERT FUNCTION/////
              }
        }
};
    //FOR TOAST




    $scope.viewDict = function(data){
          $scope.ViewDataModal = data;
          $scope.ViewDataModal.display = $scope.ViewDataModal.display;
          $scope.ViewDataModal_id = $scope.ViewDataModal._id;
          $scope.ViewDataModal_synonymous = $scope.ViewDataModal.synonymous;
          $scope.ViewDataModal_misspell = $scope.ViewDataModal.misspell;
          $scope.ViewDataModal_suggestion = $scope.ViewDataModal.suggestion;
    };
    //================WILFRED WILFRED WILFRED WILFRED ======================//
         $scope.newEditDict = function(data) {
          $scope.send={}
          $scope.send.display=data.display;
          $scope.send._id=data._id;
          $scope.send.synonymous=[];
          $scope.send.misspell=[];
          $scope.send.suggestion=[];
            for(var i=0;i<data.synonymous.length;i++) {
            $scope.send.synonymous.push(data.synonymous[i]);
              }
          for(var i=0;i<data.misspell.length;i++) {
          $scope.send.misspell.push(data.misspell[i]);
          }
          for(var i=0;i<data.suggestion.length;i++) {
          $scope.send.suggestion.push(data.suggestion[i]);
          }
      }

      $scope.newEditDictForm = function() {
        var myToken = localStorage.getItem('TOKEN');
        if(myToken == '' || myToken == undefined)
        {
 
            swal({
              type: 'error',
              title: 'Oops...',
              text: 'Non authorized user!',
      
              }).then(function(){
            LoadAllData();
          });    
            ////SWEETALERT FUNCTION/////
        }

        else
        {
                  $http({
                      url: '/falcon/app-dictionary/UpdateAll',
                      method: "POST",
                      data: $scope.send
                        })
                  .then(function(response) {
                            LoadAllData();
                  });
            ////SWEETALERT FUNCTION/////
                swal(
              'Sucess!',
              'You updated a Data!',
              'success'
            )
        }
      }
    //================WILFRED WILFRED WILFRED WILFRED ======================//
    //================================================//
      $scope.deleteDictForm = function() {
        var myToken = localStorage.getItem('TOKEN');
        if(myToken == '' || myToken == undefined)
        {
                      swal({
              type: 'error',
              title: 'Oops...',
              text: 'Non authorized user!',
            }).then(function(){
                  LoadAllData();
                  });    
        }
        else
        {
              $http({
              url: '/falcon/app-dictionary/getDelete',
              method: "POST",
              data: $scope.getData
                })
          .then(function(response) {
            LoadAllData();
        });
    ////SWEETALERT FUNCTION/////
        swal(
      'Success!',
      'You deleted the data!',
      'success'
    )
    ////SWEETALERT FUNCTION/////      
        }

    }
    //================================================//
         $scope.deleteDict = function(data){
          $scope.getData = data;
    }
    //================================================//
         $scope.editDict = function(data){
          $scope.getId = data.id;
          $scope.keywords = data.value.misspell;      
          $scope.syno = data.value.synonymous;
          $scope.job_title = data.value._id;
    }
    //================================================//
         $scope.addDict = function(data){
          $scope.getId = data.id;
          $scope.keywords = data.value.misspell;      
          $scope.syno = data.value.synonymous;
          $scope.job_title = data.value._id;
    }
    //================================================//
          $scope.deleteSyno = function(data) { 
            var index = $scope.syno.indexOf(data);
            $scope.removeSyno = {'syno':data,'id':$scope.getId};
            $scope.syno.splice(index, 1);
            $http({
                  url: '/falcon/app-dictionary/delSyno',
                  method: "POST",
                  data: $scope.removeSyno
                  })
            .then(function(response) {
              
                  });
    }
    //================================================//
          $scope.deleteKeywords = function(data) { 
            console.log(data);
            var index = $scope.keywords.indexOf(data);
            $scope.removekeyword = {'keywords':data,'id':$scope.getId};
            $scope.keywords.splice(index, 1);  

            $http({
                  url: '/falcon/app-dictionary/delKeywords',
                  method: "POST",
                  data: $scope.removekeyword
                  })
              .then(function(response) {

                  });
    }
    //================================================//
          $scope.UpdateSyno = function(data,placeholder) { 
            $scope.CurrentSyno = placeholder // orig value
            $scope.NewSyno = data //new value
            console.log(placeholder)
            $scope.updateSyno = {'CurrentSyno':placeholder,'NewSyno':data,'id':$scope.getId};
            console.log($scope.updateSyno);
            $http({
                  url: '/falcon/app-dictionary/UpdateSyno',
                  method: "POST",
                  data: $scope.updateSyno
                  })
              .then(function(response) {
              
                  });
    }
    //================================================//
          $scope.updateKeywords = function(data,placeholder) { 
            $scope.CurrentKeyword = placeholder // orig value
            $scope.NewKeyword = data //new value
            console.log(placeholder)
            $scope.updateKeyword = {'CurrentKeyword':placeholder,'NewKeyword':data,'id':$scope.getId};
            console.log($scope.updateKeyword);
            $http({
                  url: '/falcon/app-dictionary/UpdateKeywords',
                  method: "POST",
                  data: $scope.updateKeyword
                  })
            .then(function(response) {
                  console.log("UpdateKeyword");
                  });
              
    }
    //================================================//

          $scope.UpdateJobTitle = function(data) { 
            $scope.UpdateJobTitle = {'job_title':data,'id':$scope.getId};
            $http({
                  url: '/falcon/app-dictionary/UpdateJobTitle',
                  method: "POST",
                  data: $scope.UpdateJobTitle
              })
              .then(function(response) {
                  console.log("UpdateJobTitle");
              });
    }
    //================================================//
      $scope.SynonymModal = [{}];
          $scope.AddSynonymModal = function() {
            var SynonymItem = $scope.SynonymModal.length+1;
            $scope.SynonymModal.push({SynonymItem});
     
      };
    //================================================//
          $scope.RemoveSynonymModal = function() {
            var SynonymItemLast = $scope.SynonymModal.length-1;
            $scope.SynonymModal.splice(SynonymItemLast);
      };
    //================================================//
      $scope.KeywordModal = [{}];
          $scope.AddKeywordModal = function() {
            var KeywordItem = $scope.KeywordModal.length+1;
            $scope.KeywordModal.push({KeywordItem});

      };
    //================================================//
          $scope.RemoveKeywordModal = function() {
            var KeywordItemLast = $scope.KeywordModal.length-1;
            $scope.KeywordModal.splice(KeywordItemLast);
      };
    //================================================//
     $scope.addDictForm = function() {
      $scope.doc=[];
      $scope.doc.push($scope.SynonymModal,$scope.KeywordModal,$scope.getId);
      $http({
            url: '/falcon/app-dictionary/addSynoKey',
            method: "POST",
            data: $scope.doc
        })
        .then(function(response) {
        console.log('yes');
        });
      }
    });
    //================================================//




