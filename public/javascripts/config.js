/**
 * Created by jainu on 28/1/17.
 */

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