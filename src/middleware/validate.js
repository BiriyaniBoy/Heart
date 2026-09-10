import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

/** Runs after express-validator check(...) chains; turns failures into a 400. */
export function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const details = result.array().map((e) => `${e.path}: ${e.msg}`);
    return next(new ApiError(400, details.join("; ")));
  }
  next();
}
