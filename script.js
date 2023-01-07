const API_KEY = "3dce7d239fdda2b1ad6fc3f06be5e21b";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.querySelector("#city-input");
const form = document.querySelector("form");
const currentCity = document.querySelector("#current-city");
const currentDate = document.querySelector("#current-date");
const currentIcon = document.querySelector("#current-icon");
const currentTemp = document.querySelector("#current-temp");
const currentHumidity = document.querySelector("#current-humidity");
const currentWind = document.querySelector("#current-wind");
const forecast = document.querySelector("#forecast");
const searchHistory = document.querySelector("#search-history");
const searchHistoryUl = document.querySelector('#search-history ul');
const li = document.createElement('li');
const button = document.createElement('button');

// Add an event listener to the form
form.addEventListener("submit", event => {
  event.preventDefault(); // Prevent the form from reloading the page
  const city = cityInput.value; // Get the value of the city input
  cityInput.value = ""; // Clear the input field
  getWeather(city); // Get the weather data for the city
});

// Function to get the weather data for a city
async function getWeather(city) {
    // Make a request to the OpenWeatherMap API for current weather data of searched city
    const response = await fetch(`${API_URL}?q=${city}&units=imperial&appid=${API_KEY}`);
    const data = await response.json();
  
    // Update the page with the current weather data
    currentCity.textContent = data.name;
    currentDate.textContent = new Date().toDateString();
    currentIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    currentTemp.textContent = data.main.temp;
    currentHumidity.textContent = data.main.humidity;
    currentWind.textContent = data.wind.speed;
  
    // Request for the 5-day forecast data of the city
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${API_KEY}`);
    const forecastData = await forecastResponse.json();
  
    // Clear the forecast element
    forecast.innerHTML = "";
  
    // Loop through the forecast data and create a forecast element for each day
    for (let i = 0; i < forecastData.list.length; i++) {
      // Get the date and time of the forecast
      const dateTime = forecastData.list[i].dt_txt;
      if (dateTime.includes("12:00:00")) {
        const forecastDate = new Date(dateTime);
        const forecastDay = document.createElement("div");
        forecastDay.classList.add("forecast-day");
        forecastDay.innerHTML = `
          <div class="forecast-date">${forecastDate.toDateString()}</div>
          <img class="forecast-icon" src="http://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}@2x.png" alt="Weather icon">
          <div class="forecast-temp">${forecastData.list[i].main.temp}°F</div>
          <div class="forecast-humidity">Humidity: ${forecastData.list[i].main.humidity}%</div>
          <div class="forecast-wind">Wind: ${forecastData.list[i].wind.speed} mph</div>
          `;
      forecast.appendChild(forecastDay);
    }
  }

  // Save the city to localStorage
  saveCityToLocalStorage(city);
}

// Function to save city to localStorage
function saveCityToLocalStorage(city) {
  // Check if the cities key exists in localStorage
  if (localStorage.getItem("cities") === null) {
  // If it doesn't, create an empty array and set it to the cities key
  localStorage.setItem("cities", JSON.stringify([]));
  }
  
  // Get the cities array from localStorage
  let cities = JSON.parse(localStorage.getItem("cities"));
  
  // Add the city to the array
  cities.push(city);
  
  // Save the updated array to localStorage
  localStorage.setItem("cities", JSON.stringify(cities));
  }
  
  // Function that displays the search history
  function displaySearchHistory() {
  if (localStorage.getItem("cities") === null) {
  localStorage.setItem("cities", JSON.stringify([]));
  }
  
  // Get the cities array from localStorage
  let cities = JSON.parse(localStorage.getItem("cities"));
  
  // Loop through the array of cities
  for (let i = 0; i < cities.length; i++) {
  const li = document.createElement("li");
  // Create a button for the city
  const button = document.createElement("button");
  button.textContent = cities[i];
  // Add an event listener to the button to search for the city when it is clicked
  button.addEventListener("click", event => {
  getWeather(event.target.textContent);
  });
  // Append the button to the list item
  li.appendChild(button);
  searchHistoryUl.appendChild(li);
  }
  }
  
displaySearchHistory();

function getSearchHistoryFromLocalStorage() {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistoryUl.innerHTML = '';
};