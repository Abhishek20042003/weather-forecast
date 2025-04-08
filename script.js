
// Basic understanding.

// console.log('Hello jee Anurag');

// let API_KEY = "301f0cad5c889d912c9bacf564b4fd41";

// async function renderWeatherInfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`

//     document.body.appendChild(newPara);

    
// }

// async function fetchWeatherDetails(){

//     try{
//         let city = "Raipur";

//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    
//         const data = await response.json();
    
//         console.log("Weather data:->" , data);

//         renderWeatherInfo(data);                                
    
//     }
//     catch(err){
//            console.log("Error found in this", err);
//     }
    
// }

// async function getCustomWeatherDetails(){

//     try{
         
//         let latitude = 10.6333;
//         let longitude = 14.3333;
    
//         let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    
//             let data = await response.json();
    
//             console.log("Weather data:->", data);
//     }

//     catch(err){
//               console.log("error found", err);
//     }

    
    
// }

// // Current Position

// function getLocation(){
//     if(navigator.geolocation)
//     {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("No geolocation supports");
//     }
// }

// function showPosition(position)
// {
//     let lat = position.coords.latitude;
//     let long = position.coords.longitude;

//     console.log(lat);
//     console.log(long);
// }









const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_KEY = "2123d61d8f3a8ed4cf23a4d0a670373b";
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab) {
             if(clickedTab != currentTab){
                currentTab.classList.remove("current-tab");
                currentTab = clickedTab;
                currentTab.classList.add("current-tab");

                if(!searchForm.classList.contains("active")){
                    userInfoContainer.classList.remove("active");
                    grantAccessContainer.classList.remove("active");
                    searchForm.classList.add("active");
                }

                else{
                    searchForm.classList.remove("active");
                    userInfoContainer.classList.remove("active")
                    // loadingScreen.classList.add("active");
                    getFromSessionStorage()
                }
             }
}

userTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(searchTab);
})

// check if coordinates are already present in session storage
function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    } 

    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
} 

