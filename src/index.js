document.addEventListener('DOMContentLoaded', function () {
  // The fetchWeather function
  async function fetchWeather(city) {
      try {
          const apiKey = '2a2eaa51d996796495bf456e5b58adf4'; // Replace with your actual API key
          console.log(`Fetching weather for: ${city}`);
          
          // Current weather API
          const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
          const weatherData = weatherResponse.data;
          console.log("Current weather data received:", weatherData);

          document.querySelector('.selected-city').innerText = weatherData.name;
          let tempCelsius = weatherData.main.temp;
          let tempFahrenheit = (tempCelsius * 9/5) + 32;
          document.querySelector('.temperature').innerHTML = `${Math.round(tempCelsius)}°C | ${Math.round(tempFahrenheit)}°F`;

          document.getElementById('condition').innerText = weatherData.weather[0].description.toUpperCase();
          document.querySelector('.weather-info').innerHTML = `<p>Wind: ${weatherData.wind.speed} mph</p><p>Humidity: ${weatherData.main.humidity}%</p>`;
          
          // Forecast API for next days
          const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
          const forecastData = forecastResponse.data;
          console.log("Forecast data received:", forecastData);

          updateForecast(forecastData);
      } catch (error) {
          console.error("Error fetching weather:", error);
          alert('City not found!');
      }
  }

  function updateForecast(forecastData) {
      const forecastElements = document.querySelectorAll('.forecast div');
      const daysMap = {};
      
      forecastData.list.forEach(entry => {
          const date = new Date(entry.dt * 1000);
          const day = date.toLocaleDateString('en-US', { weekday: 'short' });
          if (!daysMap[day] && Object.keys(daysMap).length < 3) {
              daysMap[day] = {
                  temp: Math.round(entry.main.temp),
                  condition: entry.weather[0].main
              };
          }
      });
      
      let index = 0;
      for (const [day, data] of Object.entries(daysMap)) {
          if (index < forecastElements.length) {
              forecastElements[index].innerHTML = `<p>${day}</p><p>${data.temp}°C</p><p>${data.condition}</p>`;
              index++;
          }
      }
  }

  // Event listener for "Locate Me" button
  document.getElementById('locate-me').addEventListener('click', function () {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async function (position) {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              const apiKey = '2a2eaa51d996796495bf456e5b58adf4'; // Replace with your API key
  
              try {
                  const response = await axios.get(
                      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
                  );
                  const data = response.data;
                  const tempCelsius = Math.round(data.main.temp);
                  const tempFahrenheit = Math.round((tempCelsius * 9) / 5 + 32);
  
                  document.querySelector('.selected-city').innerText = data.name;
                  document.querySelector('.temperature').innerText = `${tempCelsius}°C | ${tempFahrenheit}°F`;
                  document.getElementById('condition').innerText = data.weather[0].description.toUpperCase();
                  document.querySelector('.weather-info').innerHTML = `<p>Wind: ${data.wind.speed} mph</p><p>Humidity: ${data.main.humidity}%</p>`;
              } catch (error) {
                  console.error('Error fetching weather:', error);
                  alert('Unable to fetch location-based weather.');
              }
          }, function (error) {
              alert('Location access denied. Please enable location services.');
          });
      } else {
          alert('Geolocation is not supported by your browser.');
      }
  });

  // Event listener for city search
  document.getElementById('search-city').addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
          let city = this.value.trim();
          if (city) {
              fetchWeather(city);
          }
      }
  });
});
