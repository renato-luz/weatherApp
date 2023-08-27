const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const infos = document.querySelector(".infos"); // remover/colocar o hidden
const notFound = document.querySelector(".not-found"); // remover/colocar o hidden
const stateCountry = document.querySelector(".stateCountry");
const imgTemp = document.querySelector(".imgTemp");
const container = document.querySelector(".container");
const tempAtual = document.querySelector(".tempAtual")
const minTemp = document.querySelector(".min")
const maxTemp = document.querySelector(".max")
const wind = document.querySelector(".wind")
const humidity = document.querySelector(".humidity")
const APIkey = "1c26b13541647d80382ec1f368081e27";

const ctx = document.getElementById("myChart");

const getGeocoding = (cityName, APIkey) => {
    fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${APIkey}`
    )
        .then((response) => response.json())
        .then((data) => {
            container.classList.add("container-expanded")
            if (data.cod == "404") {
                // entra aqui se digitar uma cidade que nao existe
                infos.classList.add("hidden");
                notFound.classList.remove("hidden");
            } else {

                infos.classList.remove("hidden");
                notFound.classList.add("hidden");
                // 
                switch (data.list[0].weather[0].main) {
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

                console.log(data)
                const dataNavegador = new Date();
                const horaAtual = dataNavegador.getHours(); // hora atual
                const ctx = document.getElementById("myChart").getContext("2d");
                // guarda as temperaturas e labels a serem mostradas
                const temperaturasParaMostrar = [];
                const labelsParaMostrar = [];
                tempAtual.innerHTML = data.list[0].main.temp + "°C"
                minTemp.innerHTML = "Min : " + data.list[0].main.temp_min + "°C"
                maxTemp.innerHTML = "Max : " + data.list[0].main.temp_max + "°C"
                wind.innerHTML = data.list[0].wind.speed + "m/s"
                humidity.innerHTML = data.list[0].main.humidity + "%"
                // Itera sobre cada item na lista de dados da API.
                data.list.forEach((item) => {
                    // Cria um objeto de data a partir da string de data/hora fornecida pelo item.
                    const dataItem = new Date(item.dt_txt);
                    // Obtém a hora do item.
                    const horaItem = dataItem.getHours();
                    // Verifica se o item pertence ao mesmo dia que o navegador
                    //e se a hora do item está entre a hora atual e 21h(ultima hora fornecida pela API)
                    if (
                        dataItem.getDate() === dataNavegador.getDate() &&
                        horaItem >= horaAtual &&
                        horaItem <= 21
                    ) {
                        // Adiciona a temperatura do item ao array de temperaturas a serem mostradas.
                        temperaturasParaMostrar.push(item.main.temp);
                        // Adiciona o rótulo (label) formatado com a hora ao array de rótulos a serem mostrados.
                        labelsParaMostrar.push(`${horaItem}:00`);
                    }
                });
                
                if (myChart) {
                    // Atualiza os dados do gráfico
                    myChart.data.labels = labelsParaMostrar;
                    myChart.data.datasets[0].data = temperaturasParaMostrar;
                    myChart.update();
                } else {
                    // Cria um novo gráfico
                    myChart = new Chart(ctx, {
                        type: "line",
                        data: {
                            labels: labelsParaMostrar,
                            datasets: [
                                {
                                    label: "Temperature of " + cityName,
                                    data: temperaturasParaMostrar,
                                    borderWidth: 5,
                                    borderColor: 'rgb(30, 33, 102)', // Cor da linha do gráfico
                                },
                            ],
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        },
                    });
                }
            }
        });

};

let myChart; // Variável para armazenar a instância do gráfico


searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        // Antes de fazer uma nova pesquisa, destrua a instância do gráfico atual
        if (myChart) {
            myChart.destroy();
            myChart = undefined;
        }
        getGeocoding(searchInput.value, APIkey);
    }
});