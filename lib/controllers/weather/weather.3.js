import { config } from 'dotenv';
import undici from 'undici';
// helpers
import { convertDate, createQueryParams, kphTOmps, parseQueryParams } from '../../helpers.js';
// models
import { WeatherDay } from '../../models/index.js';

config();
const w3url = process.env.W3API;

/**@param {http.IncomingMessage} req */
export default async function getWeather3(req) {
  const query = parseQueryParams(req.url);

  const formData = new FormData();
  formData.append('days', '7');
  formData.append('location', `${query.lat},${query.lon}`);

  try {
    const res = await undici.request(w3url, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${process.env.W3API_TOKEN}`,
      },
    });

    if (res.statusCode != 200) {
      console.log({ resInWeaher2: res.body.json() });
      return;
    }

    const { forecast: data } = await res.body.json();

    const forecast3 = [];
    for (const day of data) {
      const newDay = new WeatherDay({
        date: convertDate(day.date),
        tempMin: day.min_temp_c,
        tempMax: day.max_temp_c,
        precipProbab: day.chance_of_rain,
        windSpeed: kphTOmps(day.max_wind_kph),
        sunrise: convertDate(day.date, day.sunrise),
        sunset: convertDate(day.date, day.sunset)
      });
      forecast3.push(newDay);
    }
    return forecast3;
  } catch (err) {
    console.log(err);
    return;
  }
}
