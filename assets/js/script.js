var timeEl = document.querySelector('#time');
var searchBtn = document.querySelector('#searchBtn');
var searchHistory = document.querySelector('#searchHistory');
var bigCity = document.querySelector('#bigCity');
var cityTemp = document.querySelector('#temperature');
var cityWind = document.querySelector('#wind');
var cityHumid = document.querySelector('#humidity');
var uvIndex = document.querySelector('#uvIndex');

function theTimeIsNow() { // displays the time in the search results box
    var currentTime = moment().format('ddd, MMM Do YYYY, hh:mm:ss a');
    timeEl.textContent = currentTime;
};

setInterval(theTimeIsNow, 1000);

function citySearch (event) {
    event.preventDefault();
    var cityInput = this.previousElementSibling.value;

    if (cityInput === "") {
        window.alert("Invalid entry. Please press OK and try again.");
        return;
    } else {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=629118eb1a8773a241db2bc4f0a52be4"), {  headers: {
            Accept: "application/json",
    }
    .then(function(response){
        if(!response.ok){
            newButton.textContent = `No results for ${cityInput}.`;
            throw response.json();
        }
        return response.json();
        .then(function(weatherData){
            bigCity = weatherData.;
        })
    })
}}}

searchBtn.addEventListener("click", function(){
    var cityInput = this.previousElementSibling.value;
    var newButton = document.createElement('button');
    newButton.classList.add('btn-dark','customBtn');
    newButton.textContent = cityInput;
    newButton.addEventListener("click", citySearch(cityInput));
    searchHistory.appendChild(newButton);
    citySearch(citySearch);
    //validate city search
    //store city search
    //search for city > weather API
    //create recent search
})