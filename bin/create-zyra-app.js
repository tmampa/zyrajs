#!/usr/bin/env node

/**
 * create-zyra-app CLI
 * Scaffolds new Zyra applications with JavaScript or TypeScript templates
 */

const path = require('path');
const fs = require('fs');
const { 
  handleError, 
  InvalidProjectNameError, 
  DirectoryExistsError,
  InvalidNodeVersionError,
  FileSystemError
} = require('../dist/cli/errors');
const { 
  validateProjectName, 
  checkDirectoryExists, 
  validateNodeVersion 
} = require('../dist/cli/validator');
const { promptTemplate, promptStructure } = require('../dist/cli/prompt');
const { selectTemplate } = require('../dist/cli/templates');
const { ProjectGenerator } = require('../dist/cli/generator');

// Parse command-line arguments
function parseArguments(args) {
  const options = {
    projectName: null,
    template: null,
    help: false
  };

  // Skip first two args (node and script path)
  const userArgs = args.slice(2);

  for (let i = 0; i < userArgs.length; i++) {
    const arg = userArgs[i];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--template' || arg === '-t') {
      // Next argument should be the template type
      if (i + 1 < userArgs.length) {
        options.template = userArgs[i + 1];
        i++; // Skip next argument
      }
    } else if (!arg.startsWith('-') && !options.projectName) {
      // First non-flag argument is the project name
      options.projectName = arg;
    }
  }

  return options;
}

// Display help text
function displayHelp() {
  console.log(`
create-zyra-app - Scaffold a new Zyra application

Usage:
  npx create-zyra-app <project-name> [options]
  create-zyra-app <project-name> [options]

Arguments:
  <project-name>        Name of the project to create

Options:
  --template, -t <type> Template type: 'javascript' or 'typescript'
                        If not specified, you'll be prompted to choose
  --help, -h            Display this help message

Examples:
  npx create-zyra-app my-app
  npx create-zyra-app my-app --template typescript
  npx create-zyra-app my-app -t javascript

For more information, visit: https://github.com/tmampa/zyrajs
`);
}

/**
 * Display success message with next steps
 */
function displaySuccess(projectName, templateType, structure) {
  console.log('\n✅ Success! Your Zyra application has been created.\n');
  console.log(`📁 Project: ${projectName}`);
  console.log(`📦 Template: ${templateType}`);
  console.log(`🏗️  Structure: ${structure}\n`);
  console.log('Next steps:\n');
  console.log(`  cd ${projectName}`);
  console.log('  npm install');
  
  if (templateType === 'typescript') {
    console.log('  npm run build');
    console.log('  npm run dev    # Start development server with watch mode');
  } else {
    console.log('  npm run dev    # Start development server with watch mode');
  }
  
  console.log('  npm start      # Start production server\n');
  
  if (structure === 'example') {
    console.log('Your project includes example routes and middleware to help you get started.');
    console.log('Check out the README.md file for more information about the project structure.\n');
  } else {
    console.log('Your project has a minimal setup. Start building by adding routes to your server!\n');
  }
  
  console.log('Happy coding! 🚀\n');
}

/**
 * Cleanup partial file creation on error
 */
async function cleanup(targetPath) {
  try {
    // Check if directory exists before attempting cleanup
    if (fs.existsSync(targetPath)) {
      await fs.promises.rm(targetPath, { recursive: true, force: true });
      console.log(`\n🧹 Cleaned up partial project files at ${targetPath}`);
    }
  } catch (error) {
    // Log cleanup error but don't throw - we're already handling an error
    console.error(`Warning: Failed to cleanup directory: ${error.message}`);
  }
}

// Main function
async function main() {
  const options = parseArguments(process.argv);

  // Display help if requested or no arguments provided
  if (options.help || process.argv.length === 2) {
    displayHelp();
    process.exit(0);
  }

  // Validate that project name was provided
  if (!options.projectName) {
    console.error('Error: Project name is required\n');
    displayHelp();
    process.exit(1);
  }

  const projectName = options.projectName;
  const targetPath = path.resolve(process.cwd(), projectName);

  try {
    // Step 1: Validate Node.js version
    const nodeVersionResult = validateNodeVersion();
    if (!nodeVersionResult.valid) {
      throw new InvalidNodeVersionError(process.version, '18.0.0');
    }

    // Step 2: Validate project name
    const nameValidation = validateProjectName(projectName);
    if (!nameValidation.valid) {
      throw new InvalidProjectNameError(projectName);
    }

    // Step 3: Check if directory already exists
    if (checkDirectoryExists(targetPath)) {
      throw new DirectoryExistsError(projectName);
    }

    console.log(`\n🚀 Creating Zyra application: ${projectName}\n`);

    // Step 4: Template selection (prompt or use --template flag)
    let templateType;
    if (options.template) {
      // Validate template flag value
      if (options.template !== 'javascript' && options.template !== 'typescript') {
        throw new Error(`Invalid template type: ${options.template}. Must be 'javascript' or 'typescript'.`);
      }
      templateType = options.template;
      console.log(`Using template: ${templateType}`);
    } else {
      templateType = await promptTemplate();
    }

    // Step 5: Structure selection (always prompt)
    const structure = await promptStructure();

    console.log(`\n📦 Generating ${structure} ${templateType} project...\n`);

    // Step 6: Select template configuration
    const template = selectTemplate(templateType, structure);

    // Step 7: Generate project files
    const generator = new ProjectGenerator({
      projectName,
      template,
      targetPath
    });

    await generator.generate();

    // Step 8: Display success message
    displaySuccess(projectName, templateType, structure);

  } catch (error) {
    // Cleanup partial files on error
    await cleanup(targetPath);
    
    // Re-throw to be handled by top-level error handler
    throw error;
  }
}

// Run the CLI
main().catch((error) => {
  handleError(error);
});
