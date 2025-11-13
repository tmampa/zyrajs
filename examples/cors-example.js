const createApp = require('../src/index');
const { cors } = require('../src/index');

// Create application instance
const app = createApp();

// ============================================
// CORS EXAMPLES
// ============================================

console.log('');
console.log('='.repeat(60));
console.log('CORS Middleware Examples');
console.log('='.repeat(60));
console.log('');
console.log('This example demonstrates various CORS configurations:');
console.log('  1. Basic usage with default options (allow all origins)');
console.log('  2. Specific origin configuration');
console.log('  3. Multiple origins configuration');
console.log('  4. Credentials support');
console.log('  5. Route-specific CORS configuration');
console.log('  6. Dynamic origin validation with function');
console.log('  7. Full configuration example');
console.log('');

// ============================================
// 1. BASIC USAGE - Allow All Origins (Default)
// ============================================

// Apply CORS globally with default settings
// This allows requests from any origin
app.use(cors());

app.get('/api/public', (req, res) => {
  res.json({
    message: 'This endpoint allows CORS from all origins',
    data: {
      timestamp: new Date().toISOString(),
      description: 'Public API endpoint with default CORS'
    }
  });
});

// ============================================
// 2. SPECIFIC ORIGIN CONFIGURATION
// ============================================

// Only allow requests from a specific origin
app.get('/api/specific-origin', cors({
  origin: 'https://example.com'
}), (req, res) => {
  res.json({
    message: 'This endpoint only allows requests from https://example.com',
    data: {
      allowedOrigin: 'https://example.com',
      description: 'Requests from other origins will be blocked'
    }
  });
});

// ============================================
// 3. MULTIPLE ORIGINS CONFIGURATION
// ============================================

// Allow requests from multiple specific origins
app.get('/api/multiple-origins', cors({
  origin: ['https://example.com', 'https://app.example.com', 'https://admin.example.com']
}), (req, res) => {
  res.json({
    message: 'This endpoint allows requests from multiple origins',
    data: {
      allowedOrigins: [
        'https://example.com',
        'https://app.example.com',
        'https://admin.example.com'
      ],
      description: 'Only these three origins are allowed'
    }
  });
});

// ============================================
// 4. CREDENTIALS SUPPORT
// ============================================

// Enable credentials (cookies, authorization headers)
// Note: When credentials are enabled, origin cannot be wildcard
app.get('/api/with-credentials', cors({
  origin: 'https://example.com',
  credentials: true
}), (req, res) => {
  res.json({
    message: 'This endpoint supports credentials',
    data: {
      allowedOrigin: 'https://example.com',
      credentials: true,
      description: 'Cookies and authorization headers are allowed'
    }
  });
});

// ============================================
// 5. ROUTE-SPECIFIC CORS CONFIGURATION
// ============================================

// Different CORS settings for different routes
app.group('/api/v1', (api) => {
  // Public endpoints - allow all origins
  api.get('/status', cors(), (req, res) => {
    res.json({
      status: 'operational',
      version: '1.0.0',
      cors: 'all origins allowed'
    });
  });
  
  // Protected endpoints - specific origin only
  api.post('/data', cors({
    origin: 'https://app.example.com',
    credentials: true,
    methods: ['POST', 'OPTIONS']
  }), (req, res) => {
    res.json({
      message: 'Data received',
      data: req.body,
      cors: 'restricted to app.example.com with credentials'
    });
  });
});

// ============================================
// 6. DYNAMIC ORIGIN VALIDATION (Function)
// ============================================

// Use a function to dynamically validate origins
// This example allows all subdomains of example.com
app.get('/api/dynamic-origin', cors({
  origin: (requestOrigin) => {
    // Allow all subdomains of example.com
    if (requestOrigin && requestOrigin.endsWith('.example.com')) {
      return true;
    }
    // Also allow the main domain
    if (requestOrigin === 'https://example.com') {
      return true;
    }
    // Block all other origins
    return false;
  }
}), (req, res) => {
  res.json({
    message: 'This endpoint uses dynamic origin validation',
    data: {
      description: 'Allows example.com and all *.example.com subdomains',
      yourOrigin: req.headers.origin || 'no origin header'
    }
  });
});

// ============================================
// 7. FULL CONFIGURATION EXAMPLE
// ============================================

