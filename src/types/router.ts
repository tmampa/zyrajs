import { RouteHandler, MiddlewareFunction } from "./middleware";

/**
 * HTTP methods supported by the router
 */
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "OPTIONS";

/**
 * Route definition stored in router
 */
export interface Route {
  method: HttpMethod;
  path: string;
  regex: RegExp;
  paramNames: string[];
  handlers: RouteHandler[];
  middleware: MiddlewareFunction[];
}

/**
 * Route match result with extracted parameters
 */
export interface RouteMatch extends Route {
  params: { [key: string]: string };
}

/**
 * Router interface
 */
export interface IRouter {
  routes: Route[];
  addRoute(method: string, path: string, handlers: RouteHandler[]): void;
  match(method: string, path: string): RouteMatch | null;
}
