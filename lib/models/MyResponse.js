export default class MyResponse {
  #resultsArr;
  #count;

  /**@param {Array} resultsArr*/
  constructor(resultsArr, count) {
    this.#resultsArr = resultsArr;
    this.#count = count;
  }

  json() {
    return JSON.stringify({
      status: 'ok',
      count: this.#count,
      results: this.#resultsArr,
    });
  }
  /**@param {object} error*/
  static error(error) {
    return JSON.stringify(this.#errorObj(error));
  }

  static #errorObj(error) {
    if (typeof error !== 'object') {
      throw new Error('Returned error must be an object (and with localization)');
    }
    return {
      status: 'error',
      error,
    };
  }
}
