// javascript for Train Time Homework

// Setting up firebase database
var config = {
    apiKey: "AIzaSyAW94Sh8NfwobI4c3xoeHZ1VEeRLR5-Iyg",
    authDomain: "traintimewpw.firebaseapp.com",
    databaseURL: "https://traintimewpw.firebaseio.com",
    projectId: "traintimewpw",
    storageBucket: "",
    messagingSenderId: "513375600232"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // click event to add the information that the users inputs to the text boxes on the data entry form
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();  
    // stores data captured from data entry form into variables
    var trnName = $("#train-name-input").val().trim();
    var trnDest = $("#destination-input").val().trim();
    var trnFirst =$("#first-train-input").val().trim();
    var trnFreq = $("#frequency-input").val().trim();
  
    // creates object for holding traain information
    var newTrain = {
      train: trnName,
      destination: trnDest,
      firstTrain: trnFirst,
      frequency: trnFreq
    };
  
    // uploads train information into the firebase database
    database.ref().push(newTrain);
  
     
    // Alert to provide user with feedback
    alert("Information successfully added");
  
    // Clears contents of text boxes by setting them to empty strings
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  // when a new child is added the following function fires and accomplishes several things described below
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  
    
  
    // update variables with data stored in database as of the time of the snapshot
    var trnName = childSnapshot.val().train;
    var trnDest = childSnapshot.val().destination;
    var trnFirst = childSnapshot.val().firstTrain;
    var trnFreq = childSnapshot.val().frequency;
  
    
      
    // takes time of first train and puts it through moment function to yield a number we can use for calculations 
    var firstTimeConverted = moment(trnFirst, "HH:mm").subtract(1, "days");
    
    // use moment to calculate the difference in minutes between "time now" and the time of the first train
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    
    // use a temporary variable to hold the result of dividing the differnce between "time now" and first train by train frequency
    var temp1 = diffTime / trnFreq;
    
    // use a temporary variable to store the value from rounding variable temp1 up to the next whole number.
    // this represents some number of complete frequency cycles that is the next cycle to complte after "time now" 
    var temp2 = Math.ceil(temp1);
    
    // variable next performs to math to calculate how many minutes from first train until the next train
    var next = temp2 * trnFreq;
    
    // this takes the time from "first train" to "next train after current time" and subtracts "time from first train to now" 
    // the resulting number is the number of minutes from "time now" until the next train 
    var trnUntil = next - diffTime;
    
    // this uses moment to add the "minutes until the next train" to the "current time" and displays it as clock time in military format. 
    var trnNext = moment().add(trnUntil,"minutes").format("HH:mm");    
  
    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trnName + "</td><td>" + trnDest + "</td><td>" + trnFreq + "</td><td>" + trnNext + "</td><td>" + trnUntil + "</td></tr>");
  });
  