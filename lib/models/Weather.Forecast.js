import WeatherDay from './Weather.Day.js';

export default class WeatherForecast {
  #date;
  #tempMinArr = [];
  #tempMaxArr = [];
  #precipProbabArr = [];
  #windSpeedArr = [];
  #weatherType = [];

  /**@param {WeatherDay} day*/
  constructor(day) {
    this.#date = day.date;
    this.#pushValuesToArrays(day);
  }
  /**@param {WeatherDay} day*/
  addFieldsFromWeatherDay(day) {
    this.#pushValuesToArrays(day);
  }

  get calucateAverageWeather() {
    return new WeatherDay({
      date: this.#date,
      tempMin: this.#calculateAvgValue(this.#tempMinArr),
      tempMax: this.#calculateAvgValue(this.#tempMaxArr),
      precipProbab: this.#calculateAvgValue(this.#precipProbabArr),
      windSpeed: this.#calculateAvgValue(this.#windSpeedArr),
      weatherType: this.#weatherType.join(', '),
    });
  }

  #calculateAvgValue(arr = []) {
    return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  }

  /**@param {WeatherDay} day*/
  #pushValuesToArrays(day) {
    if (day.tempMin !== undefined) {
      this.#tempMinArr.push(day.tempMin);
    }
    if (day.tempMax !== undefined) {
      this.#tempMaxArr.push(day.tempMax);
    }
    if (day.precipProbab !== undefined) {
      this.#precipProbabArr.push(day.precipProbab);
    }
    if (day.windSpeed !== undefined) {
      this.#windSpeedArr.push(day.windSpeed);
    }
    if (day.weatherType !== undefined) {
      this.#weatherType.push(day.weatherType);
    }
  }
}
