export default class City {
  constructor({
    id,
    name,
    latitude,
    longitude,
    elevation,
    country_code,
    timezone,
    country,
    admin1,
    admin2,
    admin3,
  }) {
    this.id = id;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.elevation = elevation;
    this.country_code = country_code;
    this.timezone = timezone;
    this.country = country;
    this.desc1 = admin1 || '';
    this.desc2 = admin2 || '';
    this.desc3 = admin3 || '';
  }

  static fromJson(json) {
    const obj = JSON.parse(json);
    return Object.assign(new City(), obj);
  }

  toJson() {
    return JSON.stringify(this);
  }
}
