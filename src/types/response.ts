/**
 * Response interface for sending HTTP responses
 */
export interface IResponse {
  status(code: number): IResponse;
  json(data: any): void;
  send(data: string): void;
  setHeader(key: string, value: string | number | string[]): IResponse;
  end(): void;
}
