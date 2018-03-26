myApp.controller('Opening_ListController',  ['UserService', 'ViewPropertyService', 'ListService', 'Upload', '$timeout', '$location', '$http', '$route',
  function(UserService, ViewPropertyService, ListService, Upload, $timeout, $location, $http, $route) {
  console.log('Opening_ListController created');
  var self = this;

  self.userService = UserService;
  self.userObject = UserService.userObject;
  self.displayProperty = ViewPropertyService.displayProperty;
  self.displayCabin = ViewPropertyService.displayCabin;
  let cabinId = self.displayCabin.cabin[0].id;
  self.cabinOpenState = self.displayCabin.cabin[0].op_cl;
  self.op_clToggle = ListService.op_clToggle;
  self.ListService = ListService;
  self.readyToToggle = ListService.readyToToggle;
  self.list = ListService.list;
  self.getList = ListService.getList
  self.clickList = ListService.clickList;
  self.showUpload = {show: false};
  self.clearList = ListService.clearList;
  self.getList(cabinId);


//this toggles the open/closed state on the db for the selected cabin
  self.op_clToggle = function(id, op_cl) {
    console.log('in op_clToggle', id, op_cl);
    $http({
      method: 'PUT',
      url: `property/toggle/${id}`,
      data: {data: op_cl}
    }).then(function(response){
      console.log('success in op_clToggle', response);
      ViewPropertyService.displayProperty(cabinId).then($location.url('/opening_list'));

      // $route.reload();
      }).catch(function(error){
      console.log('error in op_clToggle', error);
    })
  }
  //end op_clToggle

//this uploads the .csv file to the db
  self.uploadFiles = function(file, errFiles) {
    self.f = file;
    self.errFile = errFiles && errFiles[0];
    if (file) {
      file.upload = Upload.upload({
          url: `/upload/${cabinId}`,
          data: {file: file}
      });
    file.upload.then(function (response) {
        $timeout(function () {
            file.result = response.data;
        });
    }, function (response) {
        if (response.status > 0)
            self.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
        file.progress = Math.min(100, parseInt(100.0 *
                                 evt.loaded / evt.total));
    });
    }
    alert('File Uploaded!');
    self.showUpload.show = false;
    $location.path("/property");
  }
//end uploadFiles

self.uploadToggle = function(){
  self.showUpload.show = true;
}

self.cancelUpload = function(){
  self.showUpload.show = false;
}






}]);// end Opening_ListController