async function fetchUserWeatherInfo(coordinates) {
    const {lat,lon} = coordinates;
    // make grantContainer invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API CALL
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        // loadingScreen.classList.remove("active")
        // console.log("CITY NOT FOUND", err);
        console.error("Error found:", err);
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    //   firstly, we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-Humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values from weatherInfo object and put in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C` ;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s` ;
    humidity.innerText = `${weatherInfo?.main?.humidity} %` ;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %` ;
   
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
   else{
    console.log("No geolocation support available");
   }

}

function showPosition(position){
   const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
       
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
     fetchUserWeatherInfo(userCoordinates);
    // if (typeof fetchUserWeatherInfo === 'function') {
    //     fetchUserWeatherInfo(userCoordinates);
    // } else {
    //     console.error("fetchUserWeatherInfo function is not defined");
    // }
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

let searchInput = document.querySelector("[ data-searchInput]") 
searchForm.addEventListener("submit", (e) => {
       e.preventDefault();
       let cityName = searchInput.value;

       if(cityName === "")
        return

       else
       fetchWeatherByCity(cityName);
         // fetchUserWeatherInfo(cityName)
})

async function  fetchWeatherByCity(cityName) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
    //    const city = "Phagwara";
      //  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);   {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data)
       
    }
    catch(err){
        console.error("Error found:", err);
        loadingScreen.classList.remove("active");
    }
}









// const userTab = document.querySelector("[data-userWeather]");
// const searchTab = document.querySelector("[data-searchWeather]");
// const userContainer = document.querySelector(".weather-container");

// const grantAccessContainer = document.querySelector(".grant-location-container");
// const searchForm = document.querySelector("[data-searchForm]");
// const loadingScreen = document.querySelector(".loading-container");
// const userInfoContainer = document.querySelector(".user-info-container");

// let currentTab = userTab;
// const API_KEY = "2123d61d8f3a8ed4cf23a4d0a670373b";
// currentTab.classList.add("current-tab");
// getFromSessionStorage();

// function switchTab(clickedTab) {
//     if (clickedTab !== currentTab) {
//         currentTab.classList.remove("current-tab");
//         currentTab = clickedTab;
//         currentTab.classList.add("current-tab");

//         if (!searchForm.classList.contains("active")) {
//             userInfoContainer.classList.remove("active");
//             grantAccessContainer.classList.remove("active");
//             searchForm.classList.add("active");
//         } else {
//             searchForm.classList.remove("active");
//             userInfoContainer.classList.remove("active");
//             getFromSessionStorage();
//         }
//     }
// }

// userTab.addEventListener("click", () => {
//     switchTab(userTab);
// });

// searchTab.addEventListener("click", () => {
//     switchTab(searchTab);
// });

// function getFromSessionStorage() {
//     const localCoordinates = sessionStorage.getItem("user-coordinates");
//     if (!localCoordinates) {
//         grantAccessContainer.classList.add("active");
//     } else {
//         const coordinates = JSON.parse(localCoordinates);
//         fetchWeatherByCoordinates(coordinates);
//     }
// }

// async function fetchWeatherByCoordinates(coordinates) {
//     const { lat, lon } = coordinates;
//     grantAccessContainer.classList.remove("active");
//     loadingScreen.classList.add("active");

//     try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         loadingScreen.classList.remove("active");
//         userInfoContainer.classList.add("active");
//         renderWeatherInfo(data);
//     } catch (err) {
//         console.error("Error found:", err);
//         loadingScreen.classList.remove("active");
//     }
// }

// async function fetchWeatherByCity(city) {
//     loadingScreen.classList.add("active");
//     userInfoContainer.classList.remove("active");
//     grantAccessContainer.classList.remove("active");

//     try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//         if (!response.ok) {
//             if (response.status === 404) {
//                 showErrorMessage("City not found. Please try a different city.");
//             } else {
//                 showErrorMessage("An error occurred. Please try again later.");
//             }
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         loadingScreen.classList.remove("active");
//         userInfoContainer.classList.add("active");
//         renderWeatherInfo(data);
//     } catch (err) {
//         console.error("Error found:", err);
//         loadingScreen.classList.remove("active");
//     }
// }

// function renderWeatherInfo(weatherInfo) {
//     const cityName = document.querySelector("[data-cityName]");
//     const countryIcon = document.querySelector("[data-countryIcon]");
//     const desc = document.querySelector("[data-weatherDesc]");
//     const weatherIcon = document.querySelector("[data-weatherIcon]");
//     const temp = document.querySelector("[data-temp]");
//     const windSpeed = document.querySelector("[data-windSpeed]");
//     const humidity = document.querySelector("[data-Humidity]");
//     const cloudiness = document.querySelector("[data-cloudiness]");

//     cityName.innerText = weatherInfo?.name;
//     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
//     desc.innerText = weatherInfo?.weather?.[0]?.description;
//     weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
//     temp.innerText = `${weatherInfo?.main?.temp} °C`;
//     windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
//     humidity.innerText = `${weatherInfo?.main?.humidity} %`;
//     cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
// }

// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//         console.log("No geolocation support available");
//     }
// }

// function showPosition(position) {
//     const userCoordinates = {
//         lat: position.coords.latitude,
//         lon: position.coords.longitude,
//     };
//     sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
//     fetchWeatherByCoordinates(userCoordinates);
// }

// const grantAccessButton = document.querySelector("[data-grantAccess]");
// grantAccessButton.addEventListener("click", getLocation);

// const searchInput = document.querySelector("[data-searchInput]");
// searchForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const cityName = searchInput.value;

//     if (cityName === "") return;

//     fetchWeatherByCity(cityName);
// });

// function showErrorMessage(message) {
//     const errorContainer = document.querySelector(".error-container");
//     if (errorContainer) {
//         errorContainer.innerText = message;
//         errorContainer.classList.add("active");
//     }
// }
