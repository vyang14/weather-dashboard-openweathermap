var timeEl = document.querySelector('#time');
var searchBtn = document.querySelector('#searchBtn');
var searchHistory = document.querySelector('#searchHistory');
var bigCity = document.querySelector('#bigCity');
var cityTemp = document.querySelector('#temperature');
var cityWind = document.querySelector('#wind');
var cityHumid = document.querySelector('#humidity');
var uvIndex = document.querySelector('#uvIndex');
var searchBar = document.querySelector('customSearch');
var cityCoord = {
    lat: '',
    long: ''
};
var aKey = "&appid=629118eb1a8773a241db2bc4f0a52be4";

function theTimeIsNow() { // displays the time in the search results box
    var currentTime = moment().format('ddd, MMM Do YYYY, hh:mm:ss a');
    timeEl.textContent = currentTime;
};

setInterval(theTimeIsNow, 1000); //updates date and time every second

function citySearch (event) { //searches for city and fetches weather data using value in searchBar
    var cityInput = event;
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial" + aKey, {  headers: {
        Accept: "application/json",
    }
    })
    .then(function(response){
    if(response.ok){
        console.log(`${cityInput} received. Returning response`);
        return response.json();
    } else {
        console.log(response);
        bigCity.textContent = `No results found.`;
        return;
    };
    
    })
    .then(function(weatherData){
        console.log(`returning weather data`);
        bigCity.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
        cityTemp.textContent = `${weatherData.main.temp}°F`;
        cityWind.textContent = `${weatherData.wind.speed} mph`;
        cityHumid.textContent = `${weatherData.main.humidity}%`;
        cityCoord = { lat: weatherData.coord.lat, long: weatherData.coord.lon };
    });
    
    var newButton = document.createElement('button');
    newButton.classList.add('btn-dark','customBtn');
    newButton.textContent = cityInput;
    newButton.addEventListener("click", citySearch(cityInput));
    console.log(`newButton created.`);
    searchHistory.appendChild(newButton);
    console.log(`newButton appended.`);
    fiveForecastUV(cityCoord[lat], cityCoord[long]);
}


function fiveForecastUV (lat, long){ //grabs the UVindex and creates the cards for the 5-day forecast
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "units=imperial" + aKey, {  headers: {
        Accept: "application/json",
    }
    })
    .then(function(response){
    if(!response.ok){
        throw new Error(`No results found.`);
    }
    return response.json();
    })
    .then(function(weatherData){
        let uvi = weatherData.current.uvi
        uvIndex.textContent = uvi;
        debugger;
        for (i = 0; i < 5; i++){
            var date = moment.unix(weatherData.daily[i].dt).format('MMM Do YYYY')
            var icon = weatherData.daily[i].weather.icon;
            
        }
    })

}

searchBtn.addEventListener("click", function(){ //initiates app functionality on button click
    var cityInput = this.previousElementSibling.value;
    if (cityInput === "") {
        window.alert("Invalid entry. Please press OK and try again.");
        return;
    } else {
    citySearch(cityInput);
    }
})