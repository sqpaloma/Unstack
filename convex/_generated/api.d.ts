/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analysis from "../analysis.js";
import type * as assessments from "../assessments.js";
import type * as lib_detector from "../lib/detector.js";
import type * as lib_detector_additions from "../lib/detector_additions.js";
import type * as lib_firecrawl from "../lib/firecrawl.js";
import type * as lib_firecrawl_priority_files from "../lib/firecrawl_priority_files.js";
import type * as plans from "../plans.js";
import type * as progress from "../progress.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analysis: typeof analysis;
  assessments: typeof assessments;
  "lib/detector": typeof lib_detector;
  "lib/detector_additions": typeof lib_detector_additions;
  "lib/firecrawl": typeof lib_firecrawl;
  "lib/firecrawl_priority_files": typeof lib_firecrawl_priority_files;
  plans: typeof plans;
  progress: typeof progress;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
