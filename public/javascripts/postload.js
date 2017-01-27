/**
 * Created by jainu on 28/1/17.
 */

var phoneFieldsCounter = 1;
const addCustomerDataTab = "addCustomerDataTab";
const viewFindTab = "viewFindCustomerDataTab";
var currentTab = viewFindTab;


// when DOM is loaded, fetch data from firebase and set autocomplete
// everytime new child is added to firebase, set autocomplete accordingly
$(document).ready(function () {
    var myjson = [];            // data to be displayed in dropdown will be manipulated over here
    var receivedJson = [];      // data fetched from firebase will be stored in this array
    var i = 0;                  // counter for num of customers
    database.ref(DBNAME).on('child_added', function (customer) {
        var uniqueid = customer.key;
        receivedJson[i] = customer.val();
        //            console
        myjson[i] = {};
        myjson[i]["label"] = receivedJson[i]["name"] + ", " + receivedJson[i]["phonenums"] + ", " + receivedJson[i]["address"];   // label is used to populate dropdown list
        myjson[i]["value"] = receivedJson[i]["address"];  // value attribute is set to display address after selecting an item on autocomplete-dropdown
        myjson[i]["location"] = {};
        myjson[i]["location"]["lat"] = receivedJson[i]["location"]["lat"];
        myjson[i]["location"]["lng"] = receivedJson[i]["location"]["lng"];
        console.log(receivedJson[i]["name"] + ", " + receivedJson[i]["phonenums"] + ", " + receivedJson[i]["address"]);
        updateAutoSearch(myjson);
        addNewMarker(uniqueid, receivedJson[i]["location"], receivedJson[i]["name"], receivedJson[i]["address"], receivedJson[i]["phonenums"]);
        i++;
    });
});


function addPhoneField() {
    phoneFieldsCounter++;
    if (phoneFieldsCounter > 3) {
        phoneFieldsCounter = 3;
        window.alert("Don't enter more than 3 numbers !");
        return;
    }
    var d = document.getElementById('phone-field-div');
    var newinput = document.createElement('span');
    newinput.innerHTML = '<input type="text" class="form-control" id="inputNumber' + phoneFieldsCounter + '" placeholder="9429000158" pattern="^[0-9]{10}$"> ';
    d.appendChild(newinput);
}

function addCustomerDataTabClicked() {
    if (currentTab == addCustomerDataTab) return;
    currentTab = addCustomerDataTab;
    console.log("tab changed to " + currentTab);
    hideAllMarkers();
    addMapOnClickListener();
    setCurrentLocationOnMap();
    setFocusOn("inputName");
}

function viewFindClicked() {
    if (currentTab == viewFindTab) return;
    currentTab = viewFindTab;
    console.log("tab changed to " + currentTab);
    clearLastMarker();
    removeMapOnClickListener();
    showAllCustomers();
    setFocusOn("search-text");
}


function updateAutoSearch(myjson) {
    $("#search-text").autocomplete({
        source: myjson
    });
    $("#start-location-text").autocomplete({
        source: myjson
    });
    $("#end-location-text").autocomplete({
        source: myjson
    });
}
var oneCustomerLocation = {};
// as the item is selected, perform the search and map selected coordinates over here.
$("#search-text").on('autocompleteselect', function (e, ui) {
    oneCustomerLocation = ui.item.location;
    //        console.log(ui.item.location.lat + " ..  " + ui.item.location.lng);
});
var startCustomerLocation = {};
$("#start-location-text").on('autocompleteselect', function (e, ui) {
    startCustomerLocation = ui.item.location;
});
var endCustomerLocation = {};
$("#end-location-text").on('autocompleteselect', function (e, ui) {
    endCustomerLocation = ui.item.location;
});
function setFocusOn(fieldId) {
    document.getElementById(fieldId).focus();
}
$("#add-customer-data-form").submit(function (event) {
    event.preventDefault(); // prevent default action of submit button
    var newCustomer = {};
    newCustomer["name"] = document.getElementById('inputName').value;
    newCustomer["address"] = document.getElementById('inputAddress').value;
    newCustomer["phonenums"] = [];
    var phonedivitems = document.getElementById('phone-field-div').getElementsByTagName("span").length;
    for (var i = 1; i < phonedivitems; i++) {                   // phonedivitems will contain one more span of '+',hence we will iterate till one less item
        var phonenum = document.getElementById('inputNumber' + i).value;
        if (phonenum != "")
            newCustomer["phonenums"].push(phonenum);
    }
    newCustomer["location"] = {};
    newCustomer["location"]["lat"] = lastmarker.position.lat();
    newCustomer["location"]["lng"] = lastmarker.position.lng();
    if (addCustomerToFirebase(newCustomer)) {
        //            if data is added succesfully, then show a success popup
        $('#success-failure-msg').html("Customer Data Saved Successfully !").fadeIn('slow')
            .css('color', 'green')
            .delay(2000).fadeOut('slow');
        //            clear form and focus on name field
        $('#add-customer-data-form').each(function () {
            this.reset();
        });
        $('#inputName').focus();
        setFocusOn("inputName");
    }
    else {
        //            show failure popup
        $('#success-failure-msg').html("Oops!! Data Save Unsuccessful!").fadeIn('slow')
            .css('color', 'red')
            .delay(3000).fadeOut('slow');
    }
});