/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SafeActionResult } from "next-safe-action";

// Utility type to extract the Data type from SafeActionResult
type ExtractActionData<T> =
  T extends SafeActionResult<any, any, any, any, any, infer Data, any>
    ? Data
    : never;

// Utility type to extract the awaited data from a function
export type ExtractActionSucessData<T extends (...args: any[]) => any> =
  ExtractActionData<Awaited<ReturnType<T>>>;
