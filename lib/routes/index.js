import getCityByCoords from '../controllers/geocoding/index.js';
import getWeatherSet from "../controllers/get-weather-daily/index.js";

/**
 * @param {import("fastify").FastifyInstance} fastify 
 * @param {Object} options 
 */
export default async function routes(fastify, options){
  fastify.get('/api/get-weather-daily', getWeatherSet )
  fastify.get('/api/geocoding', getCityByCoords )
}