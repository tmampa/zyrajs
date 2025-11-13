import { IncomingHttpHeaders } from "http";

/**
 * Route parameters extracted from URL
 */
export interface RouteParams {
  [key: string]: string;
}

/**
 * Query parameters from URL search string
 */
export interface QueryParams {
  [key: string]: string | string[];
}

/**
 * Request body (parsed JSON or raw string)
 */
export type RequestBody = any;

/**
 * Request interface extending Node.js IncomingMessage
 */
export interface IRequest {
  readonly method: string;
  readonly url: string;
  readonly headers: IncomingHttpHeaders;
  readonly path: string;
  query: QueryParams;
  params: RouteParams;
  body: RequestBody;
}
