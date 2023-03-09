import fs from 'fs';
import http from 'http';
import path from 'path';
import { MyResponse } from './lib/models/index.js';

const port = process.env.PORT || 3000;

const api = new Map();

const apiPath = './lib/api/';

async function cacheFolder(path) {
  fs.readdir(path, async (err, files) => {
    if (err) {
      return console.log({ err });
    }
    files.forEach(async (name) => {
      await cacheFiles(path + name)
    });
  });

}

async function cacheFiles(filePath) {
  try {
    const isFolder = fs.statSync(filePath).isDirectory();
    if (isFolder) {
      return cacheFolder(filePath + '/');
    }
    const basename = path.basename(filePath, '.js');
    const key =
      basename == 'index'
        ? path.dirname(filePath).split('api/')[1]
        : path.dirname(filePath).split('api/')[1] + '/' + basename;
    const { default: method } = await import(filePath);
    api.set(key, method);
  } catch (errorCacheFiles) {
    console.log({ errorCacheFiles });
  }
}

cacheFolder(apiPath);


setTimeout(() => {
  console.log({ api });
}, 2000);


const httpError = (res, status, message) => {
  res.statusCode = status;
  res.end(message);
};

http
  .createServer(async (req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url;
    const [first, ...rest] = url.substring(1).split('/');
    if (first === 'api' && rest[0] !== '') {
      res.setHeader('content-type', 'application/json; charset=utf-8');
      try {
        const methodUrl = rest.join('/').split('?')[0];
        const method = api.get(methodUrl);
        const result = await method(req, res);
        if (!result) {
          httpError(res, 500, MyResponse.error({ en: 'Server Error' }));
          return;
        }
        res.end(result);
      } catch (err) {
        console.dir({ err });
        httpError(res, 500, MyResponse.error({ en: 'Server Error' }));
      }
    } else {
      const path = `./static/${first}`;
      try {
        const data = await fs.promises.readFile(path);
        res.end(data);
      } catch (err) {
        httpError(res, 404, MyResponse.error({ en: 'File is not found' }));
      }
    }
  })
  .listen(port);
