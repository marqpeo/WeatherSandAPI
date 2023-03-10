import fs from 'fs';
import http from 'http';
// helpers
import { cacheFolders, httpError } from './lib/helpers.js';
// models
import { MyResponse } from './lib/models/index.js';

const port = process.env.PORT || 3000;

const api = new Map();

const apiPath = './lib/api/';

cacheFolders(apiPath, api);

setTimeout(() => {
  console.log({ api });
}, 2000);

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
