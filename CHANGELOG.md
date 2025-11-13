# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.3] - 2025-11-13

### Added

- Success reporter module for create-zyra-app CLI
- Enhanced success messages with project details and location
- Visual formatting with emojis for better user experience
- Context-specific guidance for minimal vs example project structures
- Clear next steps with actual project name substituted in commands

### Improved

- Modularized CLI success message display
- Better separation of concerns in CLI architecture

## [0.2.2] - 2025-11-13

### Fixed

- Improved CommonJS compatibility for JavaScript projects
- Fixed `require('zyrajs')` to work directly without needing `.default`
- Added proper module.exports for seamless JavaScript usage

### Added

- New JavaScript examples: `minimal-js-server.js` and `javascript-quickstart.js`
- Better documentation for JavaScript usage

## [0.2.1] - Previous Release

### Added

- TypeScript support with full type definitions
- CORS middleware
- Route grouping functionality
- Comprehensive examples

## [0.2.0] - Initial Release

### Added

- Core framework functionality
- HTTP routing (GET, POST, PUT, PATCH, DELETE)
- Route parameters and query parameters
- Middleware support
- JSON request/response handling
- Basic error handling
