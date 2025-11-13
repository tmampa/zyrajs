// CORS Middleware Implementation
// This file contains the CORS middleware factory function and related utilities

import type { IRequest } from "../types/request.js";
import type { IResponse } from "../types/response.js";
import type { MiddlewareFunction, NextFunction } from "../types/middleware.js";
import type { CorsOptions, CorsOrigin } from "../types/cors.js";

// Default CORS configuration options
const DEFAULT_OPTIONS: Required<CorsOptions> = {
  origin: true, // Allow all origins by default
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: undefined as any, // Reflect request headers by default
  exposedHeaders: undefined as any,
  credentials: false,
  maxAge: undefined as any,
  optionsSuccessStatus: 204,
};

/**
 * Validates CORS configuration options
 * @param {CorsOptions} options - CORS configuration options to validate
 * @throws {TypeError} If configuration is invalid
 */
function validateOptions(options: CorsOptions): void {
  // Validate origin option
  if (options.origin !== undefined) {
    const isArray = Array.isArray(options.origin);
    const isString = typeof options.origin === "string";
    const isBoolean = typeof options.origin === "boolean";
    const isFunction = typeof options.origin === "function";

    if (!isArray && !isString && !isBoolean && !isFunction) {
      throw new TypeError(
        "origin must be a string, array, function, or boolean"
      );
    }
  }

  // Validate maxAge option
  if (options.maxAge !== undefined && typeof options.maxAge !== "number") {
    throw new TypeError("maxAge must be a number");
  }
}

/**
 * Determines if a request origin is allowed based on the configuration
 * @param {string} requestOrigin - The origin from the request header
 * @param {CorsOrigin} configOrigin - The configured origin setting
 * @returns {boolean} True if the origin is allowed, false otherwise
 */
function isOriginAllowed(
  requestOrigin: string,
  configOrigin: CorsOrigin
): boolean {
  // Handle boolean origin
  if (typeof configOrigin === "boolean") {
    return configOrigin; // true = allow all, false = block all
  }

  // Handle wildcard string
  if (configOrigin === "*") {
    return true;
  }

  // Handle string origin (exact match)
  if (typeof configOrigin === "string") {
    return configOrigin === requestOrigin;
  }

  // Handle array origin (match any in list)
  if (Array.isArray(configOrigin)) {
    return configOrigin.includes(requestOrigin);
  }

  // Handle function origin (invoke with request origin)
  if (typeof configOrigin === "function") {
    return configOrigin(requestOrigin);
  }

  // Default to false if no match
  return false;
}

/**
 * Sets the Access-Control-Allow-Origin header
 * @param {IResponse} res - Response object
 * @param {IRequest} req - Request object
 * @param {CorsOptions} options - CORS configuration options
 */
function setOriginHeader(
  res: IResponse,
  req: IRequest,
  options: CorsOptions
): void {
  const requestOrigin = req.headers.origin;

  // Return early if no origin header present
  if (!requestOrigin) {
    return;
  }

  // Check if origin is allowed
  if (!isOriginAllowed(requestOrigin, options.origin!)) {
    return; // Don't set CORS headers for disallowed origins
  }

  // If credentials are enabled, must use specific origin (not wildcard)
  if (options.credentials) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Vary", "Origin");
  } else if (options.origin === true || options.origin === "*") {
    // Use wildcard for allow-all when credentials are not enabled
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else {
    // Use specific origin for dynamic origins (array, function, specific string)
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Vary", "Origin");
  }
}

/**
 * Sets the Access-Control-Allow-Methods header
 * @param {IResponse} res - Response object
 * @param {CorsOptions} options - CORS configuration options
 */
function setMethodsHeader(res: IResponse, options: CorsOptions): void {
  // Use configured methods or default
  const methods = options.methods || DEFAULT_OPTIONS.methods;

  // Convert array to comma-separated string if needed
  const methodsString = Array.isArray(methods) ? methods.join(",") : methods;

  res.setHeader("Access-Control-Allow-Methods", methodsString);
}

/**
 * Sets the Access-Control-Allow-Headers header
 * @param {IResponse} res - Response object
 * @param {IRequest} req - Request object
 * @param {CorsOptions} options - CORS configuration options
 */
