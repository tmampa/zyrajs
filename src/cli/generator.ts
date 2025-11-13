import * as fs from "fs/promises";
import * as path from "path";
import { TemplateConfig } from "./templates/types";

/**
 * Options for the ProjectGenerator
 */
export interface GeneratorOptions {
  projectName: string;
  template: TemplateConfig;
  targetPath: string;
}

/**
 * ProjectGenerator handles the creation of project files and directories
 * based on a template configuration
 */
export class ProjectGenerator {
  private projectName: string;
  private template: TemplateConfig;
  private targetPath: string;

  constructor(options: GeneratorOptions) {
    this.projectName = options.projectName;
    this.template = options.template;
    this.targetPath = options.targetPath;
  }

  /**
   * Main method to generate the entire project
   * Orchestrates the creation of all files and directories
   */
  async generate(): Promise<void> {
    try {
      // Create the project root directory
      await this.createDirectory(this.targetPath);

      // Generate all project files
      await this.generatePackageJson();
      await this.generateSourceFiles();
      await this.generateConfigFiles();
      await this.generateDocumentation();
    } catch (error) {
      // Re-throw with more context
      throw new Error(
        `Failed to generate project: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Creates a directory with recursive option
   * @param dirPath - Path to the directory to create
   */
  private async createDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw new Error(
        `Failed to create directory ${dirPath}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Writes content to a file
   * Creates parent directories if they don't exist
   * @param filePath - Path to the file to write
   * @param content - Content to write to the file
   */
  private async writeFile(filePath: string, content: string): Promise<void> {
    try {
      // Ensure parent directory exists
      const dir = path.dirname(filePath);
      await this.createDirectory(dir);

      // Write the file
      await fs.writeFile(filePath, content, "utf-8");
    } catch (error) {
      throw new Error(
        `Failed to write file ${filePath}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Generates the package.json file with correct structure
   * Includes dependencies, devDependencies, scripts, and metadata
   */
  private async generatePackageJson(): Promise<void> {
    try {
      const packageJson = {
        name: this.projectName,
        version: "1.0.0",
        description: "A Zyra application",
        main:
          this.template.type === "typescript" ? "dist/index.js" : "index.js",
        scripts: this.template.scripts,
        engines: {
          node: ">=18.0.0",
        },
        keywords: ["zyra", "web", "framework"],
        author: "",
        license: "ISC",
        dependencies: this.template.dependencies,
        ...(Object.keys(this.template.devDependencies).length > 0 && {
          devDependencies: this.template.devDependencies,
        }),
      };

      const packageJsonPath = path.join(this.targetPath, "package.json");
      const content = JSON.stringify(packageJson, null, 2) + "\n";

      await this.writeFile(packageJsonPath, content);
    } catch (error) {
      throw new Error(
        `Failed to generate package.json: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Generates source files and folders based on template configuration
   * Creates main application file(s) and any additional source files
   */
  private async generateSourceFiles(): Promise<void> {
    try {
      // Filter files that are source files (not config or documentation)
      const sourceFiles = this.template.files.filter((file) => {
        const fileName = path.basename(file.path);
        return (
          !fileName.startsWith(".") &&
          fileName !== "README.md" &&
          fileName !== "tsconfig.json"
        );
      });

      // Generate each source file
      for (const file of sourceFiles) {
        const filePath = path.join(this.targetPath, file.path);
        const content =
          typeof file.content === "function" ? file.content() : file.content;

        await this.writeFile(filePath, content);
      }
    } catch (error) {
      throw new Error(
        `Failed to generate source files: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Generates configuration files (.gitignore, tsconfig.json)
   * Only generates TypeScript config for TypeScript templates
   */
  private async generateConfigFiles(): Promise<void> {
    try {
      // Find and generate .gitignore
      const gitignoreFile = this.template.files.find(
        (file) => path.basename(file.path) === ".gitignore"
      );

      if (gitignoreFile) {
        const filePath = path.join(this.targetPath, gitignoreFile.path);
        const content =
          typeof gitignoreFile.content === "function"
            ? gitignoreFile.content()
            : gitignoreFile.content;

        await this.writeFile(filePath, content);
      }

      // Find and generate tsconfig.json (TypeScript only)
      if (this.template.type === "typescript") {
        const tsconfigFile = this.template.files.find(
          (file) => path.basename(file.path) === "tsconfig.json"
        );

        if (tsconfigFile) {
          const filePath = path.join(this.targetPath, tsconfigFile.path);
          const content =
            typeof tsconfigFile.content === "function"
              ? tsconfigFile.content()
              : tsconfigFile.content;

          await this.writeFile(filePath, content);
        }
      }
    } catch (error) {
      throw new Error(
        `Failed to generate config files: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Generates documentation files (README.md)
   */
  private async generateDocumentation(): Promise<void> {
    try {
      // Find and generate README.md
      const readmeFile = this.template.files.find(
        (file) => path.basename(file.path) === "README.md"
      );

      if (readmeFile) {
        const filePath = path.join(this.targetPath, readmeFile.path);
        const content =
          typeof readmeFile.content === "function"
            ? readmeFile.content()
            : readmeFile.content;

        await this.writeFile(filePath, content);
      }
    } catch (error) {
      throw new Error(
        `Failed to generate documentation: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
