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

$("#submit").on("submit", event => {
  event.preventDefault();
  const operator = $("#operator").val();
  const frequency = $("#frequency").val();
  const destination = $("#destination").val();
  const firstTrain = $("#firstTrain").val();

  const enrolledTrain = {
    operator: operator,
    frequency: frequency,
    destination: destination,
    firstTrain: firstTrain
  };

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

  let operator = snapshot.val().operator;
  let frequency = snapshot.val().frequency;
  let destination = snapshot.val().destination;
  let firstTrain = snapshot.val().firstTrain;

  let humanReadableFirstTrainTime = moment(firstTrain, "HH:MM A");
  let timeDifference = moment().diff(humanReadableFirstTrainTime, "minutes");
  let tillNextTrain = timeDifference % frequency;
  let timeBetweenTrains = frequency - tillNextTrain;
  let tillNextReadable = moment()
    .add(tillNextTrain, "minutes")
    .format("HH:MM A");

  const newRow = `
  <tr>
  <td>${operator}</td>
  <td>${destination}</td>
  <td>${timeBetweenTrains}</td>
  <td>${frequency}</td>
  <td>${tillNextReadable}</td>
  <td><i class="fas fa-times"></i></td>
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
