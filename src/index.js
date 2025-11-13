const App = require('./app');

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

module.exports = createApp;
