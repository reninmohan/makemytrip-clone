export class HttpError extends Error {
  statusCode: number;
  errorObj?: unknown;

  constructor(statusCode: number, message: string, errorObj?: unknown) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.errorObj = errorObj;
  }
}
