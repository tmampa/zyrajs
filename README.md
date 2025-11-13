# Zyra

A lightweight Node.js backend framework for building RESTful APIs with simplicity and elegance.

## Features

- 🚀 **Lightweight** - Minimal dependencies, maximum performance
- 🛣️ **Flexible Routing** - Support for route parameters and multiple HTTP methods
- 🔧 **Middleware Support** - Global and route-specific middleware
- 📦 **Route Grouping** - Organize routes with prefixes and nested groups
- 🎯 **Simple API** - Intuitive and easy to learn
- ⚡ **Fast** - Built on Node.js native HTTP module
- 📘 **TypeScript Support** - Full type definitions and IntelliSense support

## Installation

### Quick Start with CLI (Recommended)

The fastest way to get started is using the `create-zyra-app` CLI tool:

```bash
npx create-zyra-app my-app
```

This will:

- ✅ Create a new project with your chosen template (JavaScript or TypeScript)
- ✅ Set up the project structure (minimal or with examples)
- ✅ Configure all necessary dependencies
- ✅ Provide clear next steps to get you started

#### CLI Options

```bash
# Create with interactive prompts
npx create-zyra-app my-app

# Specify template directly
npx create-zyra-app my-app --template typescript
npx create-zyra-app my-app --template javascript

# Get help
npx create-zyra-app --help
```

### Manual Installation

You can also install Zyra manually in an existing project:

```bash
npm install zyrajs
```

Or with other package managers:

```bash
# Using Yarn
yarn add zyrajs

# Using pnpm
pnpm add zyrajs

# Using Bun
bun add zyrajs
```

## Quick Start

### Using JavaScript

```javascript
const createApp = require("zyrajs");

const app = createApp();

// Define a route
app.get("/", (req, res) => {
  res.json({ message: "Hello from Zyra!" });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Using TypeScript

```typescript
import createApp from "zyrajs";
import type { Request, Response } from "zyrajs";

const app = createApp();

// Define a route with full type safety
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Zyra!" });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## Usage Examples

### Using ZyraJS with JavaScript

ZyraJS works seamlessly with JavaScript - no changes required to your existing code:

```javascript
const createApp = require("zyrajs");

const app = createApp();

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
});

app.listen(3000);
```

### Using ZyraJS with TypeScript

ZyraJS provides full TypeScript support with comprehensive type definitions:

```typescript
import createApp from "zyrajs";
import type { Request, Response, MiddlewareFunction } from "zyrajs";

const app = createApp();

// Type-safe route handlers
app.get("/users/:id", (req: Request, res: Response) => {
  const { id } = req.params; // TypeScript knows params is RouteParams
  res.json({ userId: id });
});

// Type-safe middleware
const logger: MiddlewareFunction = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

app.use(logger);

app.listen(3000);
```

### Route Parameters

```javascript
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
});
```

### Query Parameters

```javascript
app.get("/search", (req, res) => {
  const { q, limit } = req.query;
  res.json({ query: q, limit });
});
```

### JSON Request Body

```javascript
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({
    message: "User created",
    user: { name, email },
  });
});
```

### Middleware

```javascript
// Global middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Route-specific middleware
const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Protected resource" });
});
```

### Route Grouping

```javascript
app.group("/api/v1", (api) => {
  // Group middleware
  api.use((req, res, next) => {
    // Authentication logic
    next();
  });

  api.get("/users", (req, res) => {
    res.json({ users: [] });
  });

  // Nested groups
  api.group("/admin", (admin) => {
    admin.get("/dashboard", (req, res) => {
      res.json({ dashboard: "data" });
    });
  });
});
```

### HTTP Methods

Zyra supports all standard HTTP methods:

```javascript
app.get("/resource", handler);
app.post("/resource", handler);
app.put("/resource/:id", handler);
app.patch("/resource/:id", handler);
app.delete("/resource/:id", handler);
```

### Error Handling

