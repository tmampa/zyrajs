import type { IRequest } from "./request.js";
import type { IResponse } from "./response.js";

/**
 * Next function type for middleware chain
 */
export type NextFunction = (error?: Error) => void | Promise<void>;

/**
 * Middleware function signature
 */
export type MiddlewareFunction = (
  req: IRequest,
  res: IResponse,
  next: NextFunction
) => void | Promise<void>;

/**
 * Route handler function signature
 */
export type RouteHandler = (
  req: IRequest,
  res: IResponse
) => void | Promise<void>;
