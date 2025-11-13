const http = require('http');
const Router = require('./router');

/**
 * Main Application class
 * Orchestrates routing, middleware, and HTTP server lifecycle
 */
class App {
  constructor(options = {}) {
    this.router = new Router();
    this.middleware = [];
    this.options = options;
  }

  /**
   * Register a GET route
   * @param {string} path - Route path pattern
   * @param {...Function} handlers - Handler functions
   */
  get(path, ...handlers) {
    this.router.addRoute('GET', path, handlers);
  }

  /**
   * Register a POST route
   * @param {string} path - Route path pattern
   * @param {...Function} handlers - Handler functions
   */
  post(path, ...handlers) {
    this.router.addRoute('POST', path, handlers);
  }

  /**
   * Register a PUT route
   * @param {string} path - Route path pattern
   * @param {...Function} handlers - Handler functions
   */
  put(path, ...handlers) {
    this.router.addRoute('PUT', path, handlers);
  }

  /**
   * Register a DELETE route
   * @param {string} path - Route path pattern
   * @param {...Function} handlers - Handler functions
   */
  delete(path, ...handlers) {
    this.router.addRoute('DELETE', path, handlers);
  }

  /**
   * Register a PATCH route
   * @param {string} path - Route path pattern
   * @param {...Function} handlers - Handler functions
   */
  patch(path, ...handlers) {
    this.router.addRoute('PATCH', path, handlers);
  }

  /**
   * Register global middleware
   * @param {Function} middleware - Middleware function with signature (req, res, next)
   */
  use(middleware) {
    this.middleware.push(middleware);
  }

  /**
   * Create a route group with a common path prefix
   * @param {string} prefix - Path prefix for all routes in the group
   * @param {Function} callback - Callback function that receives a scoped context
   */
  group(prefix, callback) {
    // Create a scoped context that prepends prefix to all routes
    const groupContext = this._createGroupContext(prefix, []);
    
    // Execute the callback with the scoped context
    callback(groupContext);
  }

  /**
   * Create a group context with prefix and middleware stack
   * @param {string} prefix - Path prefix to prepend to routes
   * @param {Function[]} parentMiddleware - Middleware from parent groups
   * @returns {Object} - Scoped context object with route registration methods
   * @private
   */
  _createGroupContext(prefix, parentMiddleware) {
    const self = this;
    
    // Normalize prefix (ensure it starts with / and doesn't end with /)
    const normalizedPrefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
    const cleanPrefix = normalizedPrefix.endsWith('/') && normalizedPrefix.length > 1 
      ? normalizedPrefix.slice(0, -1) 
      : normalizedPrefix;

    // Group-specific middleware stack
    const groupMiddleware = [...parentMiddleware];

    return {
      /**
       * Register middleware for this group
       * @param {Function} middleware - Middleware function
       */
      use(middleware) {
        groupMiddleware.push(middleware);
      },

      /**
       * Register a GET route in this group
       * @param {string} path - Route path pattern
       * @param {...Function} handlers - Handler functions
       */
      get(path, ...handlers) {
        const fullPath = cleanPrefix + path;
        self.router.addRoute('GET', fullPath, handlers);
        self._addGroupMiddlewareToRoute(groupMiddleware);
      },

      /**
       * Register a POST route in this group
       * @param {string} path - Route path pattern
       * @param {...Function} handlers - Handler functions
       */
      post(path, ...handlers) {
        const fullPath = cleanPrefix + path;
        self.router.addRoute('POST', fullPath, handlers);
        self._addGroupMiddlewareToRoute(groupMiddleware);
      },

      /**
       * Register a PUT route in this group
       * @param {string} path - Route path pattern
       * @param {...Function} handlers - Handler functions
       */
      put(path, ...handlers) {
        const fullPath = cleanPrefix + path;
        self.router.addRoute('PUT', fullPath, handlers);
        self._addGroupMiddlewareToRoute(groupMiddleware);
      },

      /**
       * Register a DELETE route in this group
       * @param {string} path - Route path pattern
       * @param {...Function} handlers - Handler functions
       */
      delete(path, ...handlers) {
        const fullPath = cleanPrefix + path;
        self.router.addRoute('DELETE', fullPath, handlers);
        self._addGroupMiddlewareToRoute(groupMiddleware);
      },

      /**
       * Register a PATCH route in this group
       * @param {string} path - Route path pattern
       * @param {...Function} handlers - Handler functions
       */
      patch(path, ...handlers) {
        const fullPath = cleanPrefix + path;
        self.router.addRoute('PATCH', fullPath, handlers);
        self._addGroupMiddlewareToRoute(groupMiddleware);
      },

      /**
       * Create a nested group within this group
       * @param {string} nestedPrefix - Additional prefix for nested group
       * @param {Function} callback - Callback function for nested group
       */
      group(nestedPrefix, callback) {
        // Stack prefixes for nested groups
        const stackedPrefix = cleanPrefix + nestedPrefix;
        const nestedContext = self._createGroupContext(stackedPrefix, groupMiddleware);
        callback(nestedContext);
      }
    };
  }

