import weather1 from './weather.1.js';
import weather2 from './weather.2.js';
import weather3 from './weather.3.js';

const weather = [weather1, weather2, weather3];

const weatherDev = [weather1, weather2];

export default process.env.DEV_MODE ? weatherDev : weather;
