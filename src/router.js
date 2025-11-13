const { pathToRegexp } = require('path-to-regexp');

class Router {
  constructor() {
    this.routes = [];
  }

  /**
   * Register a new route
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} path - Route path pattern (e.g., '/users/:id')
   * @param {Function[]} handlers - Array of handler functions
   */
  addRoute(method, path, handlers) {
    const keys = [];
    const regex = pathToRegexp(path, keys);
    const paramNames = keys.map(key => key.name);

    this.routes.push({
      method: method.toUpperCase(),
      path,
      regex,
      paramNames,
      handlers: Array.isArray(handlers) ? handlers : [handlers],
      middleware: []
    });
  }

  /**
   * Find a matching route for the given method and path
   * @param {string} method - HTTP method
   * @param {string} path - Request path
   * @returns {Object|null} - Matched route with extracted params, or null
   */
  match(method, path) {
    const normalizedMethod = method.toUpperCase();

    for (const route of this.routes) {
      if (route.method !== normalizedMethod) {
        continue;
      }

      const matches = route.regex.exec(path);
      if (matches) {
        const params = this._extractParams(route.paramNames, matches);
        return {
          ...route,
          params
        };
      }
    }

    return null;
  }

  /**
   * Extract parameter values from regex matches
   * @param {string[]} paramNames - Array of parameter names
   * @param {Array} matches - Regex match results
   * @returns {Object} - Object mapping parameter names to values
   * @private
   */
  _extractParams(paramNames, matches) {
    const params = {};
    
    // matches[0] is the full match, matches[1+] are capture groups
    for (let i = 0; i < paramNames.length; i++) {
      params[paramNames[i]] = matches[i + 1];
    }

    return params;
  }

  /**
   * Convert a path pattern to a regular expression
   * Note: This method is kept for interface compatibility but delegates to path-to-regexp
   * @param {string} path - Route path pattern
   * @returns {RegExp} - Regular expression for matching
   * @private
   */
  _pathToRegex(path) {
    const keys = [];
    return pathToRegexp(path, keys);
  }
}

module.exports = Router;
