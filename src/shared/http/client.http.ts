import type { Result } from '@/shared/result';
import type { ZodType, z } from 'zod';

import type { HttpError } from '@/shared/http/errors/http-error';
import type { HttpResponse } from '@/shared/http/types/http-response';

export interface HttpClient {
  get<S extends ZodType>(
    url: string,
    schema: S,
    headers?: object,
  ): Promise<Result<HttpResponse<z.output<S>>, HttpError>>;
  get<T = unknown>(url: string, headers?: object): Promise<Result<HttpResponse<T>, HttpError>>;

  post<S extends ZodType>(
    url: string,
    data: object,
    schema: S,
    params?: object,
    headers?: object,
  ): Promise<Result<HttpResponse<z.output<S>>, HttpError>>;
  post<T = unknown>(
    url: string,
    data: object,
    params?: object,
    headers?: object,
  ): Promise<Result<HttpResponse<T>, HttpError>>;

  put<S extends ZodType>(
    url: string,
    data: object,
    schema: S,
    params?: object,
    headers?: object,
  ): Promise<Result<HttpResponse<z.output<S>>, HttpError>>;
  put<T = unknown>(
    url: string,
    data: object,
    params?: object,
    headers?: object,
  ): Promise<Result<HttpResponse<T>, HttpError>>;

  patch<S extends ZodType>(
    url: string,
    data: object,
    schema: S,
    params?: object,
    headers?: object,
  ): Promise<Result<HttpResponse<z.output<S>>, HttpError>>;
  patch<T = unknown>(
    url: string,
    data: object,
    params?: object,
    headers?: object,
  ): Promise<Result<HttpResponse<T>, HttpError>>;

  delete<S extends ZodType>(
    url: string,
    schema: S,
    data?: object,
    params?: object,
    headers?: object,
  ): Promise<Result<HttpResponse<z.output<S>>, HttpError>>;
  delete<T = unknown>(
    url: string,
    data?: object,
    params?: object,
    headers?: object,
  ): Promise<Result<HttpResponse<T>, HttpError>>;

  setHeaders(headers: object): void;
  setAuthorization(token: string): void;
}
