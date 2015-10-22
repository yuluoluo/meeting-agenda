// JavaScript Document
function Activity(name, length, typeid, description) {
    //activityApp.factory('Activity',function (name,length,typeid,description){
    var ActivityType = ["Presentation", "Group Work", "Discussion", "Break"];
    var _name = name;
    var _length = length;
    var _typeid = typeid;
    var _description = description;
   

 
    this.getIndex = function (name) {
        _name = name;

    }
    // sets the name of the activity
    this.setName = function (name) {
        _name = name;

    }

    // get the name of the activity
    this.getName = function (name) {
        return _name;
    }

    // sets the length of the activity
    this.setLength = function (length) {
        _length = length;

    }

    // get the name of the activity
    this.getLength = function () {
    	
        return _length;
    }

    // sets the typeid of the activity
    this.setTypeId = function (typeid) {
        _typeid = typeid;

    }

    // get the type id of the activity
    this.getTypeId = function () {
        return _typeid;
    }

    // sets the description of the activity
    this.setDescription = function (description) {
        _description = description;

    }

    // get the description of the activity
    this.getDescription = function () {
        return _description;
    }

    // This method returns the string representation of the
    // activity type.
    this.getType = function () {
        return ActivityType[_typeid];
    };

    // Get object in string to store on firebase.
    this.getAsJSON = function () {
        //console.log("Returned the following JSON: " + { name: _name, length: _length, typeid: _typeid, description: _description })
        if (_name == undefined)
            _name = " ";
        if (_length == undefined)
            _length = 0;
        if (_typeid == undefined)
            _typeid = 0;
        if (_description == undefined) {
            _description = " ";
        }
        return { name: _name, length: _length, typeid: _typeid, description: _description };
    }

}

// This is a day consturctor. You can use it to create days, 
// but there is also a specific function in the Model that adds
// days to the model, so you don't need call this yourself.
function Day(startH, startM, dayId) {
    //activityApp.factory('Day',function (startH,startM){

    this.firebase = new Firebase('https://agenda-planner.firebaseio.com/');
    this._start = startH * 60 + startM;
    this._activities = [];
    this._index = dayId;

    this.getActivities = function () {
        return this._activities;
    }
    // sets the index of the day
    this.setIndex = function (index) {
        this._index = index;
    }

    this.getIndex = function () {
    	return this._index;
    }

    // sets the start time to new value
    this.setStart = function (startH, startM) {
        this._start = startH * 60 + startM;

    }
   
    // returns the total length of the acitivities in 
    // a day in minutes
    this.getTotalLength = function () {
        var totalLength = 0;
        $.each(this._activities, function (index, activity) {
            totalLength += activity.getLength();
        });
        return totalLength;
    };
    // returns the string representation Hours:Minutes of 
    // the end time of the day
    this.getEnd = function () {
        var end = this._start + this.getTotalLength();
        var time = Math.floor(end / 60) + ":" + end % 60;
      	time = time.split(":");
      	time = moment().hour(time[0]).minute(time[1]).format("HH:mm");      	
      	return time;
    };

    // returns the string representation Hours:Minutes of 
    // the start time of the day
    this.getStart = function () {
        var time = Math.floor(this._start / 60) + ":" + this._start % 60;        
      	time = time.split(":");
      	time = moment().hour(time[0]).minute(time[1]).format("HH:mm");      	
      	return time;

    };

    // returns the length (in minutes) of activities of certain type
    this.getLengthByType = function (typeid) {
        var length = 0;
        $.each(this._activities, function (index, activity) {
            if (activity.getTypeId() == typeid) {
                length += activity.getLength();
            }
        });
        return length;
    }
    // adds an activity to specific position
    // if the position is not provided then it will add it to the 
    // end of the list
    // removes an activity from specific position
    // this method will be called when needed from the model
    // don't call it directly
    this._removeActivity = function (position) {
        var activity = this._activities[position];       
        this._activities.splice(position, 1);
        this._updateActivites();     
        return activity;        
    };

    // moves activity inside one day
    // this method will be called when needed from the model
    // don't call it directly
    this._moveActivity = function (oldposition, newposition) {
        // In case new position is greater than the old position and we are not moving
        // to the last position of the array
        var activity = this._removeActivity(oldposition);
        this._addActivity(activity, newposition);
        this._updateActivites();
    };
    this._addActivity = function (activity, position) {
    	//console.log(position + "He")
        if (position != null) {
        	//console.log("ADD: " + activity.getName());
            this._activities.splice(position, 0, activity);
        } else {
            this._activities.push(activity);
        }
        this._updateActivites();
    };

    // Firebase, firebase, does whatever a firebase does.
    this._updateActivites = function () {
        var activitiesJSON = [];
        for (var i = 0; i < this._activities.length; i++) {
            activitiesJSON.push(this._activities[i].getAsJSON())
        }

        if (this._index == 0)
            this.firebase.update({
                day1: activitiesJSON
            });
        if (this._index == 1)
            this.firebase.update({
                day2: activitiesJSON
            });
        if (this._index == 2)
            this.firebase.update({
                day3: activitiesJSON
            });
        if (this._index == 3)
            this.firebase.update({
                day4: activitiesJSON
            });
        if (this._index == 4)
            this.firebase.update({
                day5: activitiesJSON
            });

    }

}

