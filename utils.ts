// Copyright 2022-latest the graphqland authors. All rights reserved. MIT license.
// This module is browser compatible.

/** Shallow merge headers.
 * @param left Base headers.
 * @param right Priority headers in case of conflicts.
 * @throws {TypeError} Header name is invalid.
 */
export function shallowMergeHeaders(
  left?: HeadersInit | Headers,
  right?: HeadersInit | Headers,
): Headers {
  const leftHeader = new Headers(left);
  const rightHeader = new Headers(right);
  rightHeader.forEach((value, key) => {
    leftHeader.set(key, value);
  });

  return leftHeader;
}

/** Shallow merge init.
 * @param left
 * @param right
 * @throws {TypeError} Header name is invalid.
 */
export function shallowMergeInit<
  T extends { headers?: HeadersInit },
>(left: T, right: T): T {
  const headers = shallowMergeHeaders(left.headers, right.headers);

  return {
    ...left,
    ...right,
    headers,
  };
}

/** Compress GraphQL document.
 * @param document Graphql document.
 *
 * @example
 * ```ts
 * import { gql } from "https://deno.land/x/gql_request@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const document = gql`query Test {
 *   hello
 * }`;
 * assertEquals(document, "query Test{hello}");
 * ```
 */
export function gql(document: TemplateStringsArray): string {
  return document.reduce((acc, cur) => acc + cleanQuery(cur), "");
}

function cleanQuery(query: string): string {
  return query
    // remove multiple whitespace
    .replace(/\s+/g, " ")
    // remove all whitespace between everything except for word and word boundaries
    .replace(/(\B)\s(\B)|(\b)\s(\B)|(\B)\s(\b)/gm, "")
    .trim();
}
