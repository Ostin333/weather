function locatinName(lat, lng) {
    const locatinTextArea = document.querySelector('.location-name');
    const geocoder = new google.maps.Geocoder();

    const latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({
        'latLng': latlng
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            locatinTextArea.innerText = results[0].address_components[3].long_name;
        }
    });
}

function fromUnixTime(unixTime) {
    let timestamp = moment.unix(unixTime);
    return timestamp.format('DD.MM.YYYY');
}

function skycons(icon) {
    let skycons = new Skycons({
        "color": "#343a40"
    });
    skycons.add(document.querySelector('#icon'), icon);
    skycons.play();
}

function setWeatherOnWeek(mainData, i) {
    document.querySelector('#date').innerHTML = fromUnixTime(mainData.daily.data[i].time);
    document.querySelector('#icon').innerHTML = mainData.daily.data[i].icon;
    document.querySelector('#summary').innerHTML = 'Погодні умови: ' + mainData.daily.data[i].summary;
    document.querySelector('#temperature').innerHTML = 'Від ' + mainData.daily.data[i].temperatureMin.toFixed() + ' до ' + mainData.daily.data[i].temperatureMax.toFixed() + '°C';
    document.querySelector('#wind-speed').innerHTML = 'Швидкість вітру: ' + mainData.daily.data[i].windSpeed + ' м/с';
    document.querySelector('#pressure').innerHTML = 'Тиск: ' + mainData.daily.data[i].pressure + ' гПа';
    skycons(mainData.daily.data[i].icon);
}

function displayWeather(mainData) {
    let dayNumb = 0;
    setWeatherOnWeek(mainData, dayNumb);
    const prevDayBtn = document.querySelector('.previous-day');
    const nextDayBtn = document.querySelector('.next-day');

    prevDayBtn.addEventListener('click', () => {
        setWeatherOnWeek(mainData, (dayNumb - 1));
        nextDayBtn.style = 'display: inline-block';

        if (dayNumb === 1) {
            prevDayBtn.style = 'display: none';
        }
        dayNumb--;
    });

    nextDayBtn.addEventListener('click', () => {
        setWeatherOnWeek(mainData, (dayNumb + 1));
        prevDayBtn.style = 'display: inline-block';

        if (dayNumb === 6) {
            nextDayBtn.style = 'display: none';
        }
        dayNumb++;
    });
}

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    locatinName(latitude, longitude);

    fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/1a8eb82d4ff22515857d6bd677cc8f0b/${latitude},${longitude}?units=si&lang=uk`)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonData) {
            displayWeather(jsonData);
        })
        .catch(function () {
            const errorMessage = document.querySelector('#info-area');
            errorMessage.innerHTML = '<h3>No connection to the site</h3>';
            document.querySelector('.next-day').style = 'display: none';
        })
}

function error() {
    const errorMessage = document.querySelector('#info-area');
    errorMessage.innerHTML = '<h3>Reload the page and agree to track your geolocation</h3>';
    document.querySelector('.next-day').style = 'display: none';
}

navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
});