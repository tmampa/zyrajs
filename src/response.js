/**
 * Response wrapper class
 * Provides a convenient API for sending HTTP responses
 */
class Response {
  constructor(res) {
    this._res = res;
    this._sent = false;
  }

  /**
   * Set the HTTP status code
   * @param {number} code - HTTP status code
   * @returns {Response} - Returns this for chaining
   */
  status(code) {
    this._res.statusCode = code;
    return this;
  }

  /**
   * Send a JSON response
   * @param {*} data - Data to serialize as JSON
   */
  json(data) {
    if (this._sent) {
      return;
    }

    this.setHeader('Content-Type', 'application/json');
    this._res.end(JSON.stringify(data));
    this._sent = true;
  }

  /**
   * Send a text/HTML response
   * @param {string} data - Text or HTML content to send
   */
  send(data) {
    if (this._sent) {
      return;
    }

    this.setHeader('Content-Type', 'text/html');
    this._res.end(data);
    this._sent = true;
  }

  /**
   * Set a response header
   * @param {string} key - Header name
   * @param {string} value - Header value
   * @returns {Response} - Returns this for chaining
   */
  setHeader(key, value) {
    this._res.setHeader(key, value);
    return this;
  }

  /**
   * End the response stream
   */
  end() {
    if (this._sent) {
      return;
    }

    this._res.end();
    this._sent = true;
  }
}

module.exports = Response;