// Comprehensive CORS configuration with all options
app.post('/api/full-config', cors({
  origin: ['https://example.com', 'https://app.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Number'],
  credentials: true,
  maxAge: 86400, // 24 hours in seconds
  optionsSuccessStatus: 204
}), (req, res) => {
  // Set custom headers that will be exposed to the client
  res.setHeader('X-Total-Count', '100');
  res.setHeader('X-Page-Number', '1');
  
  res.json({
    message: 'Full CORS configuration example',
    config: {
      allowedOrigins: ['https://example.com', 'https://app.example.com'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
      exposedHeaders: ['X-Total-Count', 'X-Page-Number'],
      credentials: true,
      preflightCacheDuration: '24 hours'
    },
    data: req.body
  });
});

// ============================================
// 8. PREFLIGHT REQUEST DEMONSTRATION
// ============================================

// This endpoint will automatically handle preflight OPTIONS requests
app.put('/api/preflight-demo', cors({
  origin: 'https://example.com',
  methods: ['PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600 // Cache preflight for 1 hour
}), (req, res) => {
  res.json({
    message: 'PUT request successful',
    data: {
      description: 'Preflight OPTIONS request was handled automatically',
      preflightCache: '1 hour',
      body: req.body
    }
  });
});

// ============================================
// 9. BLOCKING ORIGINS EXAMPLE
// ============================================

// Explicitly block all CORS requests
app.get('/api/no-cors', cors({
  origin: false
}), (req, res) => {
  res.json({
    message: 'This endpoint blocks all CORS requests',
    data: {
      description: 'Only same-origin requests are allowed'
    }
  });
});

// ============================================
// 10. MIXED CONFIGURATION EXAMPLE
// ============================================

// Some routes with CORS, some without
app.group('/api/mixed', (mixed) => {
  // This route has CORS enabled
  mixed.get('/public', cors(), (req, res) => {
    res.json({
      message: 'Public endpoint with CORS',
      cors: 'enabled'
    });
  });
  
  // This route has no CORS (same-origin only)
  mixed.get('/internal', (req, res) => {
    res.json({
      message: 'Internal endpoint without CORS',
      cors: 'disabled - same-origin only'
    });
  });
  
  // This route has restricted CORS
  mixed.post('/restricted', cors({
    origin: 'https://trusted.example.com',
    credentials: true
  }), (req, res) => {
    res.json({
      message: 'Restricted endpoint with specific CORS',
      cors: 'enabled for trusted.example.com only'
    });
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('CORS Example Server is running!');
  console.log('='.repeat(60));
  console.log('');
  console.log(`Server: http://localhost:${PORT}`);
  console.log('');
  console.log('Test CORS endpoints:');
  console.log('');
  console.log('  1. Basic CORS (allow all):');
  console.log(`     GET  http://localhost:${PORT}/api/public`);
  console.log('');
  console.log('  2. Specific origin:');
  console.log(`     GET  http://localhost:${PORT}/api/specific-origin`);
  console.log('     Origin: https://example.com');
  console.log('');
  console.log('  3. Multiple origins:');
  console.log(`     GET  http://localhost:${PORT}/api/multiple-origins`);
  console.log('     Origin: https://example.com or https://app.example.com');
  console.log('');
  console.log('  4. With credentials:');
  console.log(`     GET  http://localhost:${PORT}/api/with-credentials`);
  console.log('     Origin: https://example.com');
  console.log('     Credentials: include');
  console.log('');
  console.log('  5. Dynamic origin validation:');
  console.log(`     GET  http://localhost:${PORT}/api/dynamic-origin`);
  console.log('     Origin: https://subdomain.example.com');
  console.log('');
  console.log('  6. Full configuration:');
  console.log(`     POST http://localhost:${PORT}/api/full-config`);
  console.log('     Origin: https://example.com');
  console.log('     Headers: Content-Type, Authorization');
  console.log('     Body: {"test": "data"}');
  console.log('');
  console.log('  7. Preflight demonstration:');
  console.log(`     PUT  http://localhost:${PORT}/api/preflight-demo`);
  console.log('     Origin: https://example.com');
  console.log('     (Browser will send OPTIONS first)');
  console.log('');
  console.log('  8. No CORS (blocked):');
  console.log(`     GET  http://localhost:${PORT}/api/no-cors`);
  console.log('     (All cross-origin requests blocked)');
  console.log('');
  console.log('  9. Mixed configuration:');
  console.log(`     GET  http://localhost:${PORT}/api/mixed/public`);
  console.log(`     GET  http://localhost:${PORT}/api/mixed/internal`);
  console.log(`     POST http://localhost:${PORT}/api/mixed/restricted`);
  console.log('');
  console.log('='.repeat(60));
  console.log('');
  console.log('Testing Tips:');
  console.log('');
  console.log('  Using curl to test CORS:');
  console.log('');
  console.log('  # Test with origin header');
  console.log(`  curl -H "Origin: https://example.com" \\`);
  console.log(`       http://localhost:${PORT}/api/specific-origin`);
  console.log('');
  console.log('  # Test preflight request');
  console.log(`  curl -X OPTIONS \\`);
  console.log('       -H "Origin: https://example.com" \\');
  console.log('       -H "Access-Control-Request-Method: PUT" \\');
  console.log(`       http://localhost:${PORT}/api/preflight-demo`);
  console.log('');
  console.log('  # Test with credentials');
  console.log(`  curl -H "Origin: https://example.com" \\`);
  console.log('       -H "Cookie: session=abc123" \\');
  console.log(`       http://localhost:${PORT}/api/with-credentials`);
  console.log('');
  console.log('='.repeat(60));
});
