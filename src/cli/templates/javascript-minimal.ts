import { TemplateConfig } from "./types";

/**
 * Minimal JavaScript template configuration
 */
export const javascriptMinimalTemplate: TemplateConfig = {
  type: "javascript",
  structure: "minimal",
  dependencies: {
    zyrajs: "^0.2.2",
  },
  devDependencies: {},
  scripts: {
    start: "node index.js",
    dev: "node --watch index.js",
  },
  files: [
    {
      path: "index.js",
      content: `// Import the Zyra framework
const createApp = require('zyrajs');

// Create a new Zyra application instance
const app = createApp();

// Define a basic route that responds to GET requests at the root path
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Zyra!' });
});

// Configure the server port (uses environment variable or defaults to 3000)
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
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

A minimal Zyra application.

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

- \`index.js\` - Main application file with server setup and routes
`,
    },
  ],
};
