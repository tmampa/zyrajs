import * as readline from "readline";

/**
 * Creates a readline interface for user input
 */
function createInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Prompts the user with a question and returns their input
 */
function askQuestion(
  question: string,
  rl: readline.Interface
): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Prompts the user to select a template type (JavaScript or TypeScript)
 */
export async function promptTemplate(): Promise<"javascript" | "typescript"> {
  const rl = createInterface();

  console.log("\nSelect a template:");
  console.log("  1) JavaScript");
  console.log("  2) TypeScript");

  let selection = "";
  let isValid = false;

  while (!isValid) {
    selection = await askQuestion("\nEnter your choice (1 or 2): ", rl);

    if (selection === "1" || selection === "2") {
      isValid = true;
    } else {
      console.log(
        "Invalid selection. Please enter 1 for JavaScript or 2 for TypeScript."
      );
    }
  }

  rl.close();

  return selection === "1" ? "javascript" : "typescript";
}

/**
 * Prompts the user to select a project structure (minimal or example)
 */
export async function promptStructure(): Promise<"minimal" | "example"> {
  const rl = createInterface();

  console.log("\nSelect a project structure:");
  console.log("  1) Minimal - Basic server with one route");
  console.log(
    "  2) Example - Includes example routes, middleware, and folder structure"
  );

  let selection = "";
  let isValid = false;

  while (!isValid) {
    selection = await askQuestion("\nEnter your choice (1 or 2): ", rl);

    if (selection === "1" || selection === "2") {
      isValid = true;
    } else {
      console.log(
        "Invalid selection. Please enter 1 for Minimal or 2 for Example."
      );
    }
  }

  rl.close();

  return selection === "1" ? "minimal" : "example";
}
