import { Server } from "http";
import { RouteHandler, MiddlewareFunction } from "./middleware";

/**
 * Application configuration options
 */
export interface AppOptions {
  [key: string]: any;
}

/**
 * Handler type that accepts both route handlers and middleware functions
 * Middleware functions can be used as route handlers (next parameter is optional)
 */
export type Handler = RouteHandler | MiddlewareFunction;

/**
 * Group context for route grouping
 */
export interface GroupContext {
  use(middleware: MiddlewareFunction): void;
  get(path: string, ...handlers: Handler[]): void;
  post(path: string, ...handlers: Handler[]): void;
  put(path: string, ...handlers: Handler[]): void;
  delete(path: string, ...handlers: Handler[]): void;
  patch(path: string, ...handlers: Handler[]): void;
  group(prefix: string, callback: (context: GroupContext) => void): void;
}

/**
 * Main application interface
 */
export interface IApp {
  get(path: string, ...handlers: Handler[]): void;
  post(path: string, ...handlers: Handler[]): void;
  put(path: string, ...handlers: Handler[]): void;
  delete(path: string, ...handlers: Handler[]): void;
  patch(path: string, ...handlers: Handler[]): void;
  use(middleware: MiddlewareFunction): void;
  group(prefix: string, callback: (context: GroupContext) => void): void;
  listen(port: number, callback?: () => void): Server;
}
