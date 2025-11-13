import { TemplateConfig } from "./types";
import { javascriptMinimalTemplate } from "./javascript-minimal";
import { javascriptExampleTemplate } from "./javascript-example";
import { typescriptMinimalTemplate } from "./typescript-minimal";
import { typescriptExampleTemplate } from "./typescript-example";

/**
 * Selects and returns the appropriate template configuration based on user choices
 * @param type - The template type (javascript or typescript)
 * @param structure - The project structure (minimal or example)
 * @returns The selected template configuration
 */
export function selectTemplate(
  type: "javascript" | "typescript",
  structure: "minimal" | "example"
): TemplateConfig {
  if (type === "javascript" && structure === "minimal") {
    return javascriptMinimalTemplate;
  }

  if (type === "javascript" && structure === "example") {
    return javascriptExampleTemplate;
  }

  if (type === "typescript" && structure === "minimal") {
    return typescriptMinimalTemplate;
  }

  if (type === "typescript" && structure === "example") {
    return typescriptExampleTemplate;
  }

  // This should never happen due to TypeScript type checking
  throw new Error(`Invalid template combination: ${type} - ${structure}`);
}

// Export all templates and types
export { TemplateConfig, FileDefinition } from "./types";
export { javascriptMinimalTemplate } from "./javascript-minimal";
export { javascriptExampleTemplate } from "./javascript-example";
export { typescriptMinimalTemplate } from "./typescript-minimal";
export { typescriptExampleTemplate } from "./typescript-example";
