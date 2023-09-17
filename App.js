import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
//importing needed modules and dependencies

const API_KEY = 'e70b24a50530567853b26818f1cf0076';
//my API key to access weather

const WeatherApp = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [lon, setLon] = useState(0);
  const [lat, setLat] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
//using usestate hook to declare state variables and set setter functions

//using use state hook 
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync(); //requesting location permission
      if (status !== 'granted') { //if clause when permission not granted
        setErrorMsg('Permission to access location was denied');
        return;
      }

      if (status === 'granted') { //if permission granted
        let location = await Location.getCurrentPositionAsync({}); //getting location
        setLat(location.coords.latitude); //setting latitude accordnig location
        setLon(location.coords.longitude); //setting longtitude accordnig location
        setLocation(location);
        fetchWeather(location.coords.latitude, location.coords.longitude);
      }
    })();
  }, []);

  //fetching weather function
  const fetchWeather = (lat, lon) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((json) => {
        setWeatherData(json);
      })
      .catch((error) => {
        console.error(error); // getting error if weather data is not fetched
      });
  };

  let text = 'Loading....';
  if (errorMsg) {
    text = errorMsg; //showing error msg if location not found
  } else if (location) {
    text = `Latitude: ${lat}, Longitude: ${lon}`; // if no error getting location display longtitude and latitude
  }

  //output
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      {weatherData && weatherData.main && (
        <View>
          <Text>Temperature: {weatherData.main.temp}°C</Text>
          <Text>Weather Condition: {weatherData.weather[0].description}</Text>
        </View>
      )}
    </View>
  );
};

//style sheets
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default WeatherApp;
//Shenal M Don
//S1498742