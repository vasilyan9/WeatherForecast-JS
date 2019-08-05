const byId = (id, value) => {
    document.getElementById(id).innerHTML = value;
}

const byClass = (Class, index, value) => {
    document.getElementsByClassName(Class)[index].innerHTML = value;
}

const gettingWeather = ()  =>  {
    const inputValue = document.getElementById('search').value;
    document.getElementById('section1').style.display = "grid";
    document.getElementById('section2').style.display = "none";
    document.getElementById('errorMessageGif').style.display = "none";
    byId('errorMessage', 'Loading.....')
    
    let weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    
    const nextDays = {};

    byId('errorMessage','');

    navigator.geolocation.getCurrentPosition((position)=> {
        const API_URL = 'https://api.openweathermap.org/data/2.5/';
        const API_KEY = 'fd48bdf8a8b87b3c140f17625f4e2d57';
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        let url1;
        let url2;
        if(inputValue != '') {
            url1 = `${API_URL}weather?q=${inputValue}&appid=${API_KEY}&units=metric`;
            url2 = `${API_URL}forecast?q=${inputValue}&appid=${API_KEY}&units=metric`;
        }else {
            url1 = `${API_URL}weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`;
            url2 = `${API_URL}forecast?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`;
        }
        Promise.all([
            fetch(url1).then((resp) => resp.json()),
            fetch(url2).then((resp) => resp.json()) 
        ])
        .then((data)=> {
            const weather = data[0];
            let dt = new Date();
            let day = weekday[dt.getDay()];
            let month = dt.getMonth() +1;

            const today = {};
            today.temp = weather.main.temp;
            today.tempIcon = weather.weather[0].icon;
            today.city = weather.name;
            today.country = weather.sys.country;
            today.description = weather.weather[0].description ;
            today.humidity = weather.main.humidity;

            let temperature = Math.round(today.temp);
            byId('errorMessage','');
            byId('weekdays',`${day}`) ;
            byId('dt',`${dt.getDate()}.${month}.${dt.getFullYear()}`);
            byId('city',`${today.city}, ${today.country}`);
            byId('temp',`${temperature} °C`);
            byId('description',today.description);
            byId('humidity',`${today.humidity} °`);
            const tempIcon = document.getElementById('tempIcon');
            tempIcon.src = `http://openweathermap.org/img/w/${today.tempIcon}.png`

            const forecast = data[1];
            const list = forecast.list
            console.log(list);

            let i = 0
                        
            for(let j = 0; j < 40; j+=8) {
                i++;
                let nextDay = new Date(((i) * 1000*60*60*24) + (+new Date()));
                let nextdt = forecast.list[j].dt_txt.split(' ')[0];
                let tempIcon = document.getElementById(`nextDay_tempIcon_${i}`);
                
                let nextweekday = weekday[nextDay.getDay()];
                document.getElementById(`nextDay_${i}`).innerHTML = `${nextweekday} - ${nextdt}`;
                
                nextDays.temp = forecast.list[j].main.temp;
                nextDays.description = forecast.list[j].weather[0].description;
                nextDays.humidity = forecast.list[j].main.humidity;
                nextDays.tempIcon = forecast.list[j].weather[0].icon;

                let temperature = Math.round(nextDays.temp);
                document.getElementById(`nextDay_temp_${i}`).innerHTML = `${temperature} °C`;
                document.getElementById(`nextDay_description_${i}`).innerHTML = nextDays.description;
                document.getElementById(`nextDay_humidity_${i}`).innerHTML = `${nextDays.humidity} °`;
                tempIcon.src = `http://openweathermap.org/img/w/${nextDays.tempIcon}.png`;
                }        
                return hours = (item) => {
                    document.getElementById('section2').style.display = "grid";
                    let i = 0;
                    let j = item * 8 - 8;

                    for(j; j < item * 8; j++) {
                        
                    i+=1
                    let tempIcon = document.getElementById(`hours_tempIcon_${i}`);

                    nextDays.time = forecast.list[j].dt_txt;
                    nextDays.temp = forecast.list[j].main.temp;
                    nextDays.description = forecast.list[j].weather[0].description;
                    nextDays.humidity = forecast.list[j].main.humidity;
                    nextDays.tempIcon = forecast.list[j].weather[0].icon;

                    let temperature = Math.round(nextDays.temp);
                    document.getElementById(`hours_${i}`).innerHTML = `${nextDays.time}`;
                    document.getElementById(`hours_temp_${i}`).innerHTML = `${temperature} °C`;
                    document.getElementById(`hours_description_${i}`).innerHTML = nextDays.description;
                    document.getElementById(`hours_humidity_${i}`).innerHTML = `${nextDays.humidity} °`;

                    tempIcon.src = `http://openweathermap.org/img/w/${nextDays.tempIcon}.png`;
                    
                    }      
                }

        })
        .catch(() => {
            byId('errorMessage','The requested URL/error was not found this server');
            document.getElementById('section1').style.display = "none";
            document.getElementById('section2').style.display = "none";
            document.getElementById('errorMessageGif').style.display = "block";

                })
        })
}

gettingWeather()

const whichButton = (event) => {
    if(event.keyCode == 13) {
         gettingWeather()
    }
}