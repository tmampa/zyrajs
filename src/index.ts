import { App } from "./app";
import { IApp, AppOptions } from "./types/app";
import cors from "./middleware/cors";

/**
 * Factory function to create a new application instance
 * @param options - Optional configuration object
 * @returns A new App instance
 */
export function createApp(options: AppOptions = {}): IApp {
  // Add any necessary default configuration handling
  const config: AppOptions = {
    ...options,
  };

  // Create and return new App instance
  return new App(config);
}

// Export all types for TypeScript users
export * from "./types";

// Export classes for TypeScript users
export { Request } from "./request";
export { Response } from "./response";
export { default as Router } from "./router";
export { App } from "./app";

// Export cors middleware
export { cors };

// Set createApp as default export
export default createApp;

// CommonJS compatibility - allows require('zyrajs') to work directly
// This ensures that both `require('zyrajs')` and `require('zyrajs').default` work
module.exports = createApp;
module.exports.default = createApp;
module.exports.createApp = createApp;
module.exports.cors = cors;
module.exports.Request = require("./request").Request;
module.exports.Response = require("./response").Response;
module.exports.Router = require("./router").default;
module.exports.App = require("./app").App;
