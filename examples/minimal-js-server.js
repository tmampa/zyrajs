/**
 * Minimal ZyraJS JavaScript Server
 * 
 * The simplest possible ZyraJS server in JavaScript.
 * Perfect for getting started quickly!
 */

// When using zyrajs from npm: const createApp = require('zyrajs');
// For this example, we use the local build:
const createApp = require('../dist/index.js');

const app = createApp();

// Define your routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.get('/users/:id', (req, res) => {
  res.json({ userId: req.params.id });
});

app.post('/users', (req, res) => {
  res.status(201).json({ 
    message: 'User created',
    data: req.body 
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
