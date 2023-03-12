import { config } from 'dotenv';
import undici from 'undici';
// helpers
import { createQueryParams, parseQueryParams } from '../../helpers.js';
// models
import { City, MyResponse } from '../../models/index.js';

config();
const geoapi = process.env.GEOAPI;

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
export default async function getCityByCoords(req, res) {
  try {
    const query = parseQueryParams(req.url);

    const name = query.name;
    const language = query.lang || 'en';

    if (!name) {
      res.statusCode = 400;
      return MyResponse.error({ message: 'name query is required' });
    }

    const _url =
      geoapi +
      createQueryParams({
        name,
        language,
      });

    const response = await undici.request(_url);

    if (response.statusCode != 200) {
      console.log({ geocodingError: response.body.json() });
      return;
    }
    const { results } = await response.body.json();

    const citiesArray = results.map(item => new City(item));

    const data = new MyResponse(citiesArray, citiesArray.length);

    return data.json();
  } catch (err) {
    console.log({ err });
    return;
  }
}
