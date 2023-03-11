<div id="top"></div>

# WeatherSand (Node.js)

## Idea & Description

Have you ever had to open 2-3 applications to check the weather and mentally estimate the approximate temperature and the probability of precipitation? Well, I really hope so, because this node.js application provides a simple tool to retrieve the average weather forecast for the next 7 days for any location in the world(almost) from different sources. And so far there are 3 of them, but the number of data sources will grow.

This is a pure Node.js server application that serves as a REST API. It uses only two libraries - dotenv and undici (more info below). It can easily be integrated into any web or mobile application that requires weather data.

(There will be also a frontend app based on this API, stay tuned)

## API usage

### Response type

All responses will be a JSON object with the following properties:

```
{
	status: 'ok' OR 'error'
	results: a list of results (of cities OR forecast days)
	count: a number of results (the number of cities founded by passed query OR sources from which it was collected and processed the result forecast)
	error (optional): an error message if the status is 'error'
}
```


At the moment, this API has only two methods - "geocoding" and "get-weather-daily".

### 📍 `/geocoding`
This method allows you to retrieve the longitude and latitude of the desired city by it's name.

To retrieve them, make a GET request to `/api/geocoding` with only 1 query `name`.

Example - `/api/geocoding?name=London`  ([try](https://weather-sand.onrender.com/api/geocoding?name=London))

### ⛅ `/get-weather-daily`
This method retrieves the average weather forecast for the next 7 days for a given longitude and latitude.

To retrieve it, make a GET request to `/api/get-weather-daily` with two required queries: `lon` and `lat`. 

Example - `/api/get-weather-daily?lat=51.50853&lon=-0.12574`  ([try](https://weather-sand.onrender.com/api/get-weather-daily?lat=51.50853&lon=-0.12574))

## Dependencies
This application has only two dependencies:

  1. [dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from .env for nodejs projects.
  2. [undici](https://github.com/nodejs/undici) - An HTTP/1.1 client, written from scratch for Node.js. In the project is used to fetch data from multiple APIs for calculating the result forecast.

## 🗓️ Roadmap

- [ ]   Add localization for "geocoding"
- [ ]   Start writing documentation [on the main page](https://weather-sand.onrender.com/)
- [ ]  	Add hourly forecast
- [ ]   Add more API sources (up to 5 at this stage)
- [ ]   Frontend app based on this API
- [ ]   ?

<p align="right"><a href="#top">back to top</a></p>
