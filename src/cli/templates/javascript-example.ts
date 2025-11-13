import { TemplateConfig } from "./types";

/**
 * Example JavaScript template configuration with routes and middleware
 */
export const javascriptExampleTemplate: TemplateConfig = {
  type: "javascript",
  structure: "example",
  dependencies: {
    zyrajs: "^0.2.2",
  },
  devDependencies: {},
  scripts: {
    start: "node src/index.js",
    dev: "node --watch src/index.js",
  },
  files: [
    {
      path: "src/index.js",
      content: `// Import the Zyra framework
const createApp = require('zyrajs');

// Import custom routes and middleware
const usersRouter = require('./routes/users');
const logger = require('./middleware/logger');

// Create a new Zyra application instance
const app = createApp();

// ============================================
// MIDDLEWARE
// ============================================
// Apply the logger middleware globally to all routes
// This will log every incoming request with timestamp, method, and path
app.use(logger);

// ============================================
// ROUTES
// ============================================
// Define a basic route that responds to GET requests at the root path
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Zyra!',
    endpoints: {
      users: '/api/users',
      userById: '/api/users/:id'
    }
  });
});

// Mount the users router at /api/users
// All routes defined in the users router will be prefixed with /api/users
app.use('/api/users', usersRouter);

// ============================================
// SERVER STARTUP
// ============================================
// Configure the server port (uses environment variable or defaults to 3000)
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
  console.log(\`Try visiting:\`);
  console.log(\`  - http://localhost:\${PORT}/\`);
  console.log(\`  - http://localhost:\${PORT}/api/users\`);
  console.log(\`  - http://localhost:\${PORT}/api/users/123\`);
});
`,
    },
    {
      path: "src/routes/users.js",
      content: `// Import the Router from Zyra to create modular route handlers
const { Router } = require('zyrajs');

// Create a new router instance
const router = Router();

// ============================================
// USER ROUTES
// ============================================

/**
 * GET /api/users
 * Retrieves a list of all users
 * 
 * In a real application, this would fetch users from a database
 * For this example, we return a mock array
 */
router.get('/', (req, res) => {
  // Mock user data - replace with actual database query
  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' }
  ];

  res.json({ 
    success: true,
    count: users.length,
    users 
  });
});

/**
 * GET /api/users/:id
 * Retrieves a specific user by their ID
 * 
 * Route parameters are accessible via req.params
 * Example: GET /api/users/123 -> req.params.id = '123'
 */
router.get('/:id', (req, res) => {
  // Extract the user ID from the route parameters
  const { id } = req.params;

  // Mock user lookup - replace with actual database query
  const user = {
    id: parseInt(id),
    name: \`User \${id}\`,
    email: \`user\${id}@example.com\`,
    createdAt: new Date().toISOString()
  };

  res.json({ 
    success: true,
    user 
  });
});

/**
 * POST /api/users
 * Creates a new user
 * 
 * Request body is accessible via req.body
 * Example body: { "name": "John Doe", "email": "john@example.com" }
 */
router.post('/', (req, res) => {
  // Extract user data from the request body
  const { name, email } = req.body || {};

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required fields'
    });
  }

  // Mock user creation - replace with actual database insert
  const newUser = {
    id: Math.floor(Math.random() * 1000), // Generate random ID
    name,
    email,
    createdAt: new Date().toISOString()
  };

  // Return 201 Created status with the new user data
  res.status(201).json({ 
    success: true,
    message: 'User created successfully',
    user: newUser 
  });
});

// Export the router to be used in the main application
module.exports = router;
`,
    },
    {
      path: "src/middleware/logger.js",
      content: `/**
 * Logger Middleware
 * 
 * This middleware logs information about each incoming HTTP request.
 * It demonstrates how to create custom middleware in Zyra.
 * 
 * Middleware functions have access to:
 * - req: The request object containing information about the HTTP request
 * - res: The response object used to send back the HTTP response
 * - next: A function that passes control to the next middleware in the chain
 * 
 * Important: Always call next() to pass control to the next middleware,
 * otherwise the request will hang and never complete.
 */

function logger(req, res, next) {
  // Get the current timestamp in ISO format
  const timestamp = new Date().toISOString();
  
  // Extract request information
  const method = req.method;      // HTTP method (GET, POST, etc.)
  const path = req.path;          // Request path (e.g., /api/users)
  const ip = req.ip || 'unknown'; // Client IP address
  
  // Log the request details to the console
  console.log(\`[\${timestamp}] \${method} \${path} - IP: \${ip}\`);
  
  // Call next() to pass control to the next middleware or route handler
  // Without this, the request will never reach its destination
  next();
}

// Export the logger middleware function
module.exports = logger;
`,
    },
    {
      path: ".gitignore",
      content: `node_modules/
dist/
*.log
.env
.DS_Store
`,
    },
    {
      path: "README.md",
      content: `# Zyra Application

An example Zyra application with routes, middleware, and organized project structure.

## Installation

\`\`\`bash
npm install
\`\`\`

## Running the Application

### Development Mode

\`\`\`bash
npm run dev
\`\`\`

### Production Mode

\`\`\`bash
npm start
\`\`\`

The server will start on http://localhost:3000

## Project Structure

\`\`\`
src/
├── index.js              # Main application file with server setup
├── routes/
│   └── users.js         # User-related routes (GET, POST)
└── middleware/
    └── logger.js        # Request logging middleware
\`\`\`

## API Endpoints

### Get All Users
\`\`\`
GET /api/users
\`\`\`

### Get User by ID
\`\`\`
GET /api/users/:id
\`\`\`

### Create User
\`\`\`
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
\`\`\`

## Features

- **Modular Routes**: Routes are organized in separate files for better maintainability
- **Custom Middleware**: Demonstrates how to create and use middleware for cross-cutting concerns
- **Request Logging**: All requests are logged with timestamp, method, and path
- **RESTful API**: Example CRUD operations following REST conventions
- **Error Handling**: Basic validation and error responses
`,
    },
  ],
};
