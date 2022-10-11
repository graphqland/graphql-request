import { BuildOptions } from "https://deno.land/x/dnt@0.31.0/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  typeCheck: true,
  entryPoints: ["./mod.ts"],
  compilerOptions: {
    lib: ["esnext", "dom"],
  },
  outDir: "./npm",
  package: {
    name: "@graphqland/graphql-request",
    version,
    description: "Minimal Graphql client compliant with Graphql-over-HTTP",
    keywords: [
      "graphql",
      "gql",
      "fetch",
      "request",
      "response",
      "http",
      "https",
    ],
    license: "MIT",
    homepage: "https://github.com/graphqland/graphql-request",
    repository: {
      type: "git",
      url: "git+https://github.com/graphqland/graphql-request.git",
    },
    bugs: {
      url: "https://github.com/graphqland/graphql-request/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: {
      access: "public",
    },
    devDependencies: {
      "graphql": "^16",
    },
  },
  packageManager: "pnpm",
  mappings: {
    "https://esm.sh/v96/graphql@16.6.0": {
      name: "graphql",
      version: "^16",
      peerDependency: true,
    },
  },
});
