#!/usr/bin/env node

/**
 * create-zyra-app CLI
 * Scaffolds new Zyra applications with JavaScript or TypeScript templates
 */

const path = require('path');
const fs = require('fs');

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

  console.log(`Creating Zyra application: ${options.projectName}`);
  
  if (options.template) {
    console.log(`Using template: ${options.template}`);
  }

  // TODO: Implement scaffolding logic in subsequent tasks
  console.log('\nScaffolding functionality will be implemented in subsequent tasks.');
}

// Run the CLI
main().catch((error) => {
  console.error('An error occurred:', error.message);
  process.exit(1);
});
