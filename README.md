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
const request = new GraphQLRequest("https://graphql.org/swapi-graphql", query);

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
const request = new GraphQLRequest("https://graphql.org/swapi-graphql", query, {
  variables: {
    id: "1",
  },
});
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
const request = new GraphQLRequest("https://graphql.org/swapi-graphql", query, {
  method: "GET",
});
assertEquals(request.url, "https://graphql.org/swapi-graphql?query=query...");
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

## License

Copyright © 2022-present [graphqland](https://github.com/graphqland).

Released under the [MIT](./LICENSE) license
