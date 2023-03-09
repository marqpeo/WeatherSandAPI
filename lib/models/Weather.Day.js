export default class WeatherDay {
  constructor({ date, tempMin, tempMax, precipProbab, windSpeed, weatherType }) {
    (this.date = date),
      (this.tempMin = tempMin),
      (this.tempMax = tempMax),
      (this.precipProbab = precipProbab),
      (this.windSpeed = windSpeed),
      (this.weatherType = weatherType);
  }
}
