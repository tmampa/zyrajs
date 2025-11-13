import { pathToRegexp, Key } from "path-to-regexp";
import type { IRouter, Route, RouteMatch, HttpMethod } from "./types/router.js";
import type { RouteHandler } from "./types/middleware.js";

class Router implements IRouter {
  public routes: Route[];

  constructor() {
    this.routes = [];
  }

  /**
   * Register a new route
   * @param method - HTTP method (GET, POST, etc.)
   * @param path - Route path pattern (e.g., '/users/:id')
   * @param handlers - Array of handler functions
   */
  addRoute(method: string, path: string, handlers: RouteHandler[]): void {
    const keys: Key[] = [];
    const regex = pathToRegexp(path, keys);
    const paramNames = keys.map((key) => String(key.name));

    this.routes.push({
      method: method.toUpperCase() as HttpMethod,
      path,
      regex,
      paramNames,
      handlers: Array.isArray(handlers) ? handlers : [handlers],
      middleware: [],
    });
  }

  /**
   * Find a matching route for the given method and path
   * @param method - HTTP method
   * @param path - Request path
   * @returns Matched route with extracted params, or null
   */
  match(method: string, path: string): RouteMatch | null {
    const normalizedMethod = method.toUpperCase();

    for (const route of this.routes) {
      if (route.method !== normalizedMethod) {
        continue;
      }

      const matches = route.regex.exec(path);
      if (matches) {
        const params = this._extractParams(route.paramNames, matches);
        return {
          ...route,
          params,
        };
      }
    }

    return null;
  }

  /**
   * Extract parameter values from regex matches
   * @param paramNames - Array of parameter names
   * @param matches - Regex match results
   * @returns Object mapping parameter names to values
   * @private
   */
  private _extractParams(
    paramNames: string[],
    matches: RegExpExecArray
  ): { [key: string]: string } {
    const params: { [key: string]: string } = {};

    // matches[0] is the full match, matches[1+] are capture groups
    for (let i = 0; i < paramNames.length; i++) {
      params[paramNames[i]] = matches[i + 1];
    }

    return params;
  }
}

export default Router;
