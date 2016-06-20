function showForecast(){
        $("#forecastHistory").show().val("dummy");
    }

        function hideCountries(){
            $("#countries").hide();
            $("#forecastHistory").val("dummy");
            $("#curve_chart").empty();
        }

        function hideCities(){
            $("#cities").hide();
            $("#forecastHistory").val("dummy");
            $("#curve_chart").empty();
        }

        function hideForecast(){
            $("#forecastHistory").hide();
        }
        function loadCountries(select)
        {
           var selectedContinent = $(select).val();
            var apiAddress = "https://restcountries-v1.p.mashape.com/region/" + selectedContinent + "?mashape-key=Ii6PLoklilmshJZyJQYO4xPj7ITzp1x2D5SjsnRiB0F5ihwKP3";


            $.get(apiAddress, function(data){
                insertCountries(data);
            });

            $("#countries").show();
        }

        function insertCountries(countriesJSON) {
            var fillCountries = $("#countries");
            fillCountries.empty();

            fillCountries.append('<option value="dummy">---Select Country---</option>');

            for (countryID in countriesJSON) {

                var newOption = "<option value='"+ countriesJSON[countryID].name+"'>"+countriesJSON[countryID].name+ "</option>";

                fillCountries.append(newOption);
            }
        }

        function loadCities(choosen)
        {
            var selectedCountry = $(choosen).val();

            var apiCitiesAddress = "http://api.geonames.org/searchJSON?formatted=true&q="+ selectedCountry +"&maxRows=10&lang=es&username=sunaraishin&style=full";
            $.get(apiCitiesAddress, function(cities){
               insertCities(cities);
            });

            $("#cities").show();
        }

        function insertCities(citiesJSON){
             var fillCities = $("#cities");
             fillCities.empty();

             fillCities.append('<option value="dummy">---Select City---</option>');

            for (var i=1; i<citiesJSON.geonames.length; i++){

                var newCityOption = "<option value='" + citiesJSON['geonames'][i].name + " ' > " + citiesJSON['geonames'][i].name + "</option>";

                fillCities.append(newCityOption);
            }
        }

        function loadWeather(forecast)
        {
            var selectedCity = $(forecast).val();


            var weatherApiAddress = "http://api.openweathermap.org/data/2.5/weather?q=" +selectedCity +"&APPID=9ade4021728fcbf4c1643188bb76e5aa";
            $.get(weatherApiAddress, function(weatherForecast){
                loadForecast(weatherForecast);
            })
            var weatherHistoryAddress =  "http://api.openweathermap.org/data/2.5/forecast/daily?q=" +selectedCity +"&APPID=9ade4021728fcbf4c1643188bb76e5aa";
            $.get(weatherHistoryAddress, function(weatherHistory){
                WeatherDataCache = weatherHistory;

            })
        }

        function loadHistory(select){

            var ChartArray = [];

            var searchBy = $(select).val();

            title = $(select).children(":selected").html();

            ChartArray[0] = ['Date', title];

            for(var j= 1; j<WeatherDataCache.list.length; j++){

                var CharDataDate = new Date(WeatherDataCache.list[j].dt *1000);

                CharDataDate = CharDataDate.getFullYear() + "-"  + (CharDataDate.getMonth()+1) + "-" + CharDataDate.getDate();

                var Element ;
                switch (searchBy)
                {
                    case 'humidity' :
                        Element = [ CharDataDate, WeatherDataCache.list[j].humidity] ;
                        break;

                    case 'pressure' :
                        Element = [ CharDataDate, WeatherDataCache.list[j].pressure] ;
                        break;

                    case 'temp.max' :
                        Element = [CharDataDate, (parseInt(WeatherDataCache.list[j].temp.max - 273.15))];
                        break;
                    case 'speed' :
                        Element = [CharDataDate, WeatherDataCache.list[j].speed];
                        break;
                }


                ChartArray.push(Element);

            }

            drawChart(ChartArray);

        }

        function loadForecast(weatherJSON){

            var loadedWeather = $("#forecastInfo");


            var newCityForecast = weatherJSON.weather[0].description ;

            $("#description").html(newCityForecast);

            var cityHumidity = weatherJSON.main.humidity + "%";

            $("#humidity").html(cityHumidity);

            var cityTemperature = parseFloat(weatherJSON.main.temp - 273.15).toFixed(2) + " C";

            $("#temp").html(cityTemperature);

            var citySunrise = new Date(weatherJSON.sys.sunrise * 1000) ;

            $("#sunrise").html(citySunrise.getHours()+ ":" + citySunrise.getMinutes());

            var citySunset =  new Date(weatherJSON.sys.sunset * 1000) ;

            $("#sunset").html(citySunset.getHours()+ ":" + citySunset.getMinutes());

            var cityWind = weatherJSON.wind.speed + " mp/h ";

            $("#wind").html(cityWind);

            var weatherIcon = "<img src='images/" + weatherJSON.weather[0].icon+".png" + "' alt='icon' class='img-rounded'>";

            $("#icon").html(weatherIcon);
        }

    function loadForecastAndWeather(selectedCity){
        showForecast();
        loadWeather(selectedCity);
        $("#curve_chart").empty();
        $("#forecastHistory").val("dummy");
        // select nachalna stoinost, izprazvane na div
    }


        var WeatherDataCache;


        google.setOnLoadCallback(drawChart);

        function drawChart(ChartArray) {

            var data = google.visualization.arrayToDataTable(ChartArray);

            var options = {
                title: 'Forecast Data for the next 5 days based on ' + ChartArray[0][1],
                curveType: 'function',
                legend: { position: 'bottom' }
            };

            var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

            chart.draw(data, options);
        }