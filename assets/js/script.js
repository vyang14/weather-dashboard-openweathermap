var timeEl = document.querySelector('#time');
var searchBtn = document.querySelector('#searchBtn');
var searchHistory = document.querySelector('#searchHistory');
var bigCity = document.querySelector('#bigCity');
var cityTemp = document.querySelector('#temperature');
var cityWind = document.querySelector('#wind');
var cityHumid = document.querySelector('#humidity');
var cityIcon = document.querySelector('#icon');
var searchBar = document.querySelector('customSearch');
var aKey = "&appid=629118eb1a8773a241db2bc4f0a52be4";

function theTimeIsNow() { //displays the time in the search results box
    var currentTime = moment().format('ddd, MMM Do YYYY, hh:mm:ss a');
    timeEl.textContent = currentTime;
};

function recentButton (cityInput){ //creates a new button containing the text from the search bar
    var newButton = document.createElement('button');
    newButton.classList.add('btn-dark','customBtn');
    newButton.setAttribute('id', cityInput);
    newButton.textContent = cityInput;
    newButton.addEventListener("click", function(){
        var cityInput = this.textContent;
        citySearch(cityInput);
    });
    searchHistory.appendChild(newButton);
}

function localStore (){ //pulls the values in local storage and calls recentButton for each value
    var fromStorage = JSON.parse(localStorage.getItem("weatherDashboard")) || [];
    for (var i = 0; i < fromStorage.length; i++){
        recentButton(fromStorage[i]);
    }
}

function citySearch (cityInput) { //searches for city and fetches weather data using value in searchBar
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial" + aKey)
    .then(function(response){
    if(response.ok){
        return response.json();
    } else {
        console.log(response);
        bigCity.textContent = `No results found.`;
        return;
    }
    })
    .then(function(weatherData){
        console.log(`returning weather data`);
        var icon = weatherData.weather[0].icon;
        bigCity.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
        cityIcon.innerHTML = `<img src="https://openweathermap.org/img/w/${icon}.png">`
        cityTemp.textContent = `${weatherData.main.temp}°F`;
        cityWind.textContent = `${weatherData.wind.speed} mph`;
        cityHumid.textContent = `${weatherData.main.humidity}%`;
        var cityCoord = { lat: weatherData.coord.lat, long: weatherData.coord.lon };
        var fromStorage = JSON.parse(localStorage.getItem("weatherDashboard")) || [];
        fromStorage.push(cityInput);
        localStorage.setItem('weatherDashboard', JSON.stringify(fromStorage));
        fiveForecastUV(cityCoord.lat, cityCoord.long);
    });
}

function fiveForecastUV (lat, long){ //grabs the UVindex and creates the cards for the 5-day forecast
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial" + aKey)
    .then(function(response){
        return response.json();  
    })
    .then(function(weatherData){
        var uvIndex = document.getElementById('uvIndex');
        let uvi = weatherData.current.uvi;
        if (uvi >= 0 && uvi <= 2){ uvIndex.classList.add('uvGreen'); } 
        else if (uvi >= 3 && uvi <= 5){ uvIndex.classList.add('uvYellow'); } 
        else if (uvi >= 6 && uvi <= 7){ uvIndex.classList.add('uvOrange'); } 
        else if (uvi >= 8 && uvi <= 10){ uvIndex.classList.add('uvRed'); } 
        else { uvIndex.classList.add('uvPurple'); }
        uvIndex.textContent = uvi;
        for (i = 0; i < 5; i++){
            var newCard = document.getElementById('day' + (i + 1));
            var date = moment.unix(weatherData.daily[i].dt).format('MMM Do YYYY')
            var icon = weatherData.daily[i].weather[0].icon;
            var description = weatherData.daily[i].weather[0].main;
            var temp = weatherData.daily[i].temp.day;
            var humidity = weatherData.daily[i].humidity;
            var dailyCard = `<h3>${date}</h3><br><img src="https://openweathermap.org/img/w/${icon}.png"><br><p>${description}</p><p>Temp: ${temp}°F</p><p>Humidity: ${humidity}%</p>`
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
    recentButton(cityInput);
    citySearch(cityInput);
    }
})

setInterval(theTimeIsNow, 1000); //updates date and time every second
localStore();