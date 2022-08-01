var timeEl = document.querySelector('#time');
var searchBtn = document.querySelector('#searchBtn');
var searchHistory = document.querySelector('#searchHistory');

function theTimeIsNow() { // displays the time in the search results box
    var currentTime = moment().format('ddd, MMM Do YYYY, hh:mm:ss a');
    timeEl.textContent = currentTime;
};

setInterval(theTimeIsNow, 1000);

function citySearch (city) {
    

}

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