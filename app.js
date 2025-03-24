let daysOWs, monthsOY, d, year, day, dayOW, month, time, funcTimes, data;
let temp, tempC, feelsLike, feelsLikeC, skies, wind, windC, humid;
temp = tempC = feelsLike = feelsLikeC = skies = wind = windC = humid = data = null;
daysOWs = ['Sunday', 'Monday', 'Tuesday', 'Wendsday', 'Thursday', 'Friday', 'Saturday'];
monthsOY = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
funcTimes = 0;
d = new Date();
year = d.getFullYear();
day = d.getDate();
dayOW = daysOWs.at(d.getDay());
month = monthsOY.at(d.getMonth());
time = dayOW + ', ' + month + ' ' + day + ', ' + year;
document.getElementById('time').innerHTML = time;
weatherImg('bottom')
weatherBottom()

let metric = document.getElementById('metric');
metric.addEventListener('change', press);

function getLocation(func) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(func, errorHandeling);
  } else {
    alert('Geolocation is not supported in this browser. Therefore, your current weather will no appear.');
  }
}


function errorHandeling(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation. Therefore, your current weather will not appear.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable. Therefore, your current weather will not appear.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out. Therefore, your current weather will not appear.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred in geolocation. Therefore, your current weather will not appear.");
      break;
  }
}


function press() {
  let button = document.getElementById('button');
  button.click()
  weatherBottom()

}

function computeImg(main, des) {
  if (['Drizzle', 'Rain', 'Snow', 'Clear'].includes(main)) {
    return main;
  } else if (main == 'Thunderstorm' && !des.split(' ').includes('rain')) {
    return main;
  } else if (main == 'Thunderstorm' && des.split(' ').includes('rain')) {
    return 'thunderstorm with rain'
  } else if (des == 'fog' || des == 'mist') {
    return 'fog'
  } else if (main == 'Clouds') {
    if (des == 'scattered clouds') {
      return 'few clouds'
    } else {
      return des
    }
  } else {
    return 'unknown'
  }
}

