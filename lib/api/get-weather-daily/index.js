// helpers
import { calculateWeatherResults, parseQueryParams } from '../../helpers.js';
// models
import { MyResponse } from '../../models/index.js';
// controllers
// import weatherControllers from '../../controllers/weather/index.js';
import weatherControllers from '../../services/weather/index.js';

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
export default async function getWeatherSet(req, res) {
  const query = parseQueryParams(req.url);
  
  if (!query.lat || !query.lon) {
    res.statusCode = 400;
    return MyResponse.error({ message: "'lat' and/or 'lon' query not found" });
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
    const weatherSet = new MyResponse(calculateWeatherResults(arr), arr.length);

    return weatherSet.json();
  } catch (e) {
    console.log({ message: 'error in get-weather-daily/index.js', e });
    return;
  }
}


