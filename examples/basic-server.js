// When using zyrajs from npm: const createApp = require('zyrajs');
// For this example, we use the local build:
const createApp = require('../dist/index.js');

// Create application instance
const app = createApp();

// ============================================
// MIDDLEWARE EXAMPLES
// ============================================

// Global logging middleware - runs on every request
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Global request timing middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// ============================================
// BASIC ROUTE EXAMPLES
// ============================================

// Simple GET route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Zyra!',
    description: 'A lightweight Node.js backend framework',
    endpoints: {
      users: '/users',
      posts: '/posts',
      api: '/api'
    }
  });
});

// GET route with query parameters
app.get('/search', (req, res) => {
  const { q, limit = 10 } = req.query;
  
  res.json({
    query: q,
    limit: parseInt(limit),
    results: [
      { id: 1, title: `Result for "${q}"` },
      { id: 2, title: `Another result for "${q}"` }
    ]
  });
});

// ============================================
// ROUTE PARAMETERS EXAMPLES
// ============================================

// GET route with single parameter
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  
  res.json({
    user: {
      id: id,
      name: `User ${id}`,
      email: `user${id}@example.com`
    }
  });
});

// GET route with multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  
  res.json({
    post: {
      id: postId,
      title: `Post ${postId}`,
      authorId: userId,
      content: 'This is a sample post'
    }
  });
});

// ============================================
// JSON REQUEST/RESPONSE EXAMPLES
// ============================================

// POST route with JSON body
app.post('/users', (req, res) => {
  const { name, email } = req.body || {};
  
  if (!name || !email) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name and email are required'
    });
  }
  
  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: Math.floor(Math.random() * 1000),
      name,
      email,
      createdAt: new Date().toISOString()
    }
  });
});

// PUT route for updating resources
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body || {};
  
  res.json({
    message: 'User updated successfully',
    user: {
      id,
      name: name || `User ${id}`,
      email: email || `user${id}@example.com`,
      updatedAt: new Date().toISOString()
    }
  });
});

// DELETE route
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  
  res.json({
    message: 'User deleted successfully',
    deletedId: id
  });
});

// PATCH route for partial updates
app.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};
  
  res.json({
    message: 'User partially updated',
    userId: id,
    updates: updates
  });
});

// ============================================
// ERROR HANDLING EXAMPLES
// ============================================

// Route that throws an error (demonstrates automatic error handling)
app.get('/error', (req, res) => {
  throw new Error('This is a simulated error!');
});

// Route that handles errors gracefully
app.get('/safe-error', (req, res) => {
  try {
    // Simulate some operation that might fail
    const data = JSON.parse('invalid json');
    res.json({ data });
  } catch (error) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Failed to process request',
      details: error.message
    });
  }
});

// ============================================
// ROUTE GROUPING EXAMPLES
// ============================================

// API v1 group with authentication middleware
app.group('/api/v1', (api) => {
  // Group-specific middleware (simulated auth check)
  api.use((req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authorization header required'
      });
    }
    
    // Simulate token validation
    req.user = { id: 1, name: 'Authenticated User' };
    next();
  });
  
  // Routes within the group
  api.get('/profile', (req, res) => {
    res.json({
      message: 'User profile',
      user: req.user
    });
  });
  
  api.get('/dashboard', (req, res) => {
    res.json({
      message: 'Dashboard data',
      user: req.user,
      stats: {
        posts: 42,
        followers: 128,
        following: 95
      }
    });
  });
  
  // Nested group for admin routes
  api.group('/admin', (admin) => {
    // Additional admin-specific middleware
    admin.use((req, res, next) => {
      // Simulate admin check
      if (req.user.id !== 1) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Admin access required'
        });
      }
      next();
    });
    
    admin.get('/users', (req, res) => {
      res.json({
        message: 'All users (admin only)',
        users: [
          { id: 1, name: 'Admin User', role: 'admin' },
          { id: 2, name: 'Regular User', role: 'user' }
        ]
      });
    });
    
    admin.delete('/users/:id', (req, res) => {
      const { id } = req.params;
      res.json({
        message: 'User deleted by admin',
        deletedId: id,
        deletedBy: req.user.name
      });
    });
  });
});

// Public API group (no authentication)
app.group('/api/public', (publicApi) => {
  publicApi.get('/status', (req, res) => {
    res.json({
      status: 'operational',
      version: '1.0.0',
      uptime: process.uptime()
    });
  });
  
  publicApi.get('/health', (req, res) => {
    res.json({
      healthy: true,
      timestamp: new Date().toISOString()
    });
  });
});

// ============================================
// RESPONSE CHAINING EXAMPLE
// ============================================

app.get('/chaining', (req, res) => {
  res
    .status(200)
    .setHeader('X-Custom-Header', 'CustomValue')
    .setHeader('X-Powered-By', 'Zyra')
    .json({
      message: 'This response demonstrates method chaining',
      headers: {
        'X-Custom-Header': 'CustomValue',
        'X-Powered-By': 'Zyra'
      }
    });
});

// ============================================
// TEXT RESPONSE EXAMPLE
// ============================================

app.get('/text', (req, res) => {
  res.send('<h1>Hello World!</h1><p>This is an HTML response.</p>');
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50));
  console.log('Example server is running!');
  console.log('='.repeat(50));
  console.log('');
  console.log('Try these endpoints:');
  console.log('');
  console.log('  Basic routes:');
  console.log(`    GET  http://localhost:${PORT}/`);
  console.log(`    GET  http://localhost:${PORT}/search?q=test&limit=5`);
  console.log(`    GET  http://localhost:${PORT}/text`);
  console.log('');
  console.log('  Route parameters:');
  console.log(`    GET  http://localhost:${PORT}/users/123`);
  console.log(`    GET  http://localhost:${PORT}/users/1/posts/42`);
  console.log('');
  console.log('  JSON requests (use curl or Postman):');
  console.log(`    POST http://localhost:${PORT}/users`);
  console.log('         Body: {"name": "John", "email": "john@example.com"}');
  console.log(`    PUT  http://localhost:${PORT}/users/123`);
  console.log('         Body: {"name": "Jane", "email": "jane@example.com"}');
  console.log('');
  console.log('  Error handling:');
  console.log(`    GET  http://localhost:${PORT}/error`);
  console.log(`    GET  http://localhost:${PORT}/safe-error`);
  console.log(`    GET  http://localhost:${PORT}/nonexistent (404)`);
  console.log('');
  console.log('  Route groups:');
  console.log(`    GET  http://localhost:${PORT}/api/public/status`);
  console.log(`    GET  http://localhost:${PORT}/api/v1/profile`);
  console.log('         Header: Authorization: Bearer token123');
  console.log(`    GET  http://localhost:${PORT}/api/v1/admin/users`);
  console.log('         Header: Authorization: Bearer token123');
  console.log('');
  console.log('  Response chaining:');
  console.log(`    GET  http://localhost:${PORT}/chaining`);
  console.log('');
  console.log('='.repeat(50));
});
