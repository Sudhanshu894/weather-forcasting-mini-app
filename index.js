let sicon = document.querySelector('.search-icon');
let count = 0;
sicon.addEventListener('click',()=>{
    count++;
    if (count%2==0){
        document.querySelector('.searchbox').style.width = "50px";
    }else {
        document.querySelector('.searchbox').style.width = "40%";
    }
});
let key = "78bdab3e6db5583c0d0510bab1cccb3d";
let area = document.getElementById('location');
let map = document.querySelector('.map');
let searchicon = document.querySelector('.search-icon');
searchicon.addEventListener('click',()=>{
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${area.value}&exclude=hourly,minutely&units=metric&appid=${key}`).then((res)=>res.json()).then((data)=>{
      let {lat,lon} = data.coord;
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${key}`).then((response)=> response.json()).then((data2)=>{
      Showdata(data2);
      map.innerHTML = null;
      map.innerHTML = `<iframe
      width="100%"
      height="100%"
      style="border: 0"
      loading="lazy"
      allowfullscreen
      src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCSNPhXcGxhjRFlv338BM9bQen74MLOR1I&q=${area.value}"
    >
    </iframe>`
    console.log("data2:",data2);
    dailyforcasting(data2);
  })
      });
  
  
  
})
navigator.geolocation.getCurrentPosition((currforcast)=>{
    let {latitude,longitude} = currforcast.coords;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${key}`).then((res)=> res.json()).then((data)=>{
        Showdata(data);
    });

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${key}`).then((res) => res.json()).then(function (data) {
        console.log(data);
        dailyforcasting(data);
    });
});
let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const Showdata = (data)=>{
    let date = new Date();
    let todaydate = date.getDate();
    let month = date.getMonth();
    let day = date.getDay();
    let hour = date.getHours();
    let minutes = date.getMinutes().length!==1? date.getMinutes() : `0${date.getMinutes()}`
    let hourtime = hour>12? hour%12:hour;
    let dn = hour<12? "AM": "PM";
    let time = `${hourtime} : ${minutes} ${dn}`;

    let currdate = `${week[day]}, ${todaydate} ${months[month]}`
    let rise = `${window.moment(data.current.sunrise * 1000).format('hh:mm A')}`;
    let set = `${window.moment(data.current.sunset * 1000).format('hh:mm A')}`;

    let timetemp = document.querySelector(".time-temp");
    timetemp.innerHTML = null;
    timetemp.innerHTML = `
    <div class="area">
    <p>${data.timezone}</p>
  </div>
  <div class="time">
    <p>${time}</p>
    <p>${currdate}</p>
  </div>
  <div class="temp">
    <div class="curr-temp">
      <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" alt="" />
      <div>${data.current.temp}°C</div>
    </div>
    <div class="min-max-temp">
      <div class="min-temp">
        <i class="fas fa-thermometer-quarter"></i>
        <div>${data.daily[0].temp.min}°C</div>
      </div>
      <div class="max-temp">
        <i class="fas fa-thermometer-three-quarters"></i>
        <div>${data.daily[0].temp.max}°C</div>
      </div>
    </div>
  </div>
  <div class="weather-info">
    <div>
      <div>Humidity</div>
      <div>${data.current.humidity}%</div>
    </div>
    <div>
      <div>Wind speed</div>
      <div>${data.current.wind_speed}</div>
    </div>
    <div>
      <div>Sunrise</div>
      <div>${rise}</div>
    </div>
    <div>
      <div>Sunset</div>
      <div>${set}</div>
    </div>
  </div>`
}

  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  let date2 = new Date();
  let recentforcast = document.querySelector(".daily-forcast");
  function dailyforcasting(data) {
    let currentforcst = "";
    data.daily.map(function (day, index) {
      let start = date2.getDay();
      if (index === 0) {
        currentforcst += `<div class="recent_forcast_weather">
        <div class="day_name">${days[(start + index) % 7]}day</div>
        <div class="recent_forcast_weather_info">
          <div class="recent_img_div">
            <div class="temp2">${day.temp.day}°C</div>
            <img src="http://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@2x.png" alt="" />
          </div>
          <div class="day_night_temp2">
            <div class="day_temp2">
              <p>Day</p>
              <span>${day.temp.day}°C</span>
            </div>
            <div class="night_temp2">
              <p>Night</p>
              <span>${day.temp.night}°C</span>
            </div>
          </div>
        </div>
      </div>`;
      } else {
        currentforcst += `<div class="future_forcast">
        <div class="future_day_name">${days[(start + index) % 7]}</div>
        <div class="futureimg_div">
          <img src="http://openweathermap.org/img/wn/${
            day.weather[0].icon
          }@2x.png" alt="" />
        </div>
        <div class="future_day_night_temp2">
          <div class="future_day_temp2">
            <p>Day <span>${day.temp.day}°C</span></p>
          </div>
          <div class="future_night_temp2">
            <p>Night <span>${day.temp.night}°C</span></p>
          </div>
        </div>
      </div>`;
        start++;
      }
    });
    recentforcast.innerHTML = currentforcst;
  }