export interface Result<T, E> {
  isOk(): this is Ok<T, E>;
  isErr(): this is Err<T, E>;
  getOrElse(orElse: (error: E) => T): T;
  fold<S>(onSuccess: (success: T) => S, onError: (error: E) => S | void): S | void;
  map<S>(fun: (success: T) => S): Result<S, E>;
  flatMap<S>(fun: (success: T) => Result<S, E>): Result<S, E>;
}

export class Ok<T, E> implements Result<T, E> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }

  toString(): string {
    return `Result.Ok(${this.value})`;
  }

  getOrElse(_: (error: E) => T): T {
    return this.value;
  }

  fold<S>(onSuccess: (success: T) => S, _: (error: E) => S | void): S | void {
    return onSuccess(this.value);
  }

  map<S>(fun: (success: T) => S): Result<S, E> {
    return new Ok(fun(this.value));
  }

  flatMap<S>(fun: (success: T) => Result<S, E>): Result<S, E> {
    return fun(this.value);
  }
}

export class Err<T, E> implements Result<T, E> {
  readonly value: E;

  constructor(value: E) {
    this.value = value;
  }

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }

  toString(): string {
    return `Result.error(${this.value})`;
  }

  getOrElse(orElse: (error: E) => T): T {
    return orElse(this.value);
  }

  fold<S>(_: (success: T) => S, onError: (error: E) => S | void): S | void {
    return onError(this.value);
  }

  map<S>(_: (success: T) => S): Result<S, E> {
    return new Err(this.value);
  }

  flatMap<S>(_: (success: T) => Result<S, E>): Result<S, E> {
    return new Err(this.value);
  }
}
