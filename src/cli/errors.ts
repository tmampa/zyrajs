/**
 * Custom error classes for CLI operations
 */

/**
 * Base class for all CLI errors
 */
export class CLIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly exitCode: number = 1
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when project name is invalid
 */
export class InvalidProjectNameError extends CLIError {
  constructor(projectName: string) {
    super(
      `Invalid project name: "${projectName}"\n` +
        "Project name must contain only letters, numbers, hyphens, and underscores.",
      "INVALID_PROJECT_NAME",
      1
    );
  }
}

/**
 * Error thrown when target directory already exists
 */
export class DirectoryExistsError extends CLIError {
  constructor(projectName: string) {
    super(
      `Directory "${projectName}" already exists. Please choose a different name.`,
      "DIRECTORY_EXISTS",
      1
    );
  }
}

/**
 * Error thrown when Node.js version is insufficient
 */
export class InvalidNodeVersionError extends CLIError {
  constructor(currentVersion: string, requiredVersion: string) {
    super(
      `Node.js version ${requiredVersion} or higher is required.\n` +
        `Current version: ${currentVersion}`,
      "INVALID_NODE_VERSION",
      1
    );
  }
}

/**
 * Error thrown when file system operations fail
 */
export class FileSystemError extends CLIError {
  constructor(operation: string, details: string) {
    super(`Failed to ${operation}: ${details}`, "FS_ERROR", 1);
  }
}

/**
 * Error thrown when permission is denied
 */
export class PermissionDeniedError extends CLIError {
  constructor(path: string) {
    super(
      `Permission denied. Cannot create directory at "${path}"`,
      "PERMISSION_DENIED",
      1
    );
  }
}

/**
 * Format and display error message to the user
 */
export function formatError(error: Error): string {
  if (error instanceof CLIError) {
    return `\n❌ Error: ${error.message}\n`;
  }

  // For unexpected errors, show a generic message
  return `\n❌ An unexpected error occurred: ${error.message}\n`;
}

/**
 * Handle errors at the top level of the CLI
 * Formats the error and exits with appropriate code
 */
export function handleError(error: Error): never {
  console.error(formatError(error));

  // Exit with appropriate code
  const exitCode = error instanceof CLIError ? error.exitCode : 1;
  process.exit(exitCode);
}
