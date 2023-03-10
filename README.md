<div id="top"></div>

# WeatherSand (Node.js)

## Idea & Description

Have you ever had to open 2-3 applications to check the weather and mentally estimate the approximate temperature and the probability of precipitation? Well, I really hope so, because this node.js application provides a simple tool to retrieve the average weather forecast for the next 7 days for any location in the world from different sources. Well.. so far there are only 2 of them, but the number of data sources will grow.

This is a pure Node.js server application that serves as an API. It uses only two lightweight libraries - "[dotenv](https://github.com/motdotla/dotenv)" and "[undici](https://github.com/nodejs/undici)" - to fetch data from multiple APIs and calculate the forecast. It can easily be integrated into any web or mobile application that requires weather data.

(There will be also a user-side app based on this API)

## API usage
At the moment, this API has only two methods - "geocoding" and "get-weather-daily".

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


### Geocoding
The "geocoding" method allows you to retrieve the longitude and latitude of a city by its name.

To retrieve them, make a GET request to `/api/geocoding` with only 1 query `name`.

Example - `/api/geocoding?name=London`

### Get-weather-daily
The "get-weather-daily" method retrieves the average weather forecast for the next 7 days for a given longitude and latitude.

To retrieve it, make a GET request to `/api/get-weather-daily` with two required queries: `lon` and `lat`. 

Example - `api/get-weather-daily?lat=51.50853&lon=-0.12574`

## Dependencies
This application has only two dependencies:

  1. [dotenv](https://github.com/motdotla/dotenv)
  2. [undici](https://github.com/nodejs/undici)

## Roadmap

- [ ]  	Add hourly forecast
- [ ]   Add localization for "geocoding"
- [ ]   Add more forecast sources
- [ ]   ?

<p align="right"><a href="#top">back to top</a></p>
