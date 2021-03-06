myApp.service('UserService', ['$http', '$location', function($http, $location){
  let self = this;
  let debug = false;
  self.userObject = {};

  self.getuser = function(){
    if(debug){console.log('UserService -- getuser');}
    $http.get('/api/user').then(function(response) {
        if(response.data.username) {
            // user has a curret session on the server
            self.userObject.userName = response.data.username;
            self.userObject.id = response.data.id;
            self.userObject.email = response.data.email;
            if(debug){console.log('UserService -- getuser -- User Data: ', self.userObject.userName);}
        } else {
            if(debug){console.log('UserService -- getuser -- failure');}
            // user has no session, bounce them back to the login page
            $location.path("/home");
        }
    },function(response){
      if(debug){console.log('UserService -- getuser -- failure: ', response);}
      $location.path("/home");
    });
  },

  self.logout = function() {
    if(debug){console.log('UserService -- logout');}
    $http.get('/api/user/logout').then(function(response) {
      if(debug){console.log('UserService -- logout -- logged out');}
      $location.path("/home");
      self.userObject = {};
    });
  }


}]);