  /**
   * Add group middleware to the most recently added route
   * @param {Function[]} middleware - Array of middleware functions
   * @private
   */
  _addGroupMiddlewareToRoute(middleware) {
    if (middleware.length > 0 && this.router.routes.length > 0) {
      const lastRoute = this.router.routes[this.router.routes.length - 1];
      lastRoute.middleware = [...middleware];
    }
  }

  /**
   * Execute middleware stack followed by final handler
   * @param {Request} req - Request wrapper object
   * @param {Response} res - Response wrapper object
   * @param {Function[]} middlewareStack - Array of middleware functions
   * @param {Function} finalHandler - Final handler to execute after middleware
   * @private
   */
  async _executeMiddleware(req, res, middlewareStack, finalHandler) {
    let index = 0;

    const next = async (error) => {
      // If an error is passed, skip to error handling
      if (error) {
        throw error;
      }

      // Stop execution if response has been sent
      if (res._sent) {
        return;
      }

      // If we've executed all middleware, run the final handler
      if (index >= middlewareStack.length) {
        await finalHandler();
        return;
      }

      // Get the current middleware and increment index
      const middleware = middlewareStack[index++];

      // Execute the middleware with next callback
      await middleware(req, res, next);
    };

    // Start the middleware chain
    await next();
  }

  /**
   * Handle incoming HTTP requests
   * @param {IncomingMessage} req - Node.js request object
   * @param {ServerResponse} res - Node.js response object
   * @private
   */
  async _handleRequest(req, res) {
    const Request = require('./request');
    const Response = require('./response');

    // Create Request and Response wrapper instances
    const request = new Request(req);
    const response = new Response(res);

    try {
      // Parse request body asynchronously
      await request._parseBody();

      // Implement route matching logic using router
      const match = this.router.match(request.method, request.path);

      // Handle 404 case when no route matches
      if (!match) {
        response.status(404).json({
          error: 'Not Found',
          message: `Cannot ${request.method} ${request.path}`,
          path: request.path,
          method: request.method
        });
        return;
      }

      // Extract and assign route params to request object
      request.params = match.params;

      // Combine global middleware with route-specific middleware
      const middlewareStack = [...this.middleware, ...(match.middleware || [])];
      
      // Create final handler that executes all route handlers
      const finalHandler = async () => {
        for (const handler of match.handlers) {
          if (response._sent) break;
          await handler(request, response);
        }
      };

      // Execute middleware chain followed by route handlers
      await this._executeMiddleware(request, response, middlewareStack, finalHandler);

    } catch (error) {
      // Log error details to console with stack trace
      console.error('Request handling error:');
      console.error(error.stack || error);
      
      // Send 500 status code with error message in JSON format
      // Ensure error response is only sent if response hasn't been sent already
      if (!response._sent) {
        response.status(500).json({
          error: 'Internal Server Error',
          message: error.message,
          path: request.path,
          method: request.method
        });
      }
    }
  }

  /**
   * Start the HTTP server on the specified port
   * @param {number} port - Port number to listen on
   * @param {Function} callback - Optional callback to execute after server starts
   * @returns {http.Server} The HTTP server instance
   */
  listen(port, callback) {
    // Create HTTP server using Node.js http.createServer()
    const server = http.createServer((req, res) => {
      // Bind _handleRequest to server's request event
      this._handleRequest(req, res);
    });

    // Start server on specified port
    server.listen(port, () => {
      // Log listening message to console when server starts
      console.log(`Server listening on port ${port}`);
      
      // Execute optional callback after server starts
      if (callback) {
        callback();
      }
    });

    return server;
  }
}

module.exports = App;
