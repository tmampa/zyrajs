const App = require('./app');
const cors = require('./middleware/cors');

/**
 * Factory function to create a new application instance
 * @param {Object} options - Optional configuration object
 * @returns {App} A new App instance
 */
function createApp(options = {}) {
  // Add any necessary default configuration handling
  const config = {
    ...options
  };
  
  // Create and return new App instance
  return new App(config);
}

// Export the main factory function as default
module.exports = createApp;

// Export cors middleware
module.exports.cors = cors;