async function placeToLatLon(place) {
  let response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${place.replaceAll(' ', '')}&limit=1&appid=7108da41b667150ec9eb5ae792aadd3d`);
  let data = await response.json();
  let lat = data[0].lat;
  let lon = data[0].lon;
  weather(lat, lon);
  weatherImg(lat, lon, 'top')
}

function search(form) {
  event.preventDefault();
  let latLonPlace = form.latLon.value;
  if (isNaN(latLonPlace[0])) {
    placeToLatLon(latLonPlace);
  } else if (!isNaN(latLonPlace[0])) {
    toLatLon(latLonPlace);
  }
}

function toLatLon(latLon) {
  if (!latLon.includes(',')) {
    alert('Please write latitude & longitude in that order correctly, with a comma between them.');
  }
  let latANDlon = latLon.split(',', 2);
  let lat = latANDlon.at(0).trim();
  let lon = latANDlon.at(1).trim();
  if (isNaN(lat) || isNaN(lon)) {
    alert('Please write numbers for the latitude & longitude.');
  }
  weather(lat, lon);
  weatherImg(lat, lon, 'top');
}

function capitalize(str) {
  str = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return str;
}

function findMode(data) {
  let types = [];
  let many = [];
  data.forEach((element, index) => {
    if (types.includes(element)) {
      many[types.indexOf(element)] += 1;
    } else {
      types.push(element);
      many.push(1);
    }
  });
  let answer = types[many.indexOf(Math.max(...many))]
  return answer
}

function findModePairs(main, des) {
  let data = [];

  for (let i = 0; i<5; i++) {
    data.push(`${main[i]}/${des[i]}`)
  }

  let types = [];
  let many = [];
  data.forEach((element, index) => {
    if (types.includes(element)) {
      many[types.indexOf(element)] += 1;
    } else {
      types.push(element);
      many.push(1);
    }
  });
  let answer = types[many.indexOf(Math.max(...many))].split('/')
  return answer
}

function desToURL(des) {
  let url

  if (des == 'broken clouds') {
    url = 'https://ibb.co/hRddGvBg'
  } else if (des == 'Clear') {
    url = 'https://ibb.co/m5CmTRvF'
  } else if (des == 'Drizzle') {
    url = 'https://ibb.co/YBnYfYrK'
  } else if (des == 'few clouds') {
    url = 'https://ibb.co/rKwxRxKv'
  } else if (des == 'lightning and rain') {
    url = 'https://ibb.co/xpSFB97'
  } else if (des == 'Lightning') {
    url = 'https://ibb.co/4Z326QZ7'
  } else if (des == 'overcast clouds') {
    url = 'https://ibb.co/0RNVLdT8'
  } else if (des == 'Rain') {
    url = 'https://ibb.co/GfchMR9v'
  } else if (des == 'Snow') {
    url = 'https://ibb.co/VWGrkJ2q'
  } else if (des == 'unknown') {
    url = 'https://ibb.co/8w9YjWx'
  } else {
    console.log('ERROR. No match for description.')
  }

  return url
}

async function weatherImg(topOrBottom, lat = 999, lon = 999) {
  if (lat == 999) {
    return new Promise((resolve, reject) => {
      getLocation(function(position) {
        let newLat = position.coords.latitude;
        let newLon = position.coords.longitude;
        resolve(weatherImg(topOrBottom, newLat, newLon));
      });
    });
  }
  let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${lat}&lon=${lon}&appid=7108da41b667150ec9eb5ae792aadd3d`);
  let data = await response.json();

  let tempLowsStore = [[], [], [], [], []];
  let tempHighsStore = [[], [], [], [], []];
  let descriptionStore = [[], [], [], [], []];
  let mainStore = [[], [], [], [], []];
  let tempLows = [];
  let tempHighs = [];
  let description = [];
  let main = [];
  let sky = [];

  for (let x = 0; x<40; x++) {
    tempLowsStore[Math.floor(x/8)].push(data.list[x].main.temp_min);
    tempHighsStore[Math.floor(x/8)].push(data.list[x].main.temp_max);
    descriptionStore[Math.floor(x/8)].push(data.list[x].weather[0].description);
    mainStore[Math.floor(x/8)].push(data.list[x].weather[0].main);
  }

  tempLowsStore.forEach(day => {tempLows.push(Math.min(...day).toFixed(0))});
  tempHighsStore.forEach(day => {tempHighs.push(Math.max(...day).toFixed(0))});

  for (let i = 0;i<5;i++) {
    description.push(findModePairs(mainStore[i], descriptionStore[i])[1]);
    main.push(findModePairs(mainStore[i], descriptionStore[i])[0]);
  }

  let tempLowsC = tempLows.map(day => {return ((day-32)/1.8).toFixed(0)});
  let tempHighsC = tempHighs.map(day => {return ((day-32)/1.8).toFixed(0)});

  let d = new Date();
  let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wendsday', 'Thursday', 'Friday', 'Saturday'];
  let daysOfWeekStart = [];
  let breaker = 0;

  for (let day = d.getDay();;day++) {
    if (breaker == 5) {break};
    if (day > 6) {day -= 7};
    daysOfWeekStart.push(daysOfWeek[day]);
    breaker++;
  }

  console.log(description);
  console.log(main);

  for (let i = 0; i<5; i++) {
    sky[i] = computeImg(main[i], description[i]);
    sky[i] = desToURL(sky[i]);
  }

  console.log(sky);

  for (let i = 1; i<6; i++) {
    let imageDisplay, dayDisplay, highLowDisplay;
    if (topOrBottom == 'top') {
      imageDisplay = document.getElementById('topForecast' + i.toString());
      dayDisplay = document.getElementById('topDayOfWeek' + i.toString());
      highLowDisplay = document.getElementById('topHighLow' + i.toString());
    } else {
      imageDisplay = document.getElementById('bottomForecast' + i.toString());
      dayDisplay = document.getElementById('bottomDayOfWeek' + i.toString());
      highLowDisplay = document.getElementById('bottomHighLow' + i.toString());
    };
    let metric = document.getElementById('metric');
    let units;
    if (metric.checked) {units = '°C'} else {units = '°F'};
    imageDisplay.src = sky[i-1]
    dayDisplay.innerHTML = daysOfWeekStart[i-1];
    if (metric.checked) {
      highLowDisplay.innerHTML = `${tempLowsC[i-1]}-${tempHighsC[i-1]}${units}`;
    } else {
      highLowDisplay.innerHTML = `${tempLows[i-1]}-${tempHighs[i-1]}${units}`;
    };
  };
};

