$(document).ready(function(){
  //device event listener
  if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});

function onDeviceReady(){
  console.log('device is ready...');

  $('#other_location').hide();
  var r = confirm("Use current location?");
  
  if (r !== true) {
      $('#other_location').show();
     
      $('#other_location').on('submit', function(e){
        e.preventDefault();
        getOtherLocation();
      });
    
  } else {

  getDate();

  getLocation();

  }
}

//get, format and display current date and time
function getDate(){
  var currentdate = new Date();
  var datetime = (currentdate.getMonth()+1) + "/"
               + currentdate.getDate() + "/"
               + currentdate.getFullYear() + " @ "
               + currentdate.getHours() + ":"
               + currentdate.getMinutes() + ":"
               + currentdate.getSeconds();
  $('#datetime_display').html(datetime);
}

function getLocation(){  

  console.log('getting users location...');

  navigator.geolocation.getCurrentPosition(function(position){
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var postcode = '';
    var country = '';
    var html = '';

    $.ajax({
      url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+', '+lon,
      datatype: 'jsonp',
      success: function(response){
        city = response.results[0].address_components[2].long_name;
        postcode = response.results[0].address_components[6].long_name;
        country = response.results[0].address_components[5].short_name;

        html = '<h1>'+city+', '+country+'</h1>' ;

        $('#myLocation').html(html);

        //get weather info
        getWeather(city, country);
      }
    })

  });
}




//get the weather info for a location
function getWeather(city, country){
  console.log('Getting Weather For '+city+'...');

  var html ='';
  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&units=imperial&APPID=645d4ad9726af1e851b9f70f76a47993',
    datatype: 'jsonp',
    success: function(parsed_json){
      console.log(parsed_json);

      weather = parsed_json.weather[0]['description'];
      temp = parsed_json.main.temp;
      icon =  parsed_json.weather[0]['icon'];
      icon_url = 'http://openweathermap.org/img/w/'+icon+'.png'

      html = '<h1 class="text-center"><img src="'+icon_url+'"> '+weather+'</h1>' +
              '<h2 class="text-center">'+temp+'º Fahrenheit</h2>';

      $('#weather').html(html);
    }
  });
}


//get info for another location
function getOtherLocation(city, country){
    var city = $('#city').val();
    var country = $('#country').val();
    var html = '';

        html = '<h1>'+city+', '+country+'</h1>' ;

        $('#myLocation').html(html);

        //get weather info
        getWeather(city, country);
      }
