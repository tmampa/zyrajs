/**
 * CORS origin configuration
 */
export type CorsOrigin =
  | string
  | string[]
  | boolean
  | ((origin: string) => boolean);

/**
 * CORS configuration options
 */
export interface CorsOptions {
  origin?: CorsOrigin;
  methods?: string | string[];
  allowedHeaders?: string | string[];
  exposedHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
  optionsSuccessStatus?: number;
}
