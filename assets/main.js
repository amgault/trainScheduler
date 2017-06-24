// Initialize Firebase


firebase.initializeApp(config);

var database = firebase.database();

// Initialize employee attributes

var trainDB = {
	name: null,
	dest: null,
	time: null,
	// arrival: 0,
	freq: null,
	// billed: 0,

	createTrain: function(snapshot) {
		console.log('creating train');

		this.name = snapshot.name;
		this.dest = snapshot.dest;
		this.time = snapshot.time;
		this.freq = snapshot.freq;
		this.minAway = this.calculateMinAway(this.freq, this.arrival);
		this.arrival = this.calculateArrival(this.minAway);

		this.displayTrains();

	},

	displayTrains: function () {

		var newRow = $('<tr>');
		newRow.append('<td>' + this.name + '</td>');
		newRow.append('<td>' + this.dest + '</td>');
		newRow.append('<td>' + this.freq + '</td>');
		newRow.append('<td>' + this.arrival + '</td>');
		newRow.append('<td>' + this.minAway + '</td>');
		
		

		$('#tbody').append(newRow);

	},

	calculateMinAway: function(startTime) {
		var firstTimeConverted = moment(startTime, "hh:mm").subtract(1, "years");
    	console.log("START TIME: " + moment(firstTimeConverted).format("hh:mm A"))

    	var currentTime = moment();
    	console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm A"));

    	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    	console.log("DIFFERENCE IN TIME: " + diffTime);

    	// Time apart (remainder)
    	var tRemainder = diffTime % this.freq;
    	console.log(tRemainder);

    	// Minute Until Train
    	var tMinutesTillTrain = this.freq - tRemainder;
    	return tMinutesTillTrain;
    	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	},

	calculateArrival: function(min) {
    	// Next Train
    	var nextTrain = moment().add(min, "minutes");
    	console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));
    	var arrival = moment(nextTrain).format("hh:mm A");
    	return arrival;

	},

	validTime: function(time) {

		if(time.length !== 5) {
			return false;
		}
		else if(time[2] !== ':') {
			return false;
		}
		else if(time[0] > 2) {
			return false;
		}
		else if(time[3] > 5) {
			return false;
		}
		else{
			return true;
		}
	}

};

// On click 'submit' new employee
$("#add-train").on('click', function(e) {

	event.preventDefault();

	var name = $("#name-input").val().trim();
	var dest = $("#dest-input").val().trim();
	var time = $("#time-input").val().trim();
	var freq = parseInt($("#freq-input").val().trim());

	$("#name-input").val('');
	$("#dest-input").val('');
	$("#time-input").val('');
	$("#freq-input").val('');

	if(name && dest && time && freq) {
		if(trainDB.validTime(time)) {

			database.ref().push({
				name: name,
				dest: dest,
				time: time,
				freq: freq,
			});
		} else {
			alert('You did not enter a valid start time.');
		}
	} else {
		alert('You did not enter all the necessary information.');
	}


});

database.ref().on('child_added', function(snapshot) {

	if(snapshot.val()) {
		trainDB.createTrain(snapshot.val());
	}
});

















