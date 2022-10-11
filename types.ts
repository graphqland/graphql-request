/** GraphQL request options. */
export interface GraphQLRequestOptions {
  /** The name of the Operation in the Document to execute. */
  readonly operationName?: string;

  /** Values for any Variables defined by the Operation. */
  readonly variables?: Record<string, unknown>;

  /** This entry is reserved for implementors to extend the protocol however they see fit. */
  readonly extensions?: Record<string, unknown>;
}

/** GraphQL request parameters. */
export interface GraphQLRequestParams {
  /** A Document containing GraphQL Operations and Fragments to execute. */
  readonly query: string;
}

/** GraphQL-over-HTTP request parameters. */
export interface RequestParams extends GraphQLRequestParams {
  /** retrieve resource. */
  readonly input: string | URL;
}

/** GraphQL-over-HTTP request options. */
export interface RequestOptions extends GraphQLRequestOptions, RequestInit {}
