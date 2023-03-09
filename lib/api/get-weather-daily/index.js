// helpers
import { parseQueryParams } from '../../helpers.js';
// models
import { MyResponse, WeatherDay, WeatherForecast } from '../../models/index.js';
// controllers
import weatherControllers from '../../controllers/weather/index.js';

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
export default async function getWeatherSet(req, res) {
  const queriesIsAcceptable = () => {
    const q = parseQueryParams(req.url);
    return q.lat && q.lon;
  };
  if (!queriesIsAcceptable()) {
    res.statusCode = 400;
    return MyResponse.error({
      en: " 'lon' and 'lon' query not found",
      es: " 'lon' y 'lon' query no encontrados",
      ru: " 'lon' и 'lon' query не найдены",
    });
  }

  try {
    const getResultsArray = async functionsArray => {
      const results = [];
      for await (const func of functionsArray) {
        await func(req).then(res => {
          if (res) {
            results.push(res);
          }
        });
      }

      return results;
    };

    const arr = await getResultsArray(weatherControllers);

    const s = calculateResults(arr);

    const weatherSet = new MyResponse(s, arr.length);

    return weatherSet.json();
  } catch (e) {
    console.log({ message: 'error in get-weather-daily/index.js', e });
    return;
  }
}

/**@param {Array<WeatherDay[]>} results*/
function calculateResults(results) {
  const firstForecast = results[0];

  /**@type {WeatherForecast[]}*/
  const w = [];

  for (let dayId = 0; dayId < firstForecast.length; dayId++) {
    w.push(new WeatherForecast(results[0][dayId]));
    for (let fId = 1; fId < results.length; fId++) {
      const day = results[fId][dayId];
      w[dayId].addFieldsFromWeatherDay(day);
    }
  }
  const result = w.map(w => w.calucateAverageWeather);

  return result;
}
