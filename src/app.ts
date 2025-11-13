import { Server, IncomingMessage, ServerResponse, createServer } from "http";
import Router from "./router";
import { Request } from "./request";
import { Response } from "./response";
import { IApp, AppOptions, GroupContext } from "./types/app";
import { MiddlewareFunction, RouteHandler } from "./types/middleware";

/**
 * Main Application class
 * Orchestrates routing, middleware, and HTTP server lifecycle
 */
export class App implements IApp {
  private router: Router;
  private middleware: MiddlewareFunction[];

  constructor(options: AppOptions = {}) {
    this.router = new Router();
    this.middleware = [];
    // Options parameter reserved for future configuration features
    void options;
  }

  /**
   * Register a GET route
   * @param path - Route path pattern
   * @param handlers - Handler functions (can be RouteHandler or MiddlewareFunction)
   */
  get(path: string, ...handlers: (RouteHandler | MiddlewareFunction)[]): void {
    this.router.addRoute("GET", path, handlers as RouteHandler[]);
  }

  /**
   * Register a POST route
   * @param path - Route path pattern
   * @param handlers - Handler functions (can be RouteHandler or MiddlewareFunction)
   */
  post(path: string, ...handlers: (RouteHandler | MiddlewareFunction)[]): void {
    this.router.addRoute("POST", path, handlers as RouteHandler[]);
  }

  /**
   * Register a PUT route
   * @param path - Route path pattern
   * @param handlers - Handler functions (can be RouteHandler or MiddlewareFunction)
   */
  put(path: string, ...handlers: (RouteHandler | MiddlewareFunction)[]): void {
    this.router.addRoute("PUT", path, handlers as RouteHandler[]);
  }

  /**
   * Register a DELETE route
   * @param path - Route path pattern
   * @param handlers - Handler functions (can be RouteHandler or MiddlewareFunction)
   */
  delete(
    path: string,
    ...handlers: (RouteHandler | MiddlewareFunction)[]
  ): void {
    this.router.addRoute("DELETE", path, handlers as RouteHandler[]);
  }

  /**
   * Register a PATCH route
   * @param path - Route path pattern
   * @param handlers - Handler functions (can be RouteHandler or MiddlewareFunction)
   */
  patch(
    path: string,
    ...handlers: (RouteHandler | MiddlewareFunction)[]
  ): void {
    this.router.addRoute("PATCH", path, handlers as RouteHandler[]);
  }

  /**
   * Register global middleware
   * @param middleware - Middleware function with signature (req, res, next)
   */
  use(middleware: MiddlewareFunction): void {
    this.middleware.push(middleware);
  }

  /**
   * Create a route group with a common path prefix
   * @param prefix - Path prefix for all routes in the group
   * @param callback - Callback function that receives a scoped context
   */
  group(prefix: string, callback: (context: GroupContext) => void): void {
    // Create a scoped context that prepends prefix to all routes
    const groupContext = this._createGroupContext(prefix, []);

    // Execute the callback with the scoped context
    callback(groupContext);
  }

