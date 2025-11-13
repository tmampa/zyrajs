/**
 * ZyraJS - JavaScript Quick Start Example
 * 
 * This example demonstrates how to use ZyraJS in a pure JavaScript project.
 * No TypeScript or build tools required!
 */

// When using zyrajs from npm: const createApp = require('zyrajs');
// For this example, we use the local build:
const createApp = require('../dist/index.js');
const { cors } = require('../dist/index.js');

// Create a new application
const app = createApp();

// ============================================
// BASIC USAGE
// ============================================

// Simple GET route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to ZyraJS!',
    language: 'JavaScript',
    framework: 'zyrajs'
  });
});

// Route with parameters
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    userId: id,
    name: `User ${id}`,
    email: `user${id}@example.com`
  });
});

// Route with query parameters
app.get('/search', (req, res) => {
  const { q, limit = 10, page = 1 } = req.query;
  res.json({ 
    query: q,
    limit: parseInt(limit),
    page: parseInt(page),
    results: []
  });
});

// ============================================
// HTTP METHODS
// ============================================

// POST - Create resource
app.post('/users', (req, res) => {
  const { name, email } = req.body || {};
  
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'Validation Error',
      message: 'Name and email are required' 
    });
  }
  
  res.status(201).json({ 
    message: 'User created successfully',
    user: { 
      id: Date.now(),
      name, 
      email,
      createdAt: new Date().toISOString()
    }
  });
});

// PUT - Update resource
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body || {};
  
  res.json({ 
    message: 'User updated',
    user: { id, name, email }
  });
});

// PATCH - Partial update
app.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};
  
  res.json({ 
    message: 'User partially updated',
    userId: id,
    updates
  });
});

// DELETE - Remove resource
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    message: 'User deleted',
    deletedId: id 
  });
});

// ============================================
// MIDDLEWARE
// ============================================

// Global middleware - runs on every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// CORS middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

// Custom authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Authorization token required' 
    });
  }
  
  // Simulate token validation
  req.user = { id: 1, name: 'Authenticated User' };
  next();
};

// Protected route using middleware
app.get('/profile', authMiddleware, (req, res) => {
  res.json({ 
    message: 'User profile',
    user: req.user 
  });
});

// ============================================
// ROUTE GROUPING
// ============================================

// API v1 routes
app.group('/api/v1', (api) => {
  // Group middleware
  api.use((req, res, next) => {
    console.log('API v1 request');
    next();
  });
  
  api.get('/status', (req, res) => {
    res.json({ 
      status: 'operational',
      version: '1.0.0',
      uptime: process.uptime()
    });
  });
  
  api.get('/users', (req, res) => {
    res.json({ 
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]
    });
  });
  
  // Nested group
  api.group('/admin', (admin) => {
    admin.use(authMiddleware);
    
    admin.get('/dashboard', (req, res) => {
      res.json({ 
        message: 'Admin dashboard',
        user: req.user 
      });
    });
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// Route that demonstrates error handling
app.get('/error', (req, res) => {
  try {
    throw new Error('Something went wrong!');
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

// 404 handler (should be last)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found` 
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(60));
  console.log('🚀 ZyraJS JavaScript Server Started!');
  console.log('='.repeat(60));
  console.log('');
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('');
  console.log('  Basic Routes:');
  console.log(`    GET    http://localhost:${PORT}/`);
  console.log(`    GET    http://localhost:${PORT}/users/:id`);
  console.log(`    GET    http://localhost:${PORT}/search?q=test`);
  console.log('');
  console.log('  CRUD Operations:');
  console.log(`    POST   http://localhost:${PORT}/users`);
  console.log(`    PUT    http://localhost:${PORT}/users/:id`);
  console.log(`    PATCH  http://localhost:${PORT}/users/:id`);
  console.log(`    DELETE http://localhost:${PORT}/users/:id`);
  console.log('');
  console.log('  Protected Routes:');
  console.log(`    GET    http://localhost:${PORT}/profile (requires auth)`);
  console.log('');
  console.log('  API Routes:');
  console.log(`    GET    http://localhost:${PORT}/api/v1/status`);
  console.log(`    GET    http://localhost:${PORT}/api/v1/users`);
  console.log(`    GET    http://localhost:${PORT}/api/v1/admin/dashboard`);
  console.log('');
  console.log('='.repeat(60));
  console.log('');
});
