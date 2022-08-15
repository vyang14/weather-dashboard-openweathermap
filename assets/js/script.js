var timeEl = document.querySelector('#time');
var searchBtn = document.querySelector('#searchBtn');
var searchHistory = document.querySelector('#searchHistory');
var bigCity = document.querySelector('#bigCity');
var cityTemp = document.querySelector('#temperature');
var cityWind = document.querySelector('#wind');
var cityHumid = document.querySelector('#humidity');
var searchBar = document.querySelector('customSearch');
var cityCoord = {
    lat: '',
    long: ''
};
var aKey = "&appid=629118eb1a8773a241db2bc4f0a52be4";
// var fromStorage = JSON.parse(localStorage.getItem("weatherDashboard")) || [];

function theTimeIsNow() { // displays the time in the search results box
    var currentTime = moment().format('ddd, MMM Do YYYY, hh:mm:ss a');
    timeEl.textContent = currentTime;
};

setInterval(theTimeIsNow, 1000); //updates date and time every second

function localStore (cityInput){
    var newButton = document.createElement('button');
    newButton.classList.add('btn-dark','customBtn');
    newButton.setAttribute('id', cityInput);
    newButton.textContent = cityInput;
    newButton.addEventListener("click", citySearch);
    console.log(`newButton created.`);
    searchHistory.appendChild(newButton);
    console.log(`newButton appended.`);

}

function citySearch (event) { //searches for city and fetches weather data using value in searchBar
    var cityInput = event;
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial" + aKey)
    .then(function(response){
    if(response.ok){
        console.log(`${cityInput} received. Returning response`);
        return response.json();
    } else {
        console.log(response);
        bigCity.textContent = `No results found.`;
        return;
    }
    })
    .then(function(weatherData){
        console.log(`returning weather data`);
        bigCity.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
        cityTemp.textContent = `${weatherData.main.temp}°F`;
        cityWind.textContent = `${weatherData.wind.speed} mph`;
        cityHumid.textContent = `${weatherData.main.humidity}%`;
        cityCoord = { lat: weatherData.coord.lat, long: weatherData.coord.lon };
        var fromStorage = JSON.parse(localStorage.getItem("weatherDashboard")) || [];
        fromStorage.push(cityInput);
        localStorage.setItem('weatherDashboard', JSON.stringify(fromStorage));
        fiveForecastUV(cityCoord.lat, cityCoord.long);
    });
}


function fiveForecastUV (lat, long){ //grabs the UVindex and creates the cards for the 5-day forecast
debugger
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial" + aKey)
    .then(function(response){
        return response.json();  
    })
    .then(function(weatherData){
        let uvi = weatherData.current.uvi;
        var uvIndex = document.querySelector('#uvIndex');
        switch (uvi){
            case uvi >= 0 && uvi <= 2:

        }
        
        uvIndex.textContent = uvi;
        }
        for (i = 0; i < 5; i++){
            var newCard = document.getElementById('day' + (i + 1));
            var date = moment.unix(weatherData.daily[i].dt).format('MMM Do YYYY')
            var icon = weatherData.daily[i].weather[0].icon;
            var description = weatherData.daily[i].weather[0].main;
            var temp = weatherData.daily[i].temp.day;
            var humidity = weatherData.daily[i].humidity;
            var dailyCard = `<h3>${date}</h3><br><img src="https://openweathermap.org/img/w/${icon}.png"><br><p>${description}</p><p>Temp: ${temp}°F</p><p>${humidity}%</p>`
            newCard.innerHTML = dailyCard;
        }
    })
}

searchBtn.addEventListener("click", function(event){ //initiates app functionality on button click
    event.preventDefault();
    var cityInput = this.previousElementSibling.value;
    if (cityInput === "") {
        window.alert("Invalid entry. Please press OK and try again.");
        return;
    } else {
    citySearch(cityInput);
    }
})