function setAllowedHeadersHeader(
  res: IResponse,
  req: IRequest,
  options: CorsOptions
): void {
  let headers: string | undefined;

  if (options.allowedHeaders) {
    // Use configured allowedHeaders
    headers = Array.isArray(options.allowedHeaders)
      ? options.allowedHeaders.join(",")
      : options.allowedHeaders;
  } else {
    // Reflect headers from Access-Control-Request-Headers
    const requestHeaders = req.headers["access-control-request-headers"];
    headers = typeof requestHeaders === "string" ? requestHeaders : undefined;
  }

  // Set header if headers exist
  if (headers) {
    res.setHeader("Access-Control-Allow-Headers", headers);
  }
}

/**
 * Sets the Access-Control-Expose-Headers header
 * @param {IResponse} res - Response object
 * @param {CorsOptions} options - CORS configuration options
 */
function setExposedHeadersHeader(res: IResponse, options: CorsOptions): void {
  // Check if exposedHeaders are configured
  if (options.exposedHeaders) {
    // Convert array to comma-separated string if needed
    const headers = Array.isArray(options.exposedHeaders)
      ? options.exposedHeaders.join(",")
      : options.exposedHeaders;

    res.setHeader("Access-Control-Expose-Headers", headers);
  }
}

/**
 * Sets the Access-Control-Allow-Credentials header
 * @param {IResponse} res - Response object
 * @param {CorsOptions} options - CORS configuration options
 */
function setCredentialsHeader(res: IResponse, options: CorsOptions): void {
  // Check if credentials option is true
  if (options.credentials === true) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
}

/**
 * Sets the Access-Control-Max-Age header
 * @param {IResponse} res - Response object
 * @param {CorsOptions} options - CORS configuration options
 */
function setMaxAgeHeader(res: IResponse, options: CorsOptions): void {
  // Check if maxAge is configured
  if (options.maxAge !== undefined) {
    res.setHeader("Access-Control-Max-Age", String(options.maxAge));
  }
}

/**
 * Detects if a request is a CORS preflight request
 * @param {IRequest} req - Request object
 * @returns {boolean} True if the request is a preflight request
 */
function isPreflight(req: IRequest): boolean {
  // A preflight request is an OPTIONS request with Access-Control-Request-Method header
  return (
    req.method === "OPTIONS" && !!req.headers["access-control-request-method"]
  );
}

/**
 * Handles a CORS preflight request
 * @param {IRequest} req - Request object
 * @param {IResponse} res - Response object
 * @param {CorsOptions} options - CORS configuration options
 */
function handlePreflight(
  req: IRequest,
  res: IResponse,
  options: CorsOptions
): void {
  // Set all CORS headers for preflight response
  setOriginHeader(res, req, options);
  setMethodsHeader(res, options);
  setAllowedHeadersHeader(res, req, options);
  setCredentialsHeader(res, options);
  setMaxAgeHeader(res, options);

  // Set status to optionsSuccessStatus (default 204)
  res.status(options.optionsSuccessStatus || 204);

  // End response without calling next()
  res.end();
}

/**
 * CORS middleware factory function
 * Creates a CORS middleware with the specified configuration
 * @param {CorsOptions} options - CORS configuration options
 * @returns {MiddlewareFunction} Middleware function with signature (req, res, next)
 */
function cors(options: CorsOptions = {}): MiddlewareFunction {
  // Merge provided options with DEFAULT_OPTIONS
  const mergedOptions: CorsOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  // Validate merged options
  validateOptions(mergedOptions);

  // Return middleware function with signature (req, res, next)
  return function corsMiddleware(
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ): void | Promise<void> {
    // Check if request has origin header
    const requestOrigin = req.headers.origin;

    // If no origin, call next() and return (not a CORS request)
    if (!requestOrigin) {
      next();
      return;
    }

    // Check if origin is allowed using isOriginAllowed
    if (!isOriginAllowed(requestOrigin, mergedOptions.origin!)) {
      // If origin not allowed, call next() without setting headers
      next();
      return;
    }

    // Detect if request is preflight using isPreflight
    if (isPreflight(req)) {
      // If preflight, call handlePreflight and return
      return handlePreflight(req, res, mergedOptions);
    }

    // For non-preflight requests, set origin, credentials, and exposed headers
    setOriginHeader(res, req, mergedOptions);
    setCredentialsHeader(res, mergedOptions);
    setExposedHeadersHeader(res, mergedOptions);

    // Call next() to continue middleware chain
    next();
  };
}

// Export the CORS factory function
export default cors;
