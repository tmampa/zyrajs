import { TemplateConfig } from "./types";

/**
 * Minimal TypeScript template configuration
 */
export const typescriptMinimalTemplate: TemplateConfig = {
  type: "typescript",
  structure: "minimal",
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

// Create a new Zyra application instance
const app = createApp();

// Define a basic route that responds to GET requests at the root path
// The Request and Response types provide TypeScript type safety
app.get('/', (req: Request, res: Response) => {
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

A minimal Zyra application with TypeScript.

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

- \`src/index.ts\` - Main application file with server setup and routes
- \`tsconfig.json\` - TypeScript configuration
`,
    },
  ],
};
