const { URL } = require('url');

/**
 * Request wrapper class that enhances Node.js IncomingMessage
 * Provides easy access to request data including query params, body, headers, and route params
 */
class Request {
  constructor(req) {
    this._req = req;
    
    // Expose basic properties from Node.js request object
    this.method = req.method;
    this.url = req.url;
    this.headers = req.headers;
    
    // Parse URL to extract path and query parameters
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    this.path = parsedUrl.pathname;
    
    // Parse query string into object
    this.query = {};
    parsedUrl.searchParams.forEach((value, key) => {
      this.query[key] = value;
    });
    
    // Initialize params as empty object (will be populated by router)
    this.params = {};
    
    // Body will be set after parsing
    this.body = null;
  }

  /**
   * Parse JSON request body asynchronously
   * @returns {Promise<Object|null>} Parsed body or null if no body/invalid JSON
   */
  async _parseBody() {
    return new Promise((resolve, reject) => {
      let data = '';
      
      this._req.on('data', chunk => {
        data += chunk.toString();
      });
      
      this._req.on('end', () => {
        if (!data) {
          this.body = null;
          resolve(null);
          return;
        }
        
        // Only parse if content-type is JSON
        const contentType = this.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
          try {
            this.body = JSON.parse(data);
            resolve(this.body);
          } catch (error) {
            reject(new Error('Invalid JSON in request body'));
          }
        } else {
          // For non-JSON content, store as raw string
          this.body = data;
          resolve(data);
        }
      });
      
      this._req.on('error', (error) => {
        reject(error);
      });
    });
  }
}

module.exports = Request;
