# Zyra

A lightweight Node.js backend framework for building RESTful APIs with simplicity and elegance.

## Features

- 🚀 **Lightweight** - Minimal dependencies, maximum performance
- 🛣️ **Flexible Routing** - Support for route parameters and multiple HTTP methods
- 🔧 **Middleware Support** - Global and route-specific middleware
- 📦 **Route Grouping** - Organize routes with prefixes and nested groups
- 🎯 **Simple API** - Intuitive and easy to learn
- ⚡ **Fast** - Built on Node.js native HTTP module

## Installation

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

## Usage Examples

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

## API Reference

### Application

#### `createApp(options)`

Creates a new Zyra application instance.

#### `app.get(path, ...handlers)`

Register a GET route.

#### `app.post(path, ...handlers)`

Register a POST route.

#### `app.put(path, ...handlers)`

Register a PUT route.

#### `app.patch(path, ...handlers)`

Register a PATCH route.

#### `app.delete(path, ...handlers)`

Register a DELETE route.

#### `app.use(middleware)`

Register global middleware.

#### `app.group(prefix, callback)`

Create a route group with a common prefix.

#### `app.listen(port, callback)`

Start the HTTP server on the specified port.

### Request Object

- `req.method` - HTTP method
- `req.path` - Request path
- `req.params` - Route parameters
- `req.query` - Query string parameters
- `req.body` - Parsed request body (JSON)
- `req.headers` - Request headers

### Response Object

#### `res.status(code)`

Set HTTP status code (chainable).

#### `res.json(data)`

Send JSON response.

#### `res.send(data)`

Send text/HTML response.

#### `res.setHeader(key, value)`

Set response header (chainable).

## Examples

Check out the [examples](./examples) directory for more comprehensive examples.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
