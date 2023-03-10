import fs from 'fs';
import path from 'path';

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

export function convertDate(date) {
  return new Date(date).toISOString();
}

export const httpError = (res, status, message) => {
  res.statusCode = status;
  res.end(message);
};

export async function cacheFolders(path, apiCache) {
  fs.readdir(path, async (err, files) => {
    if (err) {
      return console.log({ err });
    }
    files.forEach(async name => {
      await cacheFiles(path + name, apiCache);
    });
  });
}

async function cacheFiles(filePath, apiCache) {
  try {
    const isFolder = fs.statSync(filePath).isDirectory();
    if (isFolder) {
      return cacheFolders(filePath + '/', apiCache);
    }

    const { default: method } = await import(path.resolve(filePath));

    const basename = path.basename(filePath, '.js');
    const key =
      basename == 'index'
        ? path.dirname(filePath).split('api/')[1]
        : path.dirname(filePath).split('api/')[1] + '/' + basename;

    saveMethodToApi(apiCache, method, key);
  } catch (errorCacheFiles) {
    console.log({ errorCacheFiles });
  }
}

function saveMethodToApi(api, method, key) {
  if (Array.isArray(api)) {
    return api.push(method);
  } else if (api instanceof Map) {
    if (!key) {
      throw Error('key param is required in case of api is instance of Map');
    }
    return api.set(key, method);
  }
}