  /**
   * Create a group context with prefix and middleware stack
   * @param prefix - Path prefix to prepend to routes
   * @param parentMiddleware - Middleware from parent groups
   * @returns Scoped context object with route registration methods
   * @private
   */
  private _createGroupContext(
    prefix: string,
    parentMiddleware: MiddlewareFunction[]
  ): GroupContext {
    const self = this;

    // Normalize prefix (ensure it starts with / and doesn't end with /)
    const normalizedPrefix = prefix.startsWith("/") ? prefix : `/${prefix}`;
    const cleanPrefix =
      normalizedPrefix.endsWith("/") && normalizedPrefix.length > 1
        ? normalizedPrefix.slice(0, -1)
        : normalizedPrefix;

    // Group-specific middleware stack
    const groupMiddleware: MiddlewareFunction[] = [...parentMiddleware];

    return {
      /**
       * Register middleware for this group
       * @param middleware - Middleware function
       */
      use(middleware: MiddlewareFunction): void {
        groupMiddleware.push(middleware);
      },

      /**
       * Register a GET route in this group
       * @param path - Route path pattern
       * @param handlers - Handler functions (can be RouteHandler or MiddlewareFunction)
       */
      get(
        path: string,
        ...handlers: (RouteHandler | MiddlewareFunction)[]
      ): void {
        const fullPath = cleanPrefix + path;
        self.router.addRoute("GET", fullPath, handlers as RouteHandler[]);
        self._addGroupMiddlewareToRoute(groupMiddleware);
      },

      /**
       * Register a POST route in this group
       * @param path - Route path pattern
       * @param handlers - Handler functions (can be RouteHandler or MiddlewareFunction)
       */
      post(
        path: string,
        ...handlers: (RouteHandler | MiddlewareFunction)[]
      ): void {
        const fullPath = cleanPrefix + path;
        self.router.addRoute("POST", fullPath, handlers as RouteHandler[]);
        self._addGroupMiddlewareToRoute(groupMiddleware);
      },

      /**
       * Register a PUT route in this group
       * @param path - Route path pattern
       * @param handlers - Handler functions (can be RouteHandler or MiddlewareFunction)
       */
      put(
        path: string,
        ...handlers: (RouteHandler | MiddlewareFunction)[]
      ): void {
        const fullPath = cleanPrefix + path;
        self.router.addRoute("PUT", fullPath, handlers as RouteHandler[]);
        self._addGroupMiddlewareToRoute(groupMiddleware);
      },

      /**
       * Register a DELETE route in this group
       * @param path - Route path pattern
       * @param handlers - Handler functions (can be RouteHandler or MiddlewareFunction)
       */
      delete(
        path: string,
        ...handlers: (RouteHandler | MiddlewareFunction)[]
      ): void {
        const fullPath = cleanPrefix + path;
        self.router.addRoute("DELETE", fullPath, handlers as RouteHandler[]);
        self._addGroupMiddlewareToRoute(groupMiddleware);
      },

      /**
       * Register a PATCH route in this group
       * @param path - Route path pattern
       * @param handlers - Handler functions (can be RouteHandler or MiddlewareFunction)
       */
      patch(
        path: string,
        ...handlers: (RouteHandler | MiddlewareFunction)[]
      ): void {
        const fullPath = cleanPrefix + path;
        self.router.addRoute("PATCH", fullPath, handlers as RouteHandler[]);
        self._addGroupMiddlewareToRoute(groupMiddleware);
      },

      /**
       * Create a nested group within this group
       * @param nestedPrefix - Additional prefix for nested group
       * @param callback - Callback function for nested group
       */
      group(
        nestedPrefix: string,
        callback: (context: GroupContext) => void
      ): void {
        // Stack prefixes for nested groups
        const stackedPrefix = cleanPrefix + nestedPrefix;
        const nestedContext = self._createGroupContext(
          stackedPrefix,
          groupMiddleware
        );
        callback(nestedContext);
      },
    };
  }

  /**
   * Add group middleware to the most recently added route
   * @param middleware - Array of middleware functions
   * @private
   */
  private _addGroupMiddlewareToRoute(middleware: MiddlewareFunction[]): void {
    if (middleware.length > 0 && this.router.routes.length > 0) {
      const lastRoute = this.router.routes[this.router.routes.length - 1];
      lastRoute.middleware = [...middleware];
    }
  }

  /**
   * Execute middleware stack followed by final handler
   * @param req - Request wrapper object
   * @param res - Response wrapper object
   * @param middlewareStack - Array of middleware functions
   * @param finalHandler - Final handler to execute after middleware
   * @private
   */
  private async _executeMiddleware(
    req: Request,
    res: Response,
    middlewareStack: MiddlewareFunction[],
    finalHandler: () => Promise<void>
  ): Promise<void> {
    let index = 0;

    const next = async (error?: Error): Promise<void> => {
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
   * @param req - Node.js request object
   * @param res - Node.js response object
   * @private
   */
  private async _handleRequest(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
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
          error: "Not Found",
          message: `Cannot ${request.method} ${request.path}`,
          path: request.path,
          method: request.method,
        });
        return;
      }

      // Extract and assign route params to request object
      request.params = match.params;

      // Combine global middleware with route-specific middleware
      const middlewareStack = [...this.middleware, ...(match.middleware || [])];

      // Create final handler that executes all route handlers
      const finalHandler = async (): Promise<void> => {
        for (const handler of match.handlers) {
          if (response._sent) break;
          await handler(request, response);
        }
      };

      // Execute middleware chain followed by route handlers
      await this._executeMiddleware(
        request,
        response,
        middlewareStack,
        finalHandler
      );
    } catch (error) {
      // Log error details to console with stack trace
      console.error("Request handling error:");
      console.error((error as Error).stack || error);

      // Send 500 status code with error message in JSON format
      // Ensure error response is only sent if response hasn't been sent already
      if (!response._sent) {
        response.status(500).json({
          error: "Internal Server Error",
          message: (error as Error).message,
          path: request.path,
          method: request.method,
        });
      }
    }
  }

  /**
   * Start the HTTP server on the specified port
   * @param port - Port number to listen on
   * @param callback - Optional callback to execute after server starts
   * @returns The HTTP server instance
   */
  listen(port: number, callback?: () => void): Server {
    // Create HTTP server using Node.js http.createServer()
    const server = createServer((req, res) => {
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
