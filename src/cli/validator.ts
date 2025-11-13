import * as fs from "fs";

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a project name according to npm package naming rules
 * @param name - The project name to validate
 * @returns Validation result with status and optional error message
 */
export function validateProjectName(name: string): ValidationResult {
  // Check if name is empty
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      error: "Project name cannot be empty",
    };
  }

  // Check for spaces
  if (name.includes(" ")) {
    return {
      valid: false,
      error: "Project name cannot contain spaces",
    };
  }

  // Check for special characters (only allow letters, numbers, hyphens, and underscores)
  const validNamePattern = /^[a-zA-Z0-9_-]+$/;
  if (!validNamePattern.test(name)) {
    return {
      valid: false,
      error:
        "Project name must contain only letters, numbers, hyphens, and underscores",
    };
  }

  return { valid: true };
}

/**
 * Checks if a directory already exists at the specified path
 * @param dirPath - The directory path to check
 * @returns True if directory exists, false otherwise
 */
export function checkDirectoryExists(dirPath: string): boolean {
  return fs.existsSync(dirPath);
}

/**
 * Validates that the current Node.js version meets the minimum requirement
 * @returns Validation result with status and optional error message
 */
export function validateNodeVersion(): ValidationResult {
  const currentVersion = process.version;
  const requiredVersion = "18.0.0";

  // Parse version string (format: v18.0.0)
  const versionMatch = currentVersion.match(/^v(\d+)\.(\d+)\.(\d+)/);

  if (!versionMatch) {
    return {
      valid: false,
      error: `Unable to parse Node.js version: ${currentVersion}`,
    };
  }

  const [, major, minor, patch] = versionMatch.map(Number);
  const [reqMajor, reqMinor, reqPatch] = requiredVersion.split(".").map(Number);

  // Compare versions
  if (
    major < reqMajor ||
    (major === reqMajor && minor < reqMinor) ||
    (major === reqMajor && minor === reqMinor && patch < reqPatch)
  ) {
    return {
      valid: false,
      error: `Node.js version ${requiredVersion} or higher is required. Current version: ${currentVersion}`,
    };
  }

  return { valid: true };
}
