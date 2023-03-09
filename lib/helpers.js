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
