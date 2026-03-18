export class HttpError extends Error {
  code: number;
  message: string;
  cause?: string;
  response?: unknown;
  url?: string;
  error?: string;

  constructor({
    code,
    message,
    cause,
    response,
    url,
    error,
  }: {
    code: number;
    message: string;
    cause?: string;
    response?: unknown;
    url?: string;
    error?: string;
  }) {
    super(message);
    this.code = code;
    this.message = message;
    this.cause = cause;
    this.response = response;
    this.url = url;
    this.error = error;
  }
}
