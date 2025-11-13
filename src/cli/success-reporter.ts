/**
 * Success reporter module for displaying project creation success messages
 */

export interface SuccessReporterOptions {
  projectName: string;
  templateType: "javascript" | "typescript";
  structure: "minimal" | "example";
  projectPath?: string;
}

/**
 * Formats and displays a success message after project creation
 * Shows project details, next steps, and helpful commands
 */
export function displaySuccess(options: SuccessReporterOptions): void {
  const { projectName, templateType, structure, projectPath } = options;

  // Success header
  console.log("\n✅ Success! Your Zyra application has been created.\n");

  // Project details
  console.log(`📁 Project: ${projectName}`);
  if (projectPath) {
    console.log(`📂 Location: ${projectPath}`);
  }
  console.log(`📦 Template: ${templateType}`);
  console.log(`🏗️  Structure: ${structure}\n`);

  // Next steps section
  console.log("Next steps:\n");
  displayNextSteps(projectName, templateType);

  // Additional guidance based on structure
  displayStructureGuidance(structure);

  // Closing message
  console.log("Happy coding! 🚀\n");
}

/**
 * Displays the next steps commands for the user
 */
function displayNextSteps(
  projectName: string,
  templateType: "javascript" | "typescript"
): void {
  console.log(`  cd ${projectName}`);
  console.log("  npm install");

  if (templateType === "typescript") {
    console.log("  npm run build");
    console.log("  npm run dev    # Start development server with watch mode");
  } else {
    console.log("  npm run dev    # Start development server with watch mode");
  }

  console.log("  npm start      # Start production server\n");
}

/**
 * Displays guidance based on the project structure type
 */
function displayStructureGuidance(structure: "minimal" | "example"): void {
  if (structure === "example") {
    console.log(
      "Your project includes example routes and middleware to help you get started."
    );
    console.log(
      "Check out the README.md file for more information about the project structure.\n"
    );
  } else {
    console.log(
      "Your project has a minimal setup. Start building by adding routes to your server!\n"
    );
  }
}
