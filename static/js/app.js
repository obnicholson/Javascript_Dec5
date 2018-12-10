// from data.js
var tableData = data;


// select table to append rows to
var htmlTable = d3.select('#ufo-table').select('tbody');


// add data function
function addData(sighting) {
    var newRow = htmlTable.append('tr');
    Object.values(sighting).forEach(value => newRow.append('td').text(value));
}


// add all data to table
data.forEach(addData);


// get unique data for filter dropdowns
function getUnique(array) {
    var uniqueArray = [];
    array.forEach(function(i) {
        var test = (uniqueArray.indexOf(i));
        if (test === -1){
            uniqueArray.push(i);
        }
    })
    return uniqueArray;
}

var cities = data.map(sighting => sighting.city)
var states = data.map(sighting => sighting.state);
var countries = data.map(sighting => sighting.country);
var shapes = data.map(sighting => sighting.shape);

var uniqueItems = {
    "City": getUnique(cities),
    "State": getUnique(states),
    "Country": getUnique(countries),
    "Shape": getUnique(shapes)
};


// add dropdowns
var filterList = d3.select('#filters');
Object.entries(uniqueItems).forEach(function([key, value]) {
    var newFilter = filterList.append('li');
    newFilter.attr('class','filter list-group-item');
    
    var newLabel = newFilter.append('label');
    newLabel.attr('for',key);
    newLabel.text(`Select a ${key}`);

    var newDropdown = newFilter.append('select');
    newDropdown.attr('name',key);
    newDropdown.attr('id',key);

    var defaultSelection = newDropdown.append('option');
    defaultSelection.attr('value','all');
    defaultSelection.text('all')

    value.forEach(function(selection) {
        var newSelection = newDropdown.append('option');
        newSelection.attr('value',selection);
        newSelection.text(selection);
    })
})


// filter dataset based on user input
var submitDateFilter = d3.select('#filter-btn')

submitDateFilter.on("click", function(){
    d3.event.preventDefault();

    // dates
    var inputDate = d3.select('#datetime').property('value');
    if (inputDate === '') {
        var dateData = data;
    }
    else{
        var dateData = data.filter(sighting => sighting.datetime === inputDate);
    }
    
    // cities
    var inputCity = d3.select('#City').select('option:checked').property('value');
    if (inputCity === 'all') {
        var cityData = dateData;
    }
    else{
        var cityData = dateData.filter(sighting => sighting.city === inputCity);
    }

    // states
    var inputState = d3.select('#State').select('option:checked').property('value');
    if (inputState === 'all') {
        var stateData = cityData;
    }
    else{
        var stateData = cityData.filter(sighting => sighting.state === inputState);
    }

    // countries
    var inputCountry = d3.select('#Country').select('option:checked').property('value');
    if (inputCountry === 'all') {
        var countryData = stateData;
    }
    else{
        var countryData = stateData.filter(sighting => sighting.country === inputCountry);
    }

    // final filtered data with shapes
    var inputShape = d3.select('#Shape').select('option:checked').property('value');
    if (inputShape === 'all') {
        var filteredData = countryData;
    }
    else{
        var filteredData = countryData.filter(sighting => sighting.shape === inputShape);
    }

    // get rid of existing data
    htmlTable.selectAll('tr').remove();
    d3.select('#table-area').select('h5').remove();

    //input filtered data or error message
    if (filteredData.length > 0){
        d3.selectAll('.table-head').style('visibility','visible');
        filteredData.forEach(addData);
    }
    else {
        d3.selectAll('.table-head').style('visibility','hidden');
        d3.select('#table-area').select('h5').remove();
        d3.select('#table-area').append('h5').text('Sorry, the dataset returned no sightings with currently selected filters.  Please try expanding filter criteria.')
    }
})




