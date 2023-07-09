import { config } from 'dotenv';
import undici from 'undici';
// helpers
import { createQueryParams, parseQueryParams } from '../../helpers.js';
// models
import { WeatherDay } from '../../models/index.js';

config();
const w2url = process.env.W2API;

/** @param {import('fastify').FastifyRequest} req */
export default async function getWeather2(req) {
  const query = parseQueryParams(req.url);

  const _url =
    w2url +
    '/bin/civillight.php' + // '/bin/civillight.php' OR '/bin/api.pl'
    createQueryParams({
      lat: query.lat,
      lon: query.lon,
      lang: 'en',
      output: 'json',
      tzshift: 1,
    });
  try {
    const res = await undici.request(_url);

    if (res.statusCode != 200) {
      console.log({ resInWeaher2: await res.body.json() });
      return;
    }

    const { dataseries: data } = await res.body.json();

    const forecast = [];
    for (const day of data) {
      const date = String(day.date);
      const newDay = new WeatherDay({
        date: new Date(
          `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6)}`
        ).toISOString(),
        tempMin: day.temp2m.min,
        tempMax: day.temp2m.max,
        weatherType: day.weather,
        windSpeed: calcWindSpeed(day.windspeed_10m_max),
      });
      forecast.push(newDay);
    }
    return forecast;
  } catch (err) {
    console.log(err);
    return;
  }
}

function calcWindSpeed(number) {
  const res = [0.1, 1.8, 5.7, 9.4, 14, 20.8, 28.5, 35];
  return res[number - 1];
}
