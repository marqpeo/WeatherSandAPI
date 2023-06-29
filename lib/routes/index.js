import getCityByCoords from "../api/geocoding/index.js";
import getWeatherSet from "../api/get-weather-daily/index.js";

/**
 * @param {import("fastify").FastifyInstance} fastify 
 * @param {Object} options 
 */
export default async function routes(fastify, options){
  fastify.get('/api/get-weather-daily', getWeatherSet )
  fastify.get('/api/geocoding', getCityByCoords )
}