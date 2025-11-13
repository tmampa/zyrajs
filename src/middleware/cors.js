// CORS Middleware Implementation
// This file will contain the CORS middleware factory function and related utilities

// Default CORS configuration options
const DEFAULT_OPTIONS = {
  origin: true, // Allow all origins by default
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: undefined, // Reflect request headers by default
  exposedHeaders: undefined,
  credentials: false,
  maxAge: undefined,
  optionsSuccessStatus: 204
};

/**
 * Validates CORS configuration options
 * @param {Object} options - CORS configuration options to validate
 * @throws {TypeError} If configuration is invalid
 */
function validateOptions(options) {
  // Validate origin option
  if (options.origin !== undefined) {
    const isArray = Array.isArray(options.origin);
    const isString = typeof options.origin === 'string';
    const isBoolean = typeof options.origin === 'boolean';
    const isFunction = typeof options.origin === 'function';
    
    if (!isArray && !isString && !isBoolean && !isFunction) {
      throw new TypeError('origin must be a string, array, function, or boolean');
    }
  }
  
  // Validate maxAge option
  if (options.maxAge !== undefined && typeof options.maxAge !== 'number') {
    throw new TypeError('maxAge must be a number');
  }
}

/**
 * Determines if a request origin is allowed based on the configuration
 * @param {string} requestOrigin - The origin from the request header
 * @param {string|Array<string>|Function|boolean} configOrigin - The configured origin setting
 * @returns {boolean} True if the origin is allowed, false otherwise
 */
function isOriginAllowed(requestOrigin, configOrigin) {
  // Handle boolean origin
  if (typeof configOrigin === 'boolean') {
    return configOrigin; // true = allow all, false = block all
  }
  
  // Handle wildcard string
  if (configOrigin === '*') {
    return true;
  }
  
  // Handle string origin (exact match)
  if (typeof configOrigin === 'string') {
    return configOrigin === requestOrigin;
  }
  
  // Handle array origin (match any in list)
  if (Array.isArray(configOrigin)) {
    return configOrigin.includes(requestOrigin);
  }
  
  // Handle function origin (invoke with request origin)
  if (typeof configOrigin === 'function') {
    return configOrigin(requestOrigin);
  }
  
  // Default to false if no match
  return false;
}

/**
 * Sets the Access-Control-Allow-Origin header
 * @param {Object} res - Response object
 * @param {Object} req - Request object
 * @param {Object} options - CORS configuration options
 */
function setOriginHeader(res, req, options) {
  const requestOrigin = req.headers.origin;
  
  // Return early if no origin header present
  if (!requestOrigin) {
    return;
  }
  
  // Check if origin is allowed
  if (!isOriginAllowed(requestOrigin, options.origin)) {
    return; // Don't set CORS headers for disallowed origins
  }
  
  // If credentials are enabled, must use specific origin (not wildcard)
  if (options.credentials) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Vary', 'Origin');
  } else if (options.origin === true || options.origin === '*') {
    // Use wildcard for allow-all when credentials are not enabled
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    // Use specific origin for dynamic origins (array, function, specific string)
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Vary', 'Origin');
  }
}

/**
 * Sets the Access-Control-Allow-Methods header
 * @param {Object} res - Response object
 * @param {Object} options - CORS configuration options
 */
function setMethodsHeader(res, options) {
  // Use configured methods or default
  const methods = options.methods || DEFAULT_OPTIONS.methods;
  
  // Convert array to comma-separated string if needed
  const methodsString = Array.isArray(methods) ? methods.join(',') : methods;
  
  res.setHeader('Access-Control-Allow-Methods', methodsString);
}

/**
 * Sets the Access-Control-Allow-Headers header
 * @param {Object} res - Response object
 * @param {Object} req - Request object
 * @param {Object} options - CORS configuration options
 */
function setAllowedHeadersHeader(res, req, options) {
  let headers;
  
  if (options.allowedHeaders) {
    // Use configured allowedHeaders
    headers = Array.isArray(options.allowedHeaders) 
      ? options.allowedHeaders.join(',') 
      : options.allowedHeaders;
  } else {
    // Reflect headers from Access-Control-Request-Headers
    headers = req.headers['access-control-request-headers'];
  }
  
  // Set header if headers exist
  if (headers) {
    res.setHeader('Access-Control-Allow-Headers', headers);
  }
}

/**
 * Sets the Access-Control-Expose-Headers header
 * @param {Object} res - Response object
 * @param {Object} options - CORS configuration options
 */
function setExposedHeadersHeader(res, options) {
  // Check if exposedHeaders are configured
  if (options.exposedHeaders) {
    // Convert array to comma-separated string if needed
    const headers = Array.isArray(options.exposedHeaders)
      ? options.exposedHeaders.join(',')
      : options.exposedHeaders;
    
    res.setHeader('Access-Control-Expose-Headers', headers);
  }
}

/**
 * Sets the Access-Control-Allow-Credentials header
 * @param {Object} res - Response object
 * @param {Object} options - CORS configuration options
 */
function setCredentialsHeader(res, options) {
  // Check if credentials option is true
  if (options.credentials === true) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}

/**
 * Sets the Access-Control-Max-Age header
 * @param {Object} res - Response object
 * @param {Object} options - CORS configuration options
 */
function setMaxAgeHeader(res, options) {
  // Check if maxAge is configured
  if (options.maxAge !== undefined) {
    res.setHeader('Access-Control-Max-Age', String(options.maxAge));
  }
}

/**
 * Detects if a request is a CORS preflight request
 * @param {Object} req - Request object
 * @returns {boolean} True if the request is a preflight request
 */
function isPreflight(req) {
  // A preflight request is an OPTIONS request with Access-Control-Request-Method header
  return req.method === 'OPTIONS' && req.headers['access-control-request-method'];
}

/**
 * Handles a CORS preflight request
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Object} options - CORS configuration options
 */
function handlePreflight(req, res, options) {
  // Set all CORS headers for preflight response
  setOriginHeader(res, req, options);
  setMethodsHeader(res, options);
  setAllowedHeadersHeader(res, req, options);
  setCredentialsHeader(res, options);
  setMaxAgeHeader(res, options);
  
  // Set status to optionsSuccessStatus (default 204)
  res.statusCode = options.optionsSuccessStatus || 204;
  
  // End response without calling next()
  res.end();
}

/**
 * CORS middleware factory function
 * Creates a CORS middleware with the specified configuration
 * @param {Object} options - CORS configuration options
 * @returns {Function} Middleware function with signature (req, res, next)
 */
function cors(options = {}) {
  // Merge provided options with DEFAULT_OPTIONS
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  };
  
  // Validate merged options
  validateOptions(mergedOptions);
  
  // Return middleware function with signature (req, res, next)
  return function corsMiddleware(req, res, next) {
    // Check if request has origin header
    const requestOrigin = req.headers.origin;
    
    // If no origin, call next() and return (not a CORS request)
    if (!requestOrigin) {
      return next();
    }
    
    // Check if origin is allowed using isOriginAllowed
    if (!isOriginAllowed(requestOrigin, mergedOptions.origin)) {
      // If origin not allowed, call next() without setting headers
      return next();
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
module.exports = cors;