```javascript
// Automatic error handling
app.get("/error", (req, res) => {
  throw new Error("Something went wrong!");
  // Returns 500 with error details
});

// Manual error handling
app.get("/safe", (req, res) => {
  try {
    // Your code
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## TypeScript Support

### Exported Types and Interfaces

ZyraJS exports comprehensive TypeScript definitions for all framework components:

#### Core Types

```typescript
import type {
  // Application types
  IApp,
  AppOptions,
  GroupContext,

  // Request/Response types
  IRequest,
  IResponse,
  Request,
  Response,
  RouteParams,
  QueryParams,
  RequestBody,

  // Middleware types
  MiddlewareFunction,
  NextFunction,
  RouteHandler,

  // Router types
  IRouter,
  Route,
  RouteMatch,
  HttpMethod,

  // CORS types
  CorsOptions,
  CorsOrigin,
} from "zyrajs";
```

#### Type Definitions

**MiddlewareFunction**: Middleware function signature

```typescript
type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;
```

**RouteHandler**: Route handler function signature

```typescript
type RouteHandler = (req: Request, res: Response) => void | Promise<void>;
```

**RouteParams**: Route parameters extracted from URL

```typescript
interface RouteParams {
  [key: string]: string;
}
```

**QueryParams**: Query parameters from URL search string

```typescript
interface QueryParams {
  [key: string]: string | string[];
}
```

**CorsOptions**: CORS configuration options

```typescript
interface CorsOptions {
  origin?: string | string[] | boolean | ((origin: string) => boolean);
  methods?: string | string[];
  allowedHeaders?: string | string[];
  exposedHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
  optionsSuccessStatus?: number;
}
```

### TypeScript Examples

#### Typed Route Handlers

```typescript
import createApp from "zyrajs";
import type { Request, Response, RouteHandler } from "zyrajs";

const app = createApp();

// Inline typed handler
app.get("/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ userId: id });
});

// Separate typed handler
const getUserHandler: RouteHandler = (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
};

app.get("/users/:id", getUserHandler);
```

#### Typed Middleware

```typescript
import type { MiddlewareFunction } from "zyrajs";

const authMiddleware: MiddlewareFunction = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Validate token...
  next();
};

app.use(authMiddleware);
```

#### CORS with TypeScript

```typescript
import createApp, { cors } from "zyrajs";
import type { CorsOptions } from "zyrajs";

const app = createApp();

