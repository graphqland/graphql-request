# graphql-request

Minimal GraphQL client compliant with GraphQL-over-HTTP

## GraphQL request built on `Request` object

GraphQLRequest is almost the same as the `Request` object. You create a
`Request` instance by passing GraphQL parameters to the constructor.

```ts
import { GraphQLRequest } from "https://deno.land/x/gql_request@$VERSION/mod.ts";

const query = `query {
  person(personID: "1") {
    name
  }
}`;
const request = new GraphQLRequest(
  "https://swapi-graphql.netlify.app/.netlify/functions/index",
  query,
);

fetch(request);
```

It is fully compatible with the `Request` object, so the constructor accepts all
options.

### GraphQL request options

GraphQL-over-HTTP allows the following values as GraphQL request options:

| Name          |      Required      | Description                                                                          |
| ------------- | :----------------: | ------------------------------------------------------------------------------------ |
| query         | :white_check_mark: | A Document containing GraphQL Operations and Fragments to execute.                   |
| variables     |                    | Values for any Variables defined by the Operation.                                   |
| operationName |                    | The name of the Operation in the Document to execute.                                |
| extensions    |                    | This entry is reserved for implementors to extend the protocol however they see fit. |

Example specifying variables:

```ts
import { GraphQLRequest } from "https://deno.land/x/gql_request@$VERSION/mod.ts";

const query = `query PersonQuery($id: ID!) {
  person(personID: $id) {
    name
  }
}`;
const request = new GraphQLRequest(
  "https://swapi-graphql.netlify.app/.netlify/functions/index",
  query,
  {
    variables: {
      id: "1",
    },
  },
);
```

### Request init options

`GraphQLRequest` accepts all `RequestInit` options.

By default, the HTTP method of the `Request` is set to `POST`.

The GraphQL-over-HTTP specification states that a GraphQL server must support
the `POST` and `GET` methods.

Therefore, `GraphQLRequest` also supports the `GET` method. For `GET`, set the
GraphQL request option as a query string.

```ts
import { GraphQLRequest } from "https://deno.land/x/gql_request@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const query = `query {
  person(personID: "1") {
    name
  }
}`;
const request = new GraphQLRequest(
  "https://swapi-graphql.netlify.app/.netlify/functions/index",
  query,
  {
    method: "GET",
  },
);
assertEquals(
  request.url,
  "https://swapi-graphql.netlify.app/.netlify/functions/index?query=query...",
);
```

### GET or POST

GraphQL-over-HTTP is not very explicit about the use of different methods.

However, the following indicators are helpful

- If the GraphQL request is not a `query`, it should be a `POST`. [MUST]
- `GET` if the length of the request URL is less than or equal to the limit of
  the server implementation. [SHOULD]

HTTP GET methods are cacheable and should be used with `GET` if available.

However, since `POST` is safe to use in all situations, the `POST` method is set
by default.

### Throwing

The constructor may throw an error under the same conditions as a `Request`
object. It may throw errors.

```ts
import { GraphQLRequest } from "https://deno.land/x/gql_request@$VERSION/mod.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

assertThrows(() => new GraphQLRequest("", ""), TypeError, "Invalid URL");
```

## Fetch GraphQL

Supports GraphQL-specific fetch functions.

It conforms to the GraphQL-over-HTTP specification and supports the following
media types.

- application/graphql-response+json
- application/json

properly handles HTTP response statuses and accepts generics types.

It also has an API similar to `fetch` and can be fully customized with
`RequestInit`.

```ts
import { gqlFetch } from "https://deno.land/x/gql_request@$VERSION/mod.ts";

const query = `query {
  person(personID: "1") {
    name
  }
}`;
const { data, errors, extensions } = await gqlFetch<
  { person: { name: string } }
>("https://swapi-graphql.netlify.app/.netlify/functions/index", query);
```

### Throwing Error

It may throw the following errors:

| Name         | Condition                                                       |
| ------------ | --------------------------------------------------------------- |
| TypeError    | When DNS error, input is invalid URL or Header name is invalid. |
| SynTaxError  | When parsing of the response body fails.                        |
| DOMException | When signal has been aborted.                                   |
| ClientError  | When the response was unsuccessful.                             |

#### Client error

Client errors are thrown when the response status is not `2XX` or the response
media type is unsupported.

Client errors contain `request` and `response` data, allowing detailed analysis
of the actual request and response.

## Compress document

Provides utilities to compress GraphQL documents. It simply removes extra
characters from the GraphQL document.

Compressing documents reduces bandwidth and increases the operational
feasibility of the HTTP `GET` method.

```ts
import { gql } from "https://deno.land/x/gql_request@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";

const document = gql`query Test {
  hello
}`;
assertEquals(document, "query Test{hello}");
```

## License

Copyright © 2022-present [graphqland](https://github.com/graphqland).

Released under the [MIT](./LICENSE) license
