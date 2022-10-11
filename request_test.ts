import { GraphQLRequest } from "./request.ts";
import {
  assertEquals,
  assertEqualsRequest,
  assertThrows,
  describe,
  it,
} from "./dev_deps.ts";

const input = "http://localhost:8000";
const document = `query{test}`;

describe("GraphQLRequest", () => {
  describe("HTTP GET", () => {
    it("should contain query string and accept header", async () => {
      const request = new GraphQLRequest(input, document, { method: "GET" });

      await assertEqualsRequest(
        request,
        new Request(`http://localhost:8000/?query=query%7Btest%7D`, {
          headers: {
            accept:
              "application/graphql-response+json;charset=UTF-8,application/json;charset=UTF-8",
          },
        }),
      );
    });

    it("should contain variables in query string", async () => {
      const request = new GraphQLRequest(input, document, {
        method: "GET",
        variables: {
          a: "1",
        },
      });

      await assertEqualsRequest(
        request,
        new Request(
          `http://localhost:8000/?query=query%7Btest%7D&variables=%7B%22a%22%3A%221%22%7D`,
          {
            headers: {
              accept:
                "application/graphql-response+json;charset=UTF-8,application/json;charset=UTF-8",
            },
          },
        ),
      );
    });

    it("should contain operationName in query string", async () => {
      const request = new GraphQLRequest(input, document, {
        method: "GET",
        operationName: "NameQuery",
      });

      await assertEqualsRequest(
        request,
        new Request(
          `http://localhost:8000/?query=query%7Btest%7D&operationName=NameQuery`,
          {
            headers: {
              accept:
                "application/graphql-response+json;charset=UTF-8,application/json;charset=UTF-8",
            },
          },
        ),
      );
    });

    it("should contain extensions in query string", async () => {
      const request = new GraphQLRequest(input, document, {
        method: "GET",
        extensions: { a: "0" },
      });

      await assertEqualsRequest(
        request,
        new Request(
          `http://localhost:8000/?query=query%7Btest%7D&extensions=%7B%22a%22%3A%220%22%7D`,
          {
            headers: {
              accept:
                "application/graphql-response+json;charset=UTF-8,application/json;charset=UTF-8",
            },
          },
        ),
      );
    });

    it("should override header", async () => {
      const request = new GraphQLRequest(input, document, {
        method: "GET",
        headers: { "x-custom": "test" },
      });

      await assertEqualsRequest(
        request,
        new Request(`http://localhost:8000/?query=query%7Btest%7D`, {
          headers: {
            accept:
              "application/graphql-response+json;charset=UTF-8,application/json;charset=UTF-8",
            "x-custom": "test",
          },
        }),
      );
    });
  });

  describe("HTTP POST", () => {
    it("should contain query in body and equal header", async () => {
      const request = new GraphQLRequest(input, document);

      await assertEqualsRequest(
        request,
        new Request(input, {
          headers: {
            accept:
              "application/graphql-response+json;charset=UTF-8,application/json;charset=UTF-8",
            "content-type": "application/json;charset=UTF-8",
          },
          body: `{"query":"query{test}"}`,
          method: "POST",
        }),
      );
    });

    it("should contain query and variables in body", async () => {
      const request = new GraphQLRequest(input, document, {
        variables: { a: "0" },
      });

      await assertEqualsRequest(
        request,
        new Request(input, {
          headers: {
            accept:
              "application/graphql-response+json;charset=UTF-8,application/json;charset=UTF-8",
            "content-type": "application/json;charset=UTF-8",
          },
          body: `{"query":"query{test}","variables":{"a":"0"}}`,
          method: "POST",
        }),
      );
    });

    it("should contain query and operationName in body", async () => {
      const request = new GraphQLRequest(input, document, {
        operationName: "Query",
      });

      await assertEqualsRequest(
        request,
        new Request(input, {
          headers: {
            accept:
              "application/graphql-response+json;charset=UTF-8,application/json;charset=UTF-8",
            "content-type": "application/json;charset=UTF-8",
          },
          body: `{"query":"query{test}","operationName":"Query"}`,
          method: "POST",
        }),
      );
    });

    it("should contain query and operationName in body", async () => {
      const request = new GraphQLRequest(input, document, {
        extensions: { a: "a", b: undefined },
      });

      await assertEqualsRequest(
        request,
        new Request(input, {
          headers: {
            accept:
              "application/graphql-response+json;charset=UTF-8,application/json;charset=UTF-8",
            "content-type": "application/json;charset=UTF-8",
          },
          body: `{"query":"query{test}","extensions":{"a":"a"}}`,
          method: "POST",
        }),
      );
    });
  });

  it("should throw error when the input is invalid url", () => {
    assertThrows(() => new GraphQLRequest("", ""), TypeError, "Invalid URL");
  });

  it("should throw error when the header name is invalid", () => {
    assertThrows(
      () => new GraphQLRequest(input, "", { headers: { "?": "" } }),
      TypeError,
      "Header name is not valid.",
    );
  });

  it("should pass example", () => {
    const query = `query {
      person(personID: "1") {
        name
      }
    }`;
    const request = new GraphQLRequest(
      "https://graphql.org/swapi-graphql",
      query,
      {
        method: "GET",
      },
    );
    assertEquals(
      request.url,
      "https://graphql.org/swapi-graphql?query=query+%7B%0A++++++person%28personID%3A+%221%22%29+%7B%0A++++++++name%0A++++++%7D%0A++++%7D",
    );
  });
});
