export * from "https://deno.land/std@0.159.0/testing/asserts.ts";
export * from "https://deno.land/std@0.159.0/testing/bdd.ts";
export { expect } from "https://deno.land/x/unitest@v1.0.0-beta.82/mod.ts";
import { equalsRequest } from "https://deno.land/x/http_utils@1.0.0-beta.5/mod.ts";
import { AssertionError } from "https://deno.land/std@0.150.0/testing/asserts.ts";

export async function assertEqualsRequest(
  actual: Request,
  expected: Request,
  message?: string,
): Promise<void> {
  if (!await equalsRequest(actual, expected)) {
    throw new AssertionError(
      message ??
        `Not equal request.
  actual:
    ${Deno.inspect(actual)}
  expected:
    ${Deno.inspect(expected)}`,
    );
  }
}
