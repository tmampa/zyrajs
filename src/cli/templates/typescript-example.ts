import { TemplateConfig } from "./types";

/**
 * Example TypeScript template configuration with routes and middleware
 */
export const typescriptExampleTemplate: TemplateConfig = {
  type: "typescript",
  structure: "example",
  dependencies: {
    zyrajs: "^0.2.2",
  },
  devDependencies: {
    typescript: "^5.9.3",
    "@types/node": "^24.10.1",
  },
  scripts: {
    start: "node dist/index.js",
    dev: "tsc --watch",
    build: "tsc",
  },
  files: [
    {
      path: "src/index.ts",
      content: `// Import the Zyra framework and type definitions
import createApp from 'zyrajs';
import { Request, Response } from 'zyrajs';

// Import custom routes and middleware
import usersRouter from './routes/users';
import logger from './middleware/logger';

// Create a new Zyra application instance
const app = createApp();

// ============================================
// MIDDLEWARE
// ============================================
// Apply the logger middleware globally to all routes
// This will log every incoming request with timestamp, method, and path
// Middleware functions are executed in the order they are registered
app.use(logger);

// ============================================
// ROUTES
// ============================================
/**
 * Root endpoint - provides a welcome message and available endpoints
 * 
 * @route GET /
 * @param req - The request object with type safety
 * @param res - The response object with type safety
 */
app.get('/', (req: Request, res: Response) => {
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
// This allows for modular route organization and better code maintainability
app.use('/api/users', usersRouter);

// ============================================
// SERVER STARTUP
// ============================================
// Configure the server port (uses environment variable or defaults to 3000)
const PORT: number = parseInt(process.env.PORT || '3000', 10);

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
      path: "src/routes/users.ts",
      content: `// Import the Router and type definitions from Zyra
import { Router, Request, Response } from 'zyrajs';

// Create a new router instance for modular route handling
const router = Router();

// ============================================
// TYPE DEFINITIONS
// ============================================
/**
 * User interface - defines the structure of a user object
 * This provides type safety when working with user data
 */
interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

/**
 * Request body interface for creating a new user
 */
interface CreateUserBody {
  name?: string;
  email?: string;
}

// ============================================
// USER ROUTES
// ============================================

/**
 * GET /api/users
 * Retrieves a list of all users
 * 
 * In a real application, this would fetch users from a database
 * For this example, we return a mock array with type safety
 * 
 * @route GET /api/users
 * @param req - Typed request object
 * @param res - Typed response object
 */
router.get('/', (req: Request, res: Response) => {
  // Mock user data - replace with actual database query
  // TypeScript ensures the data matches the User interface
  const users: User[] = [
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
 * Route parameters are accessible via req.params with type safety
 * Example: GET /api/users/123 -> req.params.id = '123'
 * 
 * @route GET /api/users/:id
 * @param req - Typed request object with params
 * @param res - Typed response object
 */
router.get('/:id', (req: Request, res: Response) => {
  // Extract the user ID from the route parameters
  // TypeScript ensures type safety when accessing params
  const { id } = req.params;

  // Mock user lookup - replace with actual database query
  const user: User = {
    id: parseInt(id, 10),
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
 * Request body is accessible via req.body with type safety
 * Example body: { "name": "John Doe", "email": "john@example.com" }
 * 
 * @route POST /api/users
 * @param req - Typed request object with body
 * @param res - Typed response object
 */
router.post('/', (req: Request, res: Response) => {
  // Extract user data from the request body with type safety
  const { name, email } = (req.body || {}) as CreateUserBody;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required fields'
    });
  }

  // Mock user creation - replace with actual database insert
  const newUser: User = {
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
export default router;
`,
    },
    {
      path: "src/middleware/logger.ts",
      content: `// Import type definitions from Zyra for type safety
import { Request, Response } from 'zyrajs';

/**
 * Logger Middleware
 * 
 * This middleware logs information about each incoming HTTP request.
 * It demonstrates how to create custom middleware in Zyra with TypeScript.
 * 
 * Middleware functions have access to:
 * @param req - The request object containing information about the HTTP request
 * @param res - The response object used to send back the HTTP response
 * @param next - A function that passes control to the next middleware in the chain
 * 
 * Important: Always call next() to pass control to the next middleware,
 * otherwise the request will hang and never complete.
 * 
 * The explicit return type 'void' indicates this function doesn't return a value.
 */
function logger(req: Request, res: Response, next: () => void): void {
  // Get the current timestamp in ISO format
  const timestamp: string = new Date().toISOString();
  
  // Extract request information with type safety
  const method: string = req.method;      // HTTP method (GET, POST, etc.)
  const path: string = req.path;          // Request path (e.g., /api/users)
  const ip: string = req.ip || 'unknown'; // Client IP address
  
  // Log the request details to the console
  console.log(\`[\${timestamp}] \${method} \${path} - IP: \${ip}\`);
  
  // Call next() to pass control to the next middleware or route handler
  // Without this, the request will never reach its destination
  next();
}

// Export the logger middleware function as the default export
export default logger;
`,
    },
    {
      path: "tsconfig.json",
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
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

A Zyra application with TypeScript, example routes, and middleware.

## Installation

\`\`\`bash
npm install
\`\`\`

## Running the Application

### Development Mode

\`\`\`bash
npm run dev
\`\`\`

This will start TypeScript in watch mode. In another terminal, run:

\`\`\`bash
npm start
\`\`\`

### Production Mode

First build the project:

\`\`\`bash
npm run build
\`\`\`

Then start the server:

\`\`\`bash
npm start
\`\`\`

The server will start on http://localhost:3000

## Project Structure

\`\`\`
src/
├── index.ts           # Main application file
├── routes/
│   └── users.ts       # User routes (GET, POST)
└── middleware/
    └── logger.ts      # Request logging middleware
\`\`\`

## Available Routes

- \`GET /\` - Welcome message
- \`GET /api/users\` - Get all users
- \`GET /api/users/:id\` - Get user by ID
- \`POST /api/users\` - Create a new user
`,
    },
  ],
};
