import { FormattedExecutionResult, JsonValue } from "./deps.ts";
import { GraphQLRequest } from "./request.ts";
import { ClientError, ClientErrorParams } from "./error.ts";

/** GraphQL fetcher.
 *
 * @throws {TypeError} When DNS error, input is invalid URL or Header name is invalid.
 * @throws {SyntaxError} When parsing of the response body fails.
 * @throws {DOMException} When signal has been aborted.
 * @throws {ClientError} When the response was unsuccessful.
 *
 * @example
 * ```ts
 * import { gqlFetch } from "https://deno.land/x/gql_request@$VERSION/mod.ts";
 *
 * const query = `query {
 *   person(personID: "1") {
 *     name
 *   }
 * }`;
 * const { data, errors, extensions } = await gqlFetch<
 *   { person: { name: string } }
 * >("<ENDPOINT>", query);
 * ```
 */
export async function gqlFetch<
  Data extends JsonValue = { [k: string]: JsonValue },
  Extensions extends JsonValue = { [k: string]: JsonValue },
>(
  input: string | URL,
  query: string,
  requestInit?: RequestInit,
): Promise<FormattedExecutionResult<Data, Extensions>> {
  const request = new GraphQLRequest(input, query, requestInit);
  const response = await fetch(request);
  const contentType = response.headers.get("content-type");
  const params: ClientErrorParams = {
    request,
    response,
  };

  if (!response.ok) {
    throw new ClientError(
      params,
      `Request has failed. status: ${response.status}`,
    );
  }
  if (!contentType || !isSupportedMediaType(contentType)) {
    throw new ClientError(params, `Unsupported media type. ${contentType}`);
  }

  const body = await response.text();
  const result = JSON.parse(body) as FormattedExecutionResult<Data, Extensions>;

  return result;
}

function isSupportedMediaType(contentType: string): boolean {
  contentType = contentType
    .toLowerCase();

  return ["application/graphql-response+json", "application/json"]
    .some((header) => contentType.startsWith(header));
}
