import { Err, Ok, type Result } from '@/shared/result';
import { Axios, type AxiosResponse, isAxiosError } from 'axios';
import type { ZodType } from 'zod';

import type { HttpClient } from '@/shared/http/client.http';
import { HttpError } from '@/shared/http/errors/http-error';
import { ErrorSchema } from '@/shared/http/types/error-schema';
import type { HttpResponse } from '@/shared/http/types/http-response';
import { HttpErrorCode, HttpErrorKey } from '@/shared/http/types/types';

type AxiosClientParams = {
  baseURL: string;
  withCredentials?: boolean;
};

class AxiosClient implements HttpClient {
  readonly #client: Axios;

  constructor({ baseURL, withCredentials = true }: AxiosClientParams) {
    this.#client = new Axios({
      baseURL,
      withCredentials,
      validateStatus: function (status) {
        return status >= 200 && status < 400;
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.#client.interceptors.request.use(
      function (config) {
        return config;
      },
      function (error) {
        return Promise.reject(error);
      },
    );
    this.#client.interceptors.response.use(
      function onFulfilled(response) {
        return response;
      },
      function onRejected(error) {
        return Promise.reject(error);
      },
    );
  }

  get<T>(
    url: string,
    schemaOrHeaders?: ZodType | object,
    headers?: object,
  ): Promise<Result<HttpResponse<T>, HttpError>> {
    if (schemaOrHeaders && 'parse' in schemaOrHeaders) {
      return this.call(() => this.#client.get(url, headers), schemaOrHeaders);
    }
    return this.call(() => this.#client.get(url, schemaOrHeaders));
  }

  post<T>(
    url: string,
    data: object,
    schemaOrParams?: ZodType | object,
    params?: object,
    headers?: object,
  ): Promise<Result<HttpResponse<T>, HttpError>> {
    if (schemaOrParams && 'parse' in schemaOrParams) {
      return this.call(
        () => this.#client.post(url, JSON.stringify(data), { params, headers }),
        schemaOrParams,
      );
    }
    return this.call(() =>
      this.#client.post(url, JSON.stringify(data), {
        params: schemaOrParams,
        headers,
      }),
    );
  }

  put<T>(
    url: string,
    data: object,
    schemaOrParams?: ZodType | object,
    params?: object,
    headers?: object,
  ): Promise<Result<HttpResponse<T>, HttpError>> {
    if (schemaOrParams && 'parse' in schemaOrParams) {
      return this.call(
        () => this.#client.put(url, JSON.stringify(data), { params, headers }),
        schemaOrParams,
      );
    }
    return this.call(() =>
      this.#client.put(url, JSON.stringify(data), {
        params: schemaOrParams,
        headers,
      }),
    );
  }

  patch<T>(
    url: string,
    data: object,
    schemaOrParams?: ZodType | object,
    params?: object,
    headers?: object,
  ): Promise<Result<HttpResponse<T>, HttpError>> {
    if (schemaOrParams && 'parse' in schemaOrParams) {
      return this.call(
        () => this.#client.patch(url, JSON.stringify(data), { params, headers }),
        schemaOrParams,
      );
    }
    return this.call(() =>
      this.#client.patch(url, JSON.stringify(data), {
        params: schemaOrParams,
        headers,
      }),
    );
  }

  delete<T>(
    url: string,
    schemaOrData?: ZodType | object,
    dataOrParams?: object,
    paramsOrHeaders?: object,
    headers?: object,
  ): Promise<Result<HttpResponse<T>, HttpError>> {
    if (schemaOrData && 'parse' in schemaOrData) {
      return this.call(
        () =>
          this.#client.delete(url, {
            ...(dataOrParams ? { data: JSON.stringify(dataOrParams) } : {}),
            params: paramsOrHeaders,
            headers,
          }),
        schemaOrData,
      );
    }
    return this.call(() =>
      this.#client.delete(url, {
        ...(schemaOrData ? { data: JSON.stringify(schemaOrData) } : {}),
        params: dataOrParams,
        headers: paramsOrHeaders,
      }),
    );
  }

  setHeaders(headers: object): void {
    this.#client.defaults.headers.common = {
      ...this.#client.defaults.headers.common,
      ...headers,
    };
  }

  setAuthorization(token: string): void {
    this.#client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  addResponseInterceptor(
    onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    onRejected?: (error: unknown) => unknown,
  ): void {
    this.#client.interceptors.response.use(onFulfilled, onRejected);
  }

  private async call<T>(
    fn: () => Promise<HttpResponse<T>>,
    schema?: ZodType,
  ): Promise<Result<HttpResponse<T>, HttpError>> {
    try {
      const { data, status } = (await fn()) as AxiosResponse;

      let parsed;
      if (data === undefined || data === null) {
        parsed = {};
      } else if (typeof data === 'string') {
        parsed = JSON.parse(data);
      } else {
        parsed = data;
      }

      return new Ok<HttpResponse<T>, HttpError>({
        data: schema ? schema.parse(parsed) : parsed,
        status,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const errorResponse = error.response?.data;

        let rawErr: unknown;
        if (typeof errorResponse === 'string') {
          try {
            rawErr = JSON.parse(errorResponse);
          } catch {
            rawErr = errorResponse;
          }
        } else {
          rawErr = errorResponse;
        }

        const parsed = ErrorSchema.safeParse(rawErr);
        const err = parsed.success ? parsed.data : null;

        return new Err<HttpResponse<T>, HttpError>(
          new HttpError({
            code: error.status ?? HttpErrorCode.INTERNAL_SERVER_ERROR,
            message: err?.message ?? HttpErrorKey.INTERNAL_SERVER_ERROR,
            cause: err?.action,
            response: error.response,
            url: error.response?.config?.url,
          }),
        );
      }

      return new Err<HttpResponse<T>, HttpError>(
        new HttpError({
          code: HttpErrorCode.INTERNAL_SERVER_ERROR,
          message: `${error}`,
        }),
      );
    }
  }
}

const instances = new Map<string, AxiosClient>();

export const getInstance = ({ baseURL, withCredentials }: AxiosClientParams): HttpClient => {
  if (!instances.has(baseURL)) {
    instances.set(baseURL, new AxiosClient({ baseURL, withCredentials }));
  }

  return instances.get(baseURL) as HttpClient;
};

export const HTTP = new AxiosClient({ baseURL: import.meta.env.VITE_API_BASE_URL });
