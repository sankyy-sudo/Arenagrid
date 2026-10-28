import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { Header } from "../src/ui/components/Header";
import { Footer } from "../src/ui/components/Footer";
import { HomePage } from "../src/ui/pages/HomePage";
import { getResourceDef } from "../src/admin/resourceConfig";
import { adminModules, publicRoutes } from "../shared/types";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { matchRoutes } from "react-router-dom";
import { Prisma } from "@prisma/client";

test("Resources is absent from public navigation, homepage and CMS lookup", () => {
  const markup = renderToStaticMarkup(createElement(MemoryRouter, null,
    createElement(Header), createElement(HomePage), createElement(Footer)));
  assert.doesNotMatch(markup, /href="\/resources(?:[/?#"])/);
  assert.doesNotMatch(markup, /resource-grid|resources-section|>Resources</);
  for (const path of ["/products", "/sports", "/services", "/projects", "/contact"]) {
    assert.ok(markup.includes(`href="${path}"`), path);
  }
  assert.equal(getResourceDef("resources"), undefined);
  assert.ok(!publicRoutes.some((path: string) => path === "/resources"));
  assert.ok(!adminModules.some((module: string) => module === "resources"));
});

test("the actual public route declarations do not match the retired Resources URLs", () => {
  const source = ts.createSourceFile("main.tsx",
    readFileSync(new URL("../src/main.tsx", import.meta.url), "utf8"),
    ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const paths: string[] = [];
  function visit(node: ts.Node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(source) === "path"
      && ts.isStringLiteral(node.initializer)) {
      paths.push(`/${node.initializer.text.replace(/^\//, "")}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.deepEqual([...paths].sort(), [...publicRoutes].sort());
  const routes = paths.map((path) => ({ path }));
  for (const path of ["/resources", "/resources/", "/resources/old-guide"]) {
    assert.equal(matchRoutes(routes, path), null, path);
  }
  assert.ok(matchRoutes(routes, "/products"));
});

test("the generated Prisma data model has no Resources model or relationships", () => {
  const models = Prisma.dmmf.datamodel.models;
  assert.ok(!models.some((model) => model.name === "Resource"));
  for (const model of models) {
    assert.ok(!model.fields.some((field) => field.type === "Resource"), model.name);
  }
});
