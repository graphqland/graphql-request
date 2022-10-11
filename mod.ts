// Copyright 2022-latest the graphqland authors. All rights reserved. MIT license.
// This module is browser compatible.

export { GraphQLRequest } from "./request.ts";
export {
  type GraphQLRequestOptions,
  type GraphQLRequestParams,
  type RequestOptions,
  type RequestParams,
} from "./types.ts";
export { gqlFetch } from "./fetch.ts";
export { ClientError, type ClientErrorParams } from "./error.ts";
export { gql } from "./utils.ts";
