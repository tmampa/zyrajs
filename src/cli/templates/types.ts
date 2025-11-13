/**
 * Represents a file to be generated in the project
 */
export interface FileDefinition {
  path: string;
  content: string | (() => string);
}

/**
 * Template configuration for project scaffolding
 */
export interface TemplateConfig {
  type: "javascript" | "typescript";
  structure: "minimal" | "example";
  files: FileDefinition[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}
