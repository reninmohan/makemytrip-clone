export class HttpError extends Error {
  statusCode: number;
  errorObj?: unknown;

  constructor(statusCode: number, message = "something went wrong from error util", errorObj?: unknown) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.errorObj = errorObj;
  }
}
