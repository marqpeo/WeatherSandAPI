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

    const _url = geoapi + createQueryParams({ name: query.name });

    const res = await undici.request(_url);

    if (res.statusCode != 200) {
      console.log({ resInWeaher2: res });
      return;
    }
    const { results } = await res.body.json();

    const citiesArray = results.map(item => new City(item));

    const data = new MyResponse(citiesArray, citiesArray.length);

    return data.json();
  } catch (err) {
    console.log({ err });
    return;
  }
}
