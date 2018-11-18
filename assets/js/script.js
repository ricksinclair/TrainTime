//trying to get my hands dirty with ES6 features like template literals.
//the RPS game was a little too ambitious too soon, but I will finish it eventually.

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAIiV9d5PQCb8_SmtzPOH4md_H6XF6VSBQ",
  authDomain: "train-time-dfb3e.firebaseapp.com",
  databaseURL: "https://train-time-dfb3e.firebaseio.com",
  projectId: "train-time-dfb3e",
  storageBucket: "train-time-dfb3e.appspot.com",
  messagingSenderId: "289678469421"
};
firebase.initializeApp(config);

const database = firebase.database();

//this constant holds the main table
const mainTable = `<table class="table table-dark table hover" id="time-board">
<thead>
<tr>
<th scope="col">Operator</th>
<th scope="col">Destination</th>
<th scope="col">Time From Station</th>
<th scope="col">Frequency</th>
<th scope="col"> Train After Next</th>
</tr>
</thead>
<tbody id="train-data">

</tbody>
</table>`;

//place table in DOM
$("#tableDiv").append(mainTable);

//this constant one holds the mainForm
const mainForm = `<form>
<div class="form-group">
  <label for="operator">Train Operator</label>
  <input
    class="form-control"
    id="operator"
    placeholder=""
    type="text"
  />
</div>
<div class="form-group">
  <label for="destination">Destination</label>
  <input
    class="form-control"
    id="destination"
    placeholder=""
    type="text"
  />
</div>
<div class="form-group">
  <label for="firstTrain"
    >Time of first train HH:MM (AM or PM)
  <input
    class="form-control"
    id="firstTrain"
    placeholder=""
    type="text"
  />
</div>
<div class="form-group">
  <label for="frequency-input">Frequency</label>
  <input
    class="form-control"
    id="frequency"
    placeholder=""
    type="text"
  />
</div>
<button
  class="btn btn-primary float-right"
  id="submit"
  type="submit"
>
  Submit
</button>
</form>`;

//place form in DOM
$("#formDiv").append(mainForm);

//this will control our submit event
//i took the suggestion from last graded assignment and used
//on "submit" instead of on "click"

$("#submit").on("click", event => {
  event.preventDefault();
  let operator = $("#operator").val();
  let frequency = $("#frequency").val();
  let destination = $("#destination").val();
  let firstTrain = $("#firstTrain").val();

  console.log(operator);
  console.log(frequency);
  console.log(destination);
  console.log(firstTrain);

  const enrolledTrain = {
    operator: operator,
    frequency: frequency,
    destination: destination,
    firstTrain: firstTrain
  };

  console.log(enrolledTrain);

  database.ref().push(enrolledTrain);

  //clear inputs after submission
  operator = "";
  frequency = "";
  destination = "";
  firstTrain = "";
});

//The following function will append rows to the table as used inputs values

database.ref().on("child_added", snapshot => {
  //points data to database

  const operator = snapshot.val().operator;
  const frequency = snapshot.val().frequency;
  const destination = snapshot.val().destination;
  const firstTrain = snapshot.val().firstTrain;

  var humanReadableFirstTrainTime = moment(firstTrain, "HH:MM A");
  var timeDifference = moment().diff(humanReadableFirstTrainTime, "minutes");
  var tillNextTrain = timeDifference % frequency;
  var timeBetweenTrains = frequency - tillNextTrain;
  var tillNextReadable = moment()
    .add(tillNextTrain, "minutes")
    .format("H:HH A");

  const newRow = `
  <tr>
  <td>${operator}</td>
  <td>${destination}</td>
  <td>${timeBetweenTrains}</td>
  <td>${frequency}</td>
  <td>${tillNextReadable}</td>
  <td><span><i class="fas fa-times"></i></span></td>
  </tr>
  `;

  $("#train-data").append(newRow);
});

$(".fa-times").on("click", event => {
  $(this)
    .parent()
    .fadeOut(1000, () => {
      $(this).remove();
    });
  //stops same method from being called unintentionally
  event.stopPropogation();
});
