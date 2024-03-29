import fs from 'fs';
import path from 'path';
import { WeatherDay, WeatherForecast } from './models/index.js';

/**@param {object} queryObject*/
export function createQueryParams(queryObject) {
  const query = [];
  for (const key in queryObject) {
    if (Object.hasOwnProperty.call(queryObject, key)) {
      const value = queryObject[key];
      query.push(`${key}=${value}`);
    }
  }
  return '?' + query.join('&');
}

/**@param {string} url*/
export function parseQueryParams(url) {
  const queryParams = {};
  const queryArr = url.split('?').slice(1).join('').split('&');
  queryArr.forEach(q => {
    const [key, value] = q.split('=');
    queryParams[key] = value;
  });
  return queryParams;
}

export function convertDate(date, time) {
  let dateString = '';
  if (date) {
    dateString += date;
  } else {
    throw Error('date is required');
  }
  if (time) {
    dateString += ' ' + time;
  }
  return new Date(dateString).toISOString();
}

export function kphTOmps(speedKpH, digAfter = 2) {
  return Number(((speedKpH * 5) / 18).toFixed(digAfter));
}

export const httpError = (res, status, message) => {
  res.statusCode = status;
  res.end(message);
};

export async function cacheFolders(path, apiInstance) {
  fs.readdir(path, async (err, files) => {
    if (err) {
      return console.log({ err });
    }
    files.forEach(async name => {
      await cacheFiles(path + name, apiInstance);
    });
  });
}

async function cacheFiles(filePath, apiInstance) {
  try {
    const isFolder = fs.statSync(filePath).isDirectory();
    if (isFolder) {
      return cacheFolders(filePath + '/', apiInstance);
    }
    const pathResolve = path.relative(path.resolve('/lib/helpers.js'), filePath );
    
    console.log({pathResolve});

    const { default: method } = await import(filePath);

    const basename = path.basename(filePath, '.js');
    const key =
      basename == 'index'
        ? path.dirname(filePath).split('api/')[1]
        : path.dirname(filePath).split('api/')[1] + '/' + basename;

    saveMethodToApi(apiInstance, method, key);
  } catch (errorCacheFiles) {
    console.log({ errorCacheFiles });
  }
}

function saveMethodToApi(apiInstance, method, key) {
  if (Array.isArray(apiInstance)) {
    return apiInstance.push(method);
  } else if (apiInstance instanceof Map) {
    if (!key) {
      throw Error('key param is required in case of api is instance of Map');
    }
    return apiInstance.set(key, method);
  }
}

/**@param {Array<WeatherDay[]>} results*/
export function calculateWeatherResults(results) {
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
