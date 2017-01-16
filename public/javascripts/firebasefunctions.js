var config = {
    apiKey: "AIzaSyAMgF0e0C1rcmacxbzBt9qLvwdHQYl6LEE",
    authDomain: "map-api-test-project-154414.firebaseapp.com",
    databaseURL: "https://map-api-test-project-154414.firebaseio.com",
    storageBucket: "map-api-test-project-154414.appspot.com",
    messagingSenderId: "504959511552"
};
firebase.initializeApp(config);

var database = firebase.database();
// const DBNAME = 'testdata';
const DBNAME = 'realdata';

//  add newcustomer to firebase, display success message and clear form
function addCustomerToFirebase(customer) {
    var uniqueid = database.ref().child(DBNAME).push().key;          // get unique push key from firebase db
    console.log("unique key: " + uniqueid);
    database.ref(DBNAME + '/' + uniqueid).set(customer);
    return true;
}