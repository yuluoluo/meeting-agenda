activityApp.controller('addActivityController', ['$scope', '$element', 'title', 'close', "ActivityModel",
  function($scope, $element, title, close,ActivityModel) {
  
  $scope.title = title;

  //  This close function doesn't need to use jQuery or bootstrap, because
  //  the button has the 'data-dismiss' attribute.
  $scope.close = function() {      
      var activity = $scope.result;
      if (activity) {
        var i = ActivityModel.getParkedActivities().length;
        //console.log(i);
        ActivityModel.addParkedActivity(new Activity(activity.name, activity.length, activity.type, activity.description), i);
        //console.log(activity);
      } else {
        console.log("No data from the activity form.");
      }
  };

  $scope.cancel = function() {
  //  Manually hide the modal.
    $element.modal('hide');
    //  Now call close, returning control to the caller.
    close({
      name: $scope.name,
      age: $scope.age
      }, 500); // close, but give 500ms for bootstrap to animate
  };




      /*
 	  close({
      name: $scope.name,
      length: $scope.length,
      type: $scope.type,
      description: $scope.description
    }, 500); // close, but give 500ms for bootstrap to animate
    //console.log($scope.name);
  };
      */
  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.


}]);