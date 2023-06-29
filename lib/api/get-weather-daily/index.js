// helpers
import { calculateWeatherResults, parseQueryParams } from '../../helpers.js';
// models
import { MyResponse } from '../../models/index.js';
// controllers
// import weatherControllers from '../../controllers/weather/index.js';
import weatherControllers from '../../services/weather/index.js';

/**
 * @param {import('fastify').FastifyRequest} req
 * @param {import('fastify').FastifyReply} reply
 */
export default async function getWeatherSet(req, reply) {
  const query = parseQueryParams(req.url);
  
  if (!query.lat || !query.lon) {
    reply.statusCode = 400;
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


