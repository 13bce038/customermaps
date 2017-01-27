var myconfig = require('./config');
firebase.initializeApp(myconfig.firebaseConfigVar);

var database = firebase.database();
const DBNAME = myconfig.DBNAME;

//  add newcustomer to firebase, display success message and clear form
function addCustomerToFirebase(customer) {
    var uniqueid = database.ref().child(DBNAME).push().key;          // get unique push key from firebase db
    console.log("unique key: " + uniqueid);
    database.ref(DBNAME + '/' + uniqueid).set(customer);
    return true;
}