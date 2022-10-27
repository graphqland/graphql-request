// Copyright 2022-latest the graphqland authors. All rights reserved. MIT license.
// This module is browser compatible.

/** Client error parameters. */
export interface ClientErrorParams {
  /** Actual request. */
  readonly request: Request;

  /** Actual response. */
  readonly response: Response;
}

/** GraphQL client error. */
export class ClientError extends Error {
  request: Request;
  response: Response;

  constructor(
    params: ClientErrorParams,
    message?: string,
    options?: ErrorOptions,
  ) {
    super(message, options);

    this.request = params.request;
    this.response = params.response;
  }

  override name = "ClientError";
}