const corsOptions: CorsOptions = {
  origin: ["https://example.com", "https://app.example.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));
```

#### Custom Type Extensions

```typescript
import type { Request, Response } from "zyrajs";

// Extend request with custom properties
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const protectedRoute = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.json({ user: req.user });
};
```

## API Reference

### Application

#### `createApp(options)`

Creates a new Zyra application instance.

**Parameters:**

- `options` (optional): `AppOptions` - Application configuration options

**Returns:** `IApp` - Application instance

#### `app.get(path, ...handlers)`

Register a GET route.

**Parameters:**

- `path`: `string` - Route path (supports parameters like `/users/:id`)
- `handlers`: `RouteHandler[]` - One or more route handlers

#### `app.post(path, ...handlers)`

Register a POST route.

**Parameters:**

- `path`: `string` - Route path
- `handlers`: `RouteHandler[]` - One or more route handlers

#### `app.put(path, ...handlers)`

Register a PUT route.

**Parameters:**

- `path`: `string` - Route path
- `handlers`: `RouteHandler[]` - One or more route handlers

#### `app.patch(path, ...handlers)`

Register a PATCH route.

**Parameters:**

- `path`: `string` - Route path
- `handlers`: `RouteHandler[]` - One or more route handlers

#### `app.delete(path, ...handlers)`

Register a DELETE route.

**Parameters:**

- `path`: `string` - Route path
- `handlers`: `RouteHandler[]` - One or more route handlers

#### `app.use(middleware)`

Register global middleware.

**Parameters:**

- `middleware`: `MiddlewareFunction` - Middleware function

#### `app.group(prefix, callback)`

Create a route group with a common prefix.

**Parameters:**

- `prefix`: `string` - URL prefix for all routes in the group
- `callback`: `(context: GroupContext) => void` - Function to define grouped routes

#### `app.listen(port, callback)`

Start the HTTP server on the specified port.

**Parameters:**

- `port`: `number` - Port number to listen on
- `callback` (optional): `() => void` - Callback function called when server starts

**Returns:** `Server` - Node.js HTTP server instance

### Request Object

The `Request` object provides access to HTTP request data:

- `req.method`: `string` - HTTP method (GET, POST, etc.)
- `req.url`: `string` - Full request URL
- `req.path`: `string` - Request path without query string
- `req.params`: `RouteParams` - Route parameters (e.g., `{ id: "123" }`)
- `req.query`: `QueryParams` - Query string parameters
- `req.body`: `RequestBody` - Parsed request body (JSON)
- `req.headers`: `IncomingHttpHeaders` - Request headers

### Response Object

The `Response` object provides methods for sending HTTP responses:

#### `res.status(code)`

Set HTTP status code (chainable).

**Parameters:**

- `code`: `number` - HTTP status code

**Returns:** `IResponse` - Response instance for chaining

#### `res.json(data)`

Send JSON response.

**Parameters:**

- `data`: `any` - Data to serialize as JSON

#### `res.send(data)`

Send text/HTML response.

**Parameters:**

- `data`: `string` - Text or HTML content

#### `res.setHeader(key, value)`

Set response header (chainable).

**Parameters:**

- `key`: `string` - Header name
- `value`: `string | number | string[]` - Header value

**Returns:** `IResponse` - Response instance for chaining

#### `res.end()`

End the response without sending data.

## CORS Middleware

ZyraJS includes built-in CORS middleware:

```javascript
const createApp = require("zyrajs");
const { cors } = require("zyrajs");

const app = createApp();

// Enable CORS for all routes
app.use(cors());

// Or with custom options
app.use(
  cors({
    origin: "https://example.com",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
```

TypeScript usage:

```typescript
import createApp, { cors } from "zyrajs";
import type { CorsOptions } from "zyrajs";

const app = createApp();

const corsOptions: CorsOptions = {
  origin: ["https://example.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));
```

## Examples

Check out the [examples](./examples) directory for more comprehensive examples:

- `examples/basic-server.js` - Basic server setup (JavaScript)
- `examples/basic-server.ts` - Basic server setup (TypeScript)
- `examples/cors-example.js` - CORS middleware usage (JavaScript)
- `examples/cors-example.ts` - CORS middleware usage (TypeScript)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

#### For TypeScript Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/zyrajs.git
cd zyrajs
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Run in development mode (with watch):

```bash
npm run dev
```

5. Run type checking:

```bash
npm run typecheck
```

#### Project Structure

```
zyrajs/
├── src/                    # TypeScript source files
│   ├── types/             # Type definitions
│   ├── middleware/        # Middleware implementations
│   ├── app.ts             # Application class
│   ├── router.ts          # Router class
│   ├── request.ts         # Request wrapper
│   ├── response.ts        # Response wrapper
│   └── index.ts           # Main entry point
├── dist/                   # Compiled JavaScript (generated)
├── test/                   # Test files
├── examples/              # Example applications
└── tsconfig.json          # TypeScript configuration
```

#### Build Scripts

- `npm run build` - Compile TypeScript to JavaScript for production
- `npm run dev` - Watch mode for development
- `npm run clean` - Remove compiled files
- `npm run typecheck` - Type check without compilation
- `npm test` - Run tests
- `npm run prepublishOnly` - Automatically runs before publishing

#### TypeScript Guidelines

- Use strict type checking (enabled in `tsconfig.json`)
- Add type annotations for all function parameters and return values
- Implement interfaces for all public APIs
- Export types from `src/types/index.ts`
- Maintain backward compatibility with JavaScript users
- Write JSDoc comments for exported types and functions

#### Testing

Tests are written in TypeScript and run against the compiled JavaScript output:

```bash
npm test
```

#### Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes in the `src/` directory
4. Run `npm run typecheck` to verify types
5. Run `npm run build` to compile
6. Run `npm test` to verify tests pass
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

Please ensure your code:

- Passes TypeScript type checking
- Compiles without errors
- Maintains backward compatibility
- Includes appropriate type definitions
- Follows the existing code style
