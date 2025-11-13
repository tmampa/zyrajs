# Release Notes - v0.2.2

## JavaScript CommonJS Compatibility Fix

### What was fixed?

Previously, JavaScript users had to use `require('zyrajs').default` to access the framework, which was not intuitive. This release fixes that issue.

### Changes Made

1. **Enhanced CommonJS Exports** (`src/index.ts`)

   - Added explicit `module.exports` assignments
   - Now supports both `require('zyrajs')` and `require('zyrajs').default`
   - All exports (createApp, cors, Request, Response, Router, App) are properly exposed

2. **New JavaScript Examples**

   - `examples/minimal-js-server.js` - Simplest possible server
   - `examples/javascript-quickstart.js` - Comprehensive JavaScript usage guide
   - Updated `examples/basic-server.js` to use compiled output

3. **Documentation**
   - Added CHANGELOG.md
   - Updated examples with clear comments about npm vs local usage

### Before (Broken)

```javascript
const createApp = require("zyrajs");
// TypeError: createApp is not a function
```

### After (Fixed)

```javascript
const createApp = require("zyrajs");
const app = createApp(); // ✓ Works!
```

### Testing

- Created test JavaScript project
- Verified all features work:
  - ✓ Basic routing
  - ✓ Route parameters
  - ✓ Query parameters
  - ✓ JSON request/response
  - ✓ Middleware
  - ✓ Route grouping
  - ✓ CORS support
  - ✓ All HTTP methods

### Ready to Publish

- Version bumped to 0.2.2
- Build successful
- Type checking passed
- Package contents verified