//################################################################################

activityApp.factory('ActivityModel', function () {


    this.firebase = new Firebase('https://agenda-planner.firebaseio.com/');
    this.days = [];
    this.parkedActivities = [];
    this.dayStartTime = 0;
    var latitude = 59.37496119999999;
    var longitude = 17.9644922;    

 	this.getTimes = function (activity,day,activityIndex) { 
 		if(activity !== undefined){
 	
        var dayStartTime = day.getStart();
        var dayHourMinute = dayStartTime.split(":");
        var startTime = moment().hour(dayHourMinute[0]).minute(dayHourMinute[1]).format("HH:mm");
            var i = 0;
            var dayActivityList = day.getActivities();            
         while(i < activityIndex){
            var length = dayActivityList[i].getLength()
            var dayHourMinute = startTime.split(":");
            startTime = moment().hour(dayHourMinute[0]).minute(dayHourMinute[1]).add(Number(length),'minutes').format("HH:mm");
            
            i++; 
         }         
         return startTime;
        }
    };

    this.getParkedActivities = function () {
        return this.parkedActivities;

    };

    this.getDays = function () {        
        return this.days;
    };

    this.removeDay = function (day) {
    	var position = day.getIndex();    	
        this.days.splice(position, 1)[0]; 

        for (i = 0; i < this.days.length; i++) {        	
        	this.days[i].setIndex(i);        	
			}
        // Firebase removes by updating with empty activites
        if (position == 1)
            this.firebase.update({
                day1: []
            })
        if (position == 2)
            this.firebase.update({
                day2: []
            })
        if (position == 3)
            this.firebase.update({
                day3: []
            })
        if (position == 4)
            this.firebase.update({
                day4: []
            })
        if (position == 5)
            this.firebase.update({
                day5: []
            })
    };

    // adds a new day. if startH and startM (start hours and minutes)
    // are not provided it will set the default start of the day to 08:00
    this.addDay = function (startH, startM) {
        var day;
        if (startH) {
            day = new Day(startH, startM, this.days.length);
        } else {
        	
            day = new Day(8, 0, this.days.length);
        }

        day.setIndex(this.days.length) // Used by firebase   

        this.days.push(day);
		
        return day;
    };

    // add an activity to model
    this.addActivity = function (activity, dayIndex, position) { 
    	console.log("DayIndex: " + dayIndex);   	
	        if (dayIndex !== null) {
	        	try{       		        	
	            this.days[dayIndex]._addActivity(activity, null);
	        	}
	        	catch(TypeError){
	        		console.log("Gives typeError when first load, think it could be because of firebase");
	        	}
	        }

	        else {
	            this.parkedActivities.push(activity);	            
	        }
        //console.log("En aktivitet: ", activity, this.parkedActivities);
    };

    this.removeActivity = function (dayIndex,activityIndex){

    	this.days[dayIndex]._removeActivity(activityIndex);    	
    
    }
    this.updateParkedActivitiesOnFirebase = function () {
        // Keep parked activities on Firebase.
        var parkedJSON = [];
        for (var i = 0; i < this.parkedActivities.length; i++)
            parkedJSON.push(this.parkedActivities[i].getAsJSON())
        this.firebase.update({
            dayp: parkedJSON
        })
    }

    // add an activity to parked activities
    this.addParkedActivity = function (activity, position) {
        //console.log("addParkedActivity 253, ", activity);

        this.addActivity(activity, null, position);
        this.updateParkedActivitiesOnFirebase();
    };

    // remove an activity on provided position from parked activites
    this.removeParkedActivity = function (position) {
        var activity = this.parkedActivities[position];
        this.parkedActivities.splice(position, 1);
        this.updateParkedActivitiesOnFirebase();
        return activity;
    };

    // moves activity between the days, or day and parked activities.
    // to park activity you need to set the new day to null
    // to move a parked activity to let's say day 0 you set oldday to null
    // and new day to 0
    this.moveActivity = function (oldday, oldposition, newday, newposition) {

        console.log("oldday:", oldday, ", oldpos:", oldposition, ", newday:", newday, ", newpos:", newposition);

        if (oldday !== null && oldday == newday) {
        	//If moved within the same day.        	      	
            this.days[oldday]._moveActivity(oldposition, newposition);
        } else if (oldday == null && newday == null) {
        	//If moved within the parkedActivities.        	
            var activity = this.removeParkedActivity(oldposition);
            this.addParkedActivity(activity, newposition);
        } else if (oldday == null && newday !== null) {        	
        	//If moved from the parkedActivities to a new day.        	
            var activity = this.removeParkedActivity(oldposition);
            this.days[newday]._addActivity(activity, this.days[newday].getActivities().length);
        } else if (oldday !== null && newday == null) {
        	//If moved from a day back to the parkedActivities.
            var activity = this.days[oldday]._removeActivity(oldposition);
            this.addParkedActivity(activity);
        } else {
        	//If moved from one day to another day.
            var activity = this.days[oldday]._removeActivity(oldposition);
            this.days[newday]._addActivity(activity, this.days[newday].getActivities().length);
        }

    };

    this.testing = function () {
        
        this.firebase.update({
            dayp: [{ name: "Meeting", length: 5, typeid: 1, description: "Very important!" }, { name: "Meeting 2", length: 10, typeid: 2, description: "Not very important..." }]
        })
        this.firebase.update({
            day1: [{ name: "Meeting 3", length: 15, typeid: 3, description: "Very importantez ueno si!" }, { name: "Meeting 4", length: 20, typeid: 1, description: "Not very important... =(" }]
        })
        this.firebase.update({
            dayp: [{ name: "Meeting 54", length: 5, typeid: 1, description: "Very important!" }, { name: "Meeting 222", length: 10, typeid: 2, description: "Not very important..." }]
        })
        this.firebase.update({
            day2: [{ name: "Meeting 4212", length: 15, typeid: 2, description: "Very importantez ueno si des vartes is this language?!" }, { name: "Meeting four or something", length: 220, typeid: 3, description: "Not very important... No senior, que is not importante" }]
        })
    }
    //this.testing();

    this.getFirebase = function (callback) {
        this.firebase.once("value", function (snapshot) {
            return callback(snapshot.val())
        });
    }

    // Load day and activity data from firebase.
    this.loadFirebase = function (ref) {
        var mycallback = function (snap) {
            // This should never be final, this will never make the final release. Never!
            if(snap != undefined){
            if (snap.dayp != undefined) {
                for (var i = 0; i < snap.dayp.length; i++) {
                    ref.addParkedActivity(new Activity(snap.dayp[i].name, snap.dayp[i].length, snap.dayp[i].typeid, snap.dayp[i].description), i + 1)
                }
            }
            if (snap.day1 != undefined) {
                for (var i = 0; i < snap.day1.length; i++) {
                    if (i == 0)
                        ref.addDay();
                    ref.addActivity(new Activity(snap.day1[i].name, snap.day1[i].length, snap.day1[i].typeid, snap.day1[i].description), 0, i)
                }
            }
            if (snap.day2 != undefined) {
                for (var i = 0; i < snap.day2.length; i++) {
                    if (i == 0)
                        ref.addDay();
                    ref.addActivity(new Activity(snap.day2[i].name, snap.day2[i].length, snap.day2[i].typeid, snap.day2[i].description), 1, i)
                }
            }
            if (snap.day3 != undefined) {
                for (var i = 0; i < snap.day3.length; i++) {
                    if (i == 0)
                        ref.addDay();
                    ref.addActivity(new Activity(snap.day3[i].name, snap.day3[i].length, snap.day3[i].typeid, snap.day3[i].description), 2, i)
                }
            }
            if (snap.day4 != undefined) {
                for (var i = 0; i < snap.day4.length; i++) {
                    if (i == 0)
                        ref.addDay();
                    ref.addActivity(new Activity(snap.day4[i].name, snap.day4[i].length, snap.day4[i].typeid, snap.day4[i].description), 3, i)
                }
            }
            if (snap.day5 != undefined) {
                for (var i = 0; i < snap.day5.length; i++) {
                    if (i == 0)
                        ref.addDay();
                    ref.addActivity(new Activity(snap.day5[i].name, snap.day5[i].length, snap.day5[i].typeid, snap.day5[i].description), 4, i)
                }
            }
            }
            // Here we want to update the UI
        }
        this.getFirebase(mycallback)
    }
    this.loadFirebase(this);    // Call it right away!

    // Get a forecast
    this.getForecast = function (callback, time, i) {
        var url = "https://api.forecast.io/forecast/0afbc2b67d065d4cab10e996eb9db58a/" + latitude + "," + longitude + "," + time + "?units=si";
        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function (data) {
                return callback(data.daily, i)
            }
        });
    };

    this.getCoordinates = function () {
        function success(position) {
            latitude = position.coords.latitude;
            longitude = posi < br > tion.coords.longitude;
        }

        function error(msg) {
            // Maybe you want to tell the user somewhere that the weather is not local?
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            error('not supported');
        }
    }

    return this;
});



// The possible activity types


// This is an activity constructor
// When you want to create a new activity you just call
// var act = new Activity("some activity",20,1,"Some description);



// this is our main module that contians days and praked activites



//If we want to have the addActivityView as a popup.


// this is the instance of our main model
// this is what you should use in your application



// you can use this method to create some test data and test your implementation

