// Copyright 2022-latest the graphqland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { mergeInit } from "./utils.ts";
import {
  GraphQLRequestOptions,
  GraphQLRequestParams,
  RequestOptions,
  RequestParams,
} from "./types.ts";

const ACCEPT =
    "application/graphql-response+json;charset=UTF-8,application/json;charset=UTF-8",
  CONTENT_TYPE = "application/json;charset=UTF-8",
  DEFAULT_METHOD = "POST";

/** `Request` object with GraphQL request parameters.
 * @throws {TypeError} When the input is Invalid URL or Header name is invalid.
 *
 * @example
 * ```ts
 * import { GraphQLRequest } from "https://deno.land/x/gql_request@$VERSION/mod.ts";
 *
 * const query = `query {
 *   person(personID: "1") {
 *     name
 *   }
 * }`;
 * const request = new GraphQLRequest("https://graphql.org/swapi-graphql", query);
 * fetch(request);
 * ```
 */
export class GraphQLRequest extends Request {
  constructor(
    input: string | URL,
    query: string,
    options?: RequestOptions,
  ) {
    const {
      method = DEFAULT_METHOD,
      extensions,
      operationName,
      variables,
      ...rest
    } = options ?? {};
    const [url, init] = createRequestInit({ input, query, method }, {
      extensions,
      operationName,
      variables,
    });

    const requestInit = mergeInit(init, rest);

    super(url, requestInit);
  }
}

/**
 * @throws {TypeError}
 */
function createRequestInit(
  { input, query, method }: RequestParams & { method: string },
  { variables, operationName, extensions }: GraphQLRequestOptions,
): [url: string | URL, requestInit: RequestInit] {
  switch (method) {
    case "GET": {
      const url = addQueryString(input, {
        query,
        operationName,
        variables,
        extensions,
      });

      const requestInit: RequestInit = {
        method,
        headers: {
          Accept: ACCEPT,
        },
      };

      return [url, requestInit];
    }
    case "POST": {
      const body = JSON.stringify({
        query,
        variables,
        operationName,
        extensions,
      });
      const headers: HeadersInit = {
        "content-type": CONTENT_TYPE,
        accept: ACCEPT,
      };
      const requestInit: RequestInit = {
        method,
        body,
        headers,
      };

      return [input, requestInit];
    }
    default: {
      return [input, {}];
    }
  }
}

/**
 * @throws {TypeError}
 */
function addQueryString(
  url: string | URL,
  { query, variables, operationName, extensions }:
    & GraphQLRequestParams
    & GraphQLRequestOptions,
): URL {
  url = new URL(url);
  url.searchParams.set("query", query);

  if (variables) {
    const data = JSON.stringify(variables);
    url.searchParams.set("variables", data);
  }
  if (operationName) {
    url.searchParams.set("operationName", operationName);
  }
  if (extensions) {
    const data = JSON.stringify(extensions);
    url.searchParams.set("extensions", data);
  }

  return url;
}
