const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const infos = document.querySelector(".infos"); // remover/colocar o hidden
const temperatura = document.querySelector(".temperatura");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const notFound = document.querySelector(".not-found"); // remover/colocar o hidden
const stateCountry = document.querySelector(".stateCountry");
const imgTemp = document.querySelector(".imgTemp");
const container = document.querySelector(".container");
const min = document.getElementById("min")
const max = document.getElementById("max")

const APIkey = "1c26b13541647d80382ec1f368081e27";

const getGeocoding = (cityName, APIkey) => {
    console.log(APIkey);
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${APIkey}`
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.cod == "404") {
                // entra aqui se digitar uma cidade que nao existe
                infos.classList.add("hidden");
                notFound.classList.remove("hidden");
            } else {
                // esconder/mostrar a div certa
                // container.style.height = "500px"; Mudar isso
                infos.classList.remove("hidden");
                notFound.classList.add("hidden");
                // switch para mostrar a img de acordo com o retorno da api
                switch (data.weather[0].main) {
                    case "Clear":
                        imgTemp.src = "images/clear.png";
                        break;
                    case "Clouds":
                        imgTemp.src = "images/clouds.png";
                        break;
                    case "Rain":
                        imgTemp.src = "images/Rain.png";
                        break;
                    case "Drizzle":
                        imgTemp.src = "images/Drizzle.png";
                        break;
                    case "Thunderstorm":
                        imgTemp.src = "images/Thunderstorm.png";
                        break;
                    case "Snow":
                        imgTemp.src = "images/snow.png";
                        break;
                    case "Mist":
                        imgTemp.src = "images/mist.png";
                        break;
                    default:
                        imgTemp.src = "";
                }

                if (data.name && data.sys.country) {
                    stateCountry.innerHTML = data.name + "," + data.sys.country;
                } else if (data.name) {
                    stateCountry.innerHTML = data.name;
                } else if (data.sys.country) {
                    stateCountry.innerHTML = data.sys.country;
                }
                min.innerHTML = "Min: " + data.main.temp_min + "°C"
                max.innerHTML = "Max: " + data.main.temp_max + "°C"
                temperatura.innerHTML = data.main.temp + "°C";
                humidity.innerHTML = data.main.humidity + "%"
                wind.innerHTML = data.wind.speed + "m/s"
                 
            }
        })
        .catch((error) => {
            alert("Erro : " + error);
        });
};

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getGeocoding(searchInput.value, APIkey);
    }
});