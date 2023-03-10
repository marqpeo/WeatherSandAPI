import undici from 'undici';
import { config } from 'dotenv';
// helpers
import { convertDate, createQueryParams, parseQueryParams } from '../../helpers.js';
// models
import { WeatherDay } from '../../models/index.js';

config();
const w1url = process.env.W1API;

/**@param {http.IncomingMessage} req */
export default async function getWeather1(req) {
  const query = parseQueryParams(req.url);

  const _url =
    w1url +
    createQueryParams({
      latitude: query.lat,
      longitude: query.lon,
      daily:
        'temperature_2m_min&daily=temperature_2m_max&daily=precipitation_probability_max&daily=windspeed_10m_max',
      windspeed_unit: 'ms',
      timezone: 'Europe/Madrid',
    });
  try {
    const res = await undici.request(_url);

    if (res.statusCode != 200) {
      console.log({ resInWeaher1: res.body.json() });
      return;
    }

    const { daily: data } = await res.body.json();

    const daysArr = data.time.map(convertDate);

    const forecast = [];

    for (let i = 0; i < daysArr.length; i++) {
      const newDay = new WeatherDay({
        date: daysArr[i],
        tempMin: data.temperature_2m_min[i],
        tempMax: data.temperature_2m_max[i],
        precipProbab: data.precipitation_probability_max[i],
        windSpeed: data.windspeed_10m_max[i],
      });
      forecast.push(newDay);
    }
    return forecast;
  } catch (err) {
    console.error(err);
    return;
  }
}
