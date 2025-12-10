/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as classes from "../classes.js";
import type * as exams from "../exams.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as professors from "../professors.js";
import type * as questionBanks from "../questionBanks.js";
import type * as questions from "../questions.js";
import type * as router from "../router.js";
import type * as students from "../students.js";
import type * as submissions from "../submissions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  classes: typeof classes;
  exams: typeof exams;
  http: typeof http;
  migrations: typeof migrations;
  professors: typeof professors;
  questionBanks: typeof questionBanks;
  questions: typeof questions;
  router: typeof router;
  students: typeof students;
  submissions: typeof submissions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
