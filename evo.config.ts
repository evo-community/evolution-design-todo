import {
  defineConfig,
  abstraction,
  dependenciesDirection,
  noUnabstractionFiles,
  requiredChildren,
  restrictCrossImports,
  publicAbstraction,
} from "evolution-design";
import { basename, dirname } from "path";
import { camelCase, capitalize } from "lodash";

const pageTemplte = `export function Page() {
  return <div>Page</div>
}
`;
const pageIndexTemplate = (path: string) => `export { Page as ${capitalize(
  camelCase(basename(dirname(path)))
)}Page } from './page'
`;

const page = abstraction("page", {
  children: {
    "index.ts": abstraction("public-api", {
      fileTemplate: pageIndexTemplate,
    }),
    "page.tsx": abstraction("page", {
      fileTemplate: pageTemplte,
    }),
  },
  rules: [publicAbstraction("public-api"), requiredChildren()],
});

const mod = abstraction("mod", {
  children: {
    "index.ts": abstraction("public-api"),
  },
  rules: [publicAbstraction("public-api"), requiredChildren()],
});

const app = abstraction("app");
const pages = abstraction("pages", {
  children: {
    "*": page,
  },
  rules: [restrictCrossImports()],
});
const modules = abstraction("modules", {
  children: {
    "*": mod,
  },
  rules: [restrictCrossImports()],
});
const shared = abstraction("shared");

const root = abstraction("root", {
  children: {
    app,
    pages,
    modules,
    shared,
  },
  rules: [
    dependenciesDirection(["app", "pages", "modules", "shared"]),
    noUnabstractionFiles(),
    requiredChildren(),
  ],
});

export default defineConfig({
  root,
  baseUrl: "./src",
});
