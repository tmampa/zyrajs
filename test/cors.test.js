// CORS Middleware Tests
const cors = require('../src/middleware/cors');

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    testsPassed++;
    console.log(`✓ ${message}`);
  } else {
    testsFailed++;
    console.error(`✗ ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    testsPassed++;
    console.log(`✓ ${message}`);
  } else {
    testsFailed++;
    console.error(`✗ ${message}`);
    console.error(`  Expected: ${expected}`);
    console.error(`  Actual: ${actual}`);
  }
}

// Mock request and response objects
function createMockRequest(options = {}) {
  return {
    method: options.method || 'GET',
    headers: options.headers || {}
  };
}

function createMockResponse() {
  const headers = {};
  return {
    statusCode: 200,
    headers,
    setHeader(name, value) {
      headers[name] = value;
    },
    getHeader(name) {
      return headers[name];
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    end() {
      this.ended = true;
    },
    ended: false
  };
}

// Test suite
console.log('\n=== CORS Middleware Tests ===\n');

// Test 1: Origin validation - string origin (exact match)
console.log('--- Test 1: String origin validation ---');
{
  const middleware = cors({ origin: 'https://example.com' });
  const req = createMockRequest({
    headers: { origin: 'https://example.com' }
  });
  const res = createMockResponse();
  let nextCalled = false;
  
  middleware(req, res, () => { nextCalled = true; });
  
  assertEqual(res.getHeader('Access-Control-Allow-Origin'), 'https://example.com', 'Should set origin header for matching origin');
  assert(nextCalled, 'Should call next() for allowed origin');
}

// Test 2: Origin validation - string origin (no match)
console.log('\n--- Test 2: String origin validation (blocked) ---');
{
  const middleware = cors({ origin: 'https://example.com' });
  const req = createMockRequest({
    headers: { origin: 'https://evil.com' }
  });
  const res = createMockResponse();
  let nextCalled = false;
  
  middleware(req, res, () => { nextCalled = true; });
  
  assertEqual(res.getHeader('Access-Control-Allow-Origin'), undefined, 'Should not set origin header for non-matching origin');
  assert(nextCalled, 'Should call next() even for blocked origin');
}

// Test 3: Origin validation - array of origins
console.log('\n--- Test 3: Array origin validation ---');
{
  const middleware = cors({ origin: ['https://example.com', 'https://app.example.com'] });
  const req = createMockRequest({
    headers: { origin: 'https://app.example.com' }
  });
  const res = createMockResponse();
  let nextCalled = false;
  
  middleware(req, res, () => { nextCalled = true; });
  
  assertEqual(res.getHeader('Access-Control-Allow-Origin'), 'https://app.example.com', 'Should set origin header for origin in array');
  assert(nextCalled, 'Should call next() for allowed origin');
}

// Test 4: Origin validation - function
console.log('\n--- Test 4: Function origin validation ---');
{
  const middleware = cors({ 
    origin: (origin) => origin && origin.endsWith('.example.com')
  });
  const req = createMockRequest({
    headers: { origin: 'https://subdomain.example.com' }
  });
  const res = createMockResponse();
  let nextCalled = false;
  
  middleware(req, res, () => { nextCalled = true; });
  
  assertEqual(res.getHeader('Access-Control-Allow-Origin'), 'https://subdomain.example.com', 'Should set origin header when function returns true');
  assert(nextCalled, 'Should call next() for allowed origin');
}

// Test 5: Origin validation - boolean true (allow all)
console.log('\n--- Test 5: Boolean origin validation (allow all) ---');
{
  const middleware = cors({ origin: true });
  const req = createMockRequest({
    headers: { origin: 'https://any-origin.com' }
  });
  const res = createMockResponse();
  let nextCalled = false;
  
  middleware(req, res, () => { nextCalled = true; });
  
  assertEqual(res.getHeader('Access-Control-Allow-Origin'), '*', 'Should set wildcard origin for origin: true');
  assert(nextCalled, 'Should call next() for allowed origin');
}

// Test 6: Origin validation - boolean false (block all)
console.log('\n--- Test 6: Boolean origin validation (block all) ---');
{
  const middleware = cors({ origin: false });
  const req = createMockRequest({
    headers: { origin: 'https://any-origin.com' }
  });
  const res = createMockResponse();
  let nextCalled = false;
  
  middleware(req, res, () => { nextCalled = true; });
  
  assertEqual(res.getHeader('Access-Control-Allow-Origin'), undefined, 'Should not set origin header for origin: false');
  assert(nextCalled, 'Should call next() even for blocked origin');
}

// Test 7: Preflight detection and handling
console.log('\n--- Test 7: Preflight request handling ---');
{
  const middleware = cors({ origin: 'https://example.com' });
  const req = createMockRequest({
    method: 'OPTIONS',
    headers: {
      origin: 'https://example.com',
      'access-control-request-method': 'POST'
    }
  });
  const res = createMockResponse();
  let nextCalled = false;
  
  middleware(req, res, () => { nextCalled = true; });
  
  assertEqual(res.getHeader('Access-Control-Allow-Origin'), 'https://example.com', 'Should set origin header for preflight');
  assert(res.getHeader('Access-Control-Allow-Methods'), 'Should set methods header for preflight');
  assertEqual(res.statusCode, 204, 'Should set status to 204 for preflight');
  assert(res.ended, 'Should end response for preflight');
  assert(!nextCalled, 'Should not call next() for preflight');
}

// Test 8: Simple request flow
console.log('\n--- Test 8: Simple request flow ---');
{
  const middleware = cors({ origin: 'https://example.com' });
  const req = createMockRequest({
    method: 'GET',
    headers: { origin: 'https://example.com' }
  });
  const res = createMockResponse();
  let nextCalled = false;
  
  middleware(req, res, () => { nextCalled = true; });
  
  assertEqual(res.getHeader('Access-Control-Allow-Origin'), 'https://example.com', 'Should set origin header for simple request');
  assert(nextCalled, 'Should call next() for simple request');
  assert(!res.ended, 'Should not end response for simple request');
}

// Test 9: Credentials with specific origin
console.log('\n--- Test 9: Credentials with specific origin ---');
{
  const middleware = cors({ 
    origin: 'https://example.com',
    credentials: true 
  });
  const req = createMockRequest({
    headers: { origin: 'https://example.com' }
  });
  const res = createMockResponse();
  let nextCalled = false;
  
  middleware(req, res, () => { nextCalled = true; });
  
  assertEqual(res.getHeader('Access-Control-Allow-Origin'), 'https://example.com', 'Should set specific origin with credentials');
  assertEqual(res.getHeader('Access-Control-Allow-Credentials'), 'true', 'Should set credentials header');
  assertEqual(res.getHeader('Vary'), 'Origin', 'Should set Vary header with credentials');
  assert(nextCalled, 'Should call next()');
}

// Test 10: Credentials prevents wildcard
console.log('\n--- Test 10: Credentials prevents wildcard ---');
{
  const middleware = cors({ 
    origin: true,
    credentials: true 
  });
  const req = createMockRequest({
    headers: { origin: 'https://example.com' }
  });
  const res = createMockResponse();
  let nextCalled = false;
  
  middleware(req, res, () => { nextCalled = true; });
  
  assertEqual(res.getHeader('Access-Control-Allow-Origin'), 'https://example.com', 'Should use specific origin instead of wildcard with credentials');
  assertEqual(res.getHeader('Access-Control-Allow-Credentials'), 'true', 'Should set credentials header');
  assert(nextCalled, 'Should call next()');
}

// Test 11: Requests without origin header pass through
console.log('\n--- Test 11: Requests without origin header ---');
{
  const middleware = cors({ origin: 'https://example.com' });
  const req = createMockRequest({
    headers: {} // No origin header
  });
  const res = createMockResponse();
  let nextCalled = false;
  
  middleware(req, res, () => { nextCalled = true; });
  
  assertEqual(res.getHeader('Access-Control-Allow-Origin'), undefined, 'Should not set CORS headers without origin');
  assert(nextCalled, 'Should call next() for non-CORS request');
}

// Test 12: Methods header setting
console.log('\n--- Test 12: Methods header setting ---');
{
  const middleware = cors({ 
    origin: 'https://example.com',
    methods: ['GET', 'POST', 'DELETE']
  });
  const req = createMockRequest({
    method: 'OPTIONS',
    headers: {
      origin: 'https://example.com',
      'access-control-request-method': 'POST'
    }
  });
  const res = createMockResponse();
  
  middleware(req, res, () => {});
  
  assertEqual(res.getHeader('Access-Control-Allow-Methods'), 'GET,POST,DELETE', 'Should set custom methods header');
}

// Test 13: Allowed headers - custom
console.log('\n--- Test 13: Custom allowed headers ---');
{
  const middleware = cors({ 
    origin: 'https://example.com',
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  const req = createMockRequest({
    method: 'OPTIONS',
    headers: {
      origin: 'https://example.com',
      'access-control-request-method': 'POST'
    }
  });
  const res = createMockResponse();
  
  middleware(req, res, () => {});
  
  assertEqual(res.getHeader('Access-Control-Allow-Headers'), 'Content-Type,Authorization', 'Should set custom allowed headers');
}

// Test 14: Allowed headers - reflect request headers
console.log('\n--- Test 14: Reflect request headers ---');
{
  const middleware = cors({ origin: 'https://example.com' });
  const req = createMockRequest({
    method: 'OPTIONS',
    headers: {
      origin: 'https://example.com',
      'access-control-request-method': 'POST',
      'access-control-request-headers': 'x-custom-header,content-type'
    }
  });
  const res = createMockResponse();
  
  middleware(req, res, () => {});
  
  assertEqual(res.getHeader('Access-Control-Allow-Headers'), 'x-custom-header,content-type', 'Should reflect requested headers');
}

// Test 15: Exposed headers
console.log('\n--- Test 15: Exposed headers ---');
{
  const middleware = cors({ 
    origin: 'https://example.com',
    exposedHeaders: ['X-Total-Count', 'X-Page-Number']
  });
  const req = createMockRequest({
    headers: { origin: 'https://example.com' }
  });
  const res = createMockResponse();
  
  middleware(req, res, () => {});
  
  assertEqual(res.getHeader('Access-Control-Expose-Headers'), 'X-Total-Count,X-Page-Number', 'Should set exposed headers');
}

// Test 16: Max age header
console.log('\n--- Test 16: Max age header ---');
{
  const middleware = cors({ 
    origin: 'https://example.com',
    maxAge: 86400
  });
  const req = createMockRequest({
    method: 'OPTIONS',
    headers: {
      origin: 'https://example.com',
      'access-control-request-method': 'POST'
    }
  });
  const res = createMockResponse();
  
  middleware(req, res, () => {});
  
  assertEqual(res.getHeader('Access-Control-Max-Age'), '86400', 'Should set max age header');
}

// Test 17: Default configuration
console.log('\n--- Test 17: Default configuration ---');
{
  const middleware = cors();
  const req = createMockRequest({
    headers: { origin: 'https://any-origin.com' }
  });
  const res = createMockResponse();
  let nextCalled = false;
  
  middleware(req, res, () => { nextCalled = true; });
  
  assertEqual(res.getHeader('Access-Control-Allow-Origin'), '*', 'Should allow all origins by default');
  assert(nextCalled, 'Should call next()');
}

// Test 18: Invalid configuration - invalid origin type
console.log('\n--- Test 18: Invalid configuration validation ---');
{
  try {
    const middleware = cors({ origin: 123 });
    testsFailed++;
    console.error('✗ Should throw TypeError for invalid origin type');
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('origin must be')) {
      testsPassed++;
      console.log('✓ Should throw TypeError for invalid origin type');
    } else {
      testsFailed++;
      console.error('✗ Should throw TypeError for invalid origin type');
    }
  }
}

// Test 19: Invalid configuration - invalid maxAge type
console.log('\n--- Test 19: Invalid maxAge validation ---');
{
  try {
    const middleware = cors({ maxAge: 'invalid' });
    testsFailed++;
    console.error('✗ Should throw TypeError for invalid maxAge type');
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('maxAge must be')) {
      testsPassed++;
      console.log('✓ Should throw TypeError for invalid maxAge type');
    } else {
      testsFailed++;
      console.error('✗ Should throw TypeError for invalid maxAge type');
    }
  }
}

// Test 20: Vary header with dynamic origins
console.log('\n--- Test 20: Vary header with dynamic origins ---');
{
  const middleware = cors({ 
    origin: ['https://example.com', 'https://app.example.com']
  });
  const req = createMockRequest({
    headers: { origin: 'https://example.com' }
  });
  const res = createMockResponse();
  
  middleware(req, res, () => {});
  
  assertEqual(res.getHeader('Vary'), 'Origin', 'Should set Vary header for dynamic origins');
}

// Summary
console.log('\n=== Test Summary ===');
console.log(`Total tests: ${testsPassed + testsFailed}`);
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);

if (testsFailed === 0) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log('\n✗ Some tests failed');
  process.exit(1);
}