function windDirection(deg) {
  let ans3 = [];
  let ans2 = [];
  let cardinalNums = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  let cardinals = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West', 'North'];

  cardinalNums.forEach(num => {
    ans3.push(deg - num);
  });

  ans3.forEach(num => {
    if (num < 0) {
      ans2.push(num * -1);
    } else {
      ans2.push(num);
    }
  });

  let ans = ans2.toSorted(function(a, b) { return b - a; }).at(-1);
  ans = cardinals.at(ans2.indexOf(ans));
  return ans;
}

async function weather(lat, lon) {
  let unit, unitSpeed, metOrImp;
  if (document.getElementById('metric').checked) {
    unit = '°C';
    unitSpeed = 'MPS';
    metOrImp = 'metric';
  } else {
    unit = '°F';
    unitSpeed = 'MPH';
    metOrImp = 'imperial';
  }
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${metOrImp}&appid=21e7939bc57bfc1b23cc048ea70ba61e`)
    .then(response => {
      response = response.json()
      return response
    }).then(data => {
      if (data.cod == 400) {
        alert('Please write correct latitude and longitudes.')
      }
      document.getElementById(`topTemp`).innerHTML = `Temp: ${Math.floor(data.main.temp)}${unit}`;
      document.getElementById(`topFeelsLike`).innerHTML = `Feels like: ${Math.floor(data.main.feels_like)}${unit}`;
      document.getElementById(`topSkys`).innerHTML = `Skies: ${capitalize(data.weather[0].description)}`;
      document.getElementById(`topWind`).innerHTML = `Wind: ${Math.floor(data.wind.speed)}${unitSpeed} ${windDirection(data.wind.deg)}`;
      document.getElementById(`topHumid`).innerHTML = `Humidity: ${data.main.humidity}%`;
    })
}


async function weatherBottom(lat = 999, lon = 999) {
  if (lat == 999) {
    return new Promise((resolve, reject) => {
      getLocation(function(position) {
        let newLat = position.coords.latitude;
        let newLon = position.coords.longitude;
        resolve(weatherImg(newLat, newLon)); // No need to await here directly, as we are resolving the Promise
      });
    });
  }

  funcTimes++
  if (funcTimes == 1) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=21e7939bc57bfc1b23cc048ea70ba61e`);
    data = await response.json();
    temp = (data.main.temp).toFixed(0) + 'F'
    tempC = ((data.main.temp-32)/1.8).toFixed(0) + 'C'
    feelsLike = (data.main.feels_like).toFixed(0) + 'F'
    feelsLikeC = ((data.main.feels_like-32)/1.8).toFixed(0) + 'C'
    skies = capitalize(data.weather[0].description)
    wind = `${(data.wind.speed).toFixed(0)}MPH ${windDirection(data.wind.deg)}`
    windC = `${(data.wind.speed/2.237).toFixed(0)}MPS ${windDirection(data.wind.deg)}`
    humid = data.main.humidity
  }

  if (document.getElementById('metric').checked) {
    document.getElementById(`bottomTemp`).innerHTML = `Temp: ${tempC}`;
    document.getElementById(`bottomFeelsLike`).innerHTML = `Feels like: ${feelsLikeC}`;
    document.getElementById(`bottomWind`).innerHTML = `Wind: ${windC}`;
  } else {
    document.getElementById(`bottomTemp`).innerHTML = `Temp: ${temp}`
    document.getElementById(`bottomFeelsLike`).innerHTML = `Feels like: ${feelsLike}`;
    document.getElementById(`bottomWind`).innerHTML = `Wind: ${wind}`
    }
  document.getElementById(`bottomSkys`).innerHTML = `Skies: ${skies}.`;
  document.getElementById(`bottomHumid`).innerHTML = `Humidity: ${humid}%`;
}
