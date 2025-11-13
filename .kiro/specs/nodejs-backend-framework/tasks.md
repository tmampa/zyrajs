# Implementation Plan

- [x] 1. Set up project structure and package configuration

  - Create the directory structure: `src/`, `examples/`
  - Initialize `package.json` with project metadata, entry point, and npm package configuration
  - Set package name, version (0.1.0), main entry point (src/index.js), and Node.js version requirement
  - Add useful dependencies where appropriate (e.g., body-parser for JSON parsing, path-to-regexp for route matching)
  - Create `.npmignore` file to exclude unnecessary files from the package
  - Create `src/index.js` as the main export file
  - _Requirements: 1.1, 1.4, 1.5_

- [x] 2. Implement Response wrapper class

  - Create `src/response.js` with Response class
  - Implement `status(code)` method that sets status code and returns this for chaining
  - Implement `json(data)` method that serializes data to JSON and sends response
  - Implement `send(data)` method that sends text/HTML response
  - Implement `setHeader(key, value)` method for setting headers with chaining support
  - Implement `end()` method to close the response stream
  - Add `_sent` flag to track if response has been sent
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 3. Implement Request wrapper class

  - Create `src/request.js` with Request class
  - Parse and expose `method`, `url`, and `path` properties from Node.js request object
  - Implement query string parsing to extract and expose `query` object (can use Node.js built-in `url` module or `qs` library)
  - Expose `headers` from the Node.js request object
  - Implement `_parseBody()` async method to parse JSON request bodies (can use `body-parser` or similar library)
  - Add `params` property (initially empty object, populated by router)
  - Make `body` property available after parsing
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4. Implement Router class with route matching

  - Create `src/router.js` with Router class
  - Implement `addRoute(method, path, handlers)` to register routes
  - Implement `_pathToRegex(path)` to convert route patterns to regex (handle `:param` syntax, can use `path-to-regexp` library for robust pattern matching)
  - Implement `_extractParams(path, matches)` to extract parameter values from URL matches
  - Implement `match(method, path)` to find matching route and return route with extracted params
  - Store routes with structure: `{ method, path, regex, paramNames, handlers, middleware }`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Implement core Application class

  - Create `src/app.js` with App class
  - Implement constructor that initializes router and middleware arrays
  - Implement HTTP method handlers: `get()`, `post()`, `put()`, `delete()`, `patch()`
  - Each method handler should call router's `addRoute()` with appropriate method
  - Implement `use()` method to register global middleware
  - Store global middleware in an array
  - _Requirements: 1.1, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 6.1_

- [x] 6. Implement request handling pipeline

  - In App class, implement `_handleRequest(req, res)` method
  - Create Request and Response wrapper instances
  - Parse request body asynchronously
  - Implement route matching logic using router
  - Handle 404 case when no route matches
  - Extract and assign route params to request object
  - _Requirements: 3.2, 3.3, 7.5_

- [x] 7. Implement middleware execution system

  - In App class, implement `_executeMiddleware(req, res, middlewareStack, finalHandler)` method
  - Execute middleware functions in order with `next()` callback
  - Pass control to next middleware when `next()` is called
  - Stop execution if response is sent by middleware
  - Execute final handler after all middleware completes
  - Combine global middleware with route-specific middleware
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 8. Implement error handling

  - Wrap handler execution in try-catch block
  - Catch errors thrown by handlers and middleware
  - Log error details to console with stack trace
  - Send 500 status code with error message in JSON format
  - Ensure error response is only sent if response hasn't been sent already
  - Implement 404 error response for unmatched routes
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 9. Implement server lifecycle management

  - In App class, implement `listen(port, callback)` method
  - Create HTTP server using Node.js `http.createServer()`
  - Bind `_handleRequest` to server's request event
  - Start server on specified port
  - Log listening message to console when server starts
  - Execute optional callback after server starts
  - _Requirements: 1.2, 1.3_

- [x] 10. Implement route grouping functionality

  - In App class, implement `group(prefix, callback)` method
  - Create a scoped context that prepends prefix to all routes registered within callback
  - Support middleware registration within groups that applies only to group routes
  - Implement prefix stacking for nested groups
  - Ensure group middleware is added to route-specific middleware array
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 11. Create public API and exports

  - In `src/index.js`, import App class
  - Export factory function that creates and returns new App instance
  - Ensure factory function accepts optional configuration object
  - Add any necessary default configuration handling
  - _Requirements: 1.1, 1.4_

- [x] 12. Create example application

  - Create `examples/basic-server.js` demonstrating framework usage
  - Show route registration for different HTTP methods
  - Demonstrate route parameters usage
  - Show middleware usage (e.g., logging middleware)
  - Demonstrate route grouping
  - Include error handling examples
  - Add example of JSON request/response handling
  - _Requirements: All requirements demonstrated_

- [ ]\* 13. Write tests for core functionality
  - Create test file for Router class testing route matching and parameter extraction
  - Create test file for Request class testing query parsing and body parsing
  - Create test file for Response class testing JSON/text responses and status codes
  - Create integration tests for full request/response cycle
  - Test middleware execution order
  - Test error handling (404, 500, body parsing errors)
  - Test route grouping with prefixes and nested groups
  - _Requirements: All requirements_
