activityApp.controller("activityController", ["$scope", "$routeParams", "$location", "ModalService", "ActivityModel",
  function ($scope, $routeParams, $location, ModalService, ActivityModel) {
      //$scope.complexResult = null;

      var forecasts = ["", ""];
      var theDayActivities;
      $scope.lista = [];
      

      $scope.newpos;
      $scope.newieday;
      

      
      $scope.storeOld = function (event, ui, oldieday, oldpos) {
        console.log("Activity index: " + oldpos);
        $scope.oldpos = oldpos;
        $scope.oldieday = oldieday;
      }

      //need to pass event and ui due to DragNDrop library reasons.
      $scope.storeNewDay = function (event, ui, dayIndex, activityPos) {
        /*
        console.log("event: ", event);
        console.log("ui: ", ui);
        console.log('newieday: ', newieday);
        console.log('index: ', index);
        */

        $scope.moveActivity($scope.oldieday, $scope.oldpos, dayIndex, activityPos);
      }


      // Called by the html to start getting the weather data.
      $scope.getWeather = function () {

          // Callback function called once the https request to the API gets a JSON as result.
          var mycallback = function (returneddata, i) {
              var maxTemp = Math.round(returneddata.data[0].apparentTemperatureMax);
              var minTemp = Math.round(returneddata.data[0].apparentTemperatureMin);
              //var icon = returneddata.data[0].icon;
              forecasts[i] = maxTemp + "\xB0" + "C / " + minTemp + "\xB0" + "C"
          }

          // This loop gets today and tomorrow.
          var date = new Date(Date.now());
          for (var i = 0; i <= 1; i++) {
              date.setDate(date.getDate() + i);
              var time = date.toISOString();
              time = time.substring(0, (time.length - 5))
              ActivityModel.getForecast(mycallback, time, i)
          }

          // Used to set the view - but has to do it twice! Weird...
          $scope.weatherToday = forecasts[0];
          $scope.weatherTomorrow = forecasts[1];
      }

      $scope.showAddActivity = function () {
          ModalService.showModal({
              templateUrl: "partials/addActivity.html",
              controller: "addActivityController",
              inputs: {
                  title: "Enter your activity information"
              }
          }).then(function (modal) {
              modal.element.modal();
              modal.close.then(function (result) {
                  //console.log(result.name);
                  //$scope.complexResult  = "Name: " + result.name + ", age: " + result.age;
              });
          });
      };

      $scope.parkedActivities = ActivityModel.getParkedActivities();

      $scope.days = ActivityModel.getDays();

      

      $scope.moveUp = function (activity,activityIndex) {  
          ActivityModel.moveActivity(0,activityIndex,0,activityIndex-1);    
          //return activity.getDescription();
      };
      $scope.moveDown = function (activity,activityIndex) {  
        
          ActivityModel.moveActivity(0,activityIndex,0,activityIndex+1);  
          //return activity.getDescription();
      };
      


      $scope.getDescription = function (activity) {  
          alert(activity.getDescription());      
          //return activity.getDescription();
      };

      $scope.dayActivities = function (day) {   
        var days = ActivityModel.getDays();
        //console.log("WHAT : " + days[day.getIndex()].getActivities());
        return days[day.getIndex()].getActivities();

      };
    
      $scope.dayActivitiesLength = function (day) {
          var activities = $scope.dayActivities(day);
          return activities.length;          
      };

      

      $scope.setStartTime = function(){
        
        $scope.mytime1 = new Date();
      };
      

      $scope.toggleModal = function () {
          $scope.modalShown = !$scope.modalShown;
      };
      
      $scope.addDay = function () {

          ActivityModel.addDay();
      };

      // Because our current model only supports five days.
      $scope.hideButton = function () {
          if($scope.days.length == 5)
              $('#addDayBtn').css("visibility", "hidden")
          else
              $('#addDayBtn').css("visibility", "visible")
      } 

      // Make things refresh, because we need to iron out a few bugs...
      $scope.refresh = function (time) {
          setTimeout(function () {
              $scope.$apply()
              $scope.weatherToday = forecasts[0];
              $scope.weatherTomorrow = forecasts[1];
          }, time)
      }

      $scope.removeDay = function (day) {
          ActivityModel.removeDay(day);
      };
      $scope.removeActivity = function (day,index) {

          ActivityModel.removeActivity(day.getIndex(),index);
          //console.log("activity index: " + index);
          //console.log("day: " + day.getIndex());
      };

      $scope.removeParkedActivity = function (position) {
          ActivityModel.removeParkedActivity(position);
      };

      /*
      $scope.removeActivity = function (position, activity) {
          ActivityModel.removeActivity(position);
      };
      */

      $scope.moveActivity = function (oldday, oldposition, newday, newposition) {
          ActivityModel.moveActivity(oldday, oldposition, newday, newposition)
};
      $scope.showTime = function (activity,day,activityIndex) {
        //console.log(activity.getName());
        return ActivityModel.getTimes(activity,day,activityIndex);
        
      };

  }]);