async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("Weather-data");
    weatherDataSection.style.display = "block";
    const apiKey = "efcbc254d1ca79780fc5df1b54997205";


    if (searchInput == "") {
        weatherDataSection.innerHTML = `
        <div>
            <h2>Empty, Input!</h2>
            <p>Please try again with a valid <u>City Name</u>.</p>
        </div>
        `;
        return;
    }

    async function getLonAndLat(){
        const geoCodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=1&appid=${apiKey}`;
        const response = await fetch(geoCodeUrl);
        if (!response.ok){
            console.log("Bad Response! ", response.status);
            return;
        }
        const data = await response.json();
        if (data.length == 0){
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML = `
            <div>
                <h2>Invalid Input: "${searchInput}"</h2>
                <p>Please try again with a valid <u>City Name</u></p>
            </div>
            `;
            return;
        } else {
            return data[0];
        }
    }
    async function getWeatherData(lon, lat) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(weatherURL);
        if(!response.ok){
            console.log("Bad Response! ", response.status);
            return;
        }
        const data = await response.json();   
        weatherDataSection.style.display = "flex";         
        weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
        <div>
            <h2>${data.name}</h2>
            <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
            <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>
        `;
    }

    document.getElementById("search").value = "";
    const geoCodeData = await getLonAndLat();
    if(geoCodeData){
        getWeatherData(geoCodeData.lon, geoCodeData.lat);
    }
}