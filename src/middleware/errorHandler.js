/**
 * Centralized error handler. Express 5 automatically forwards rejected
 * promises from async route handlers here, so controllers can stay plain
 * `async (req, res) => {...}` with no try/catch boilerplate.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details;

  if (err.name === "ValidationError" && err.errors) {
    // Mongoose schema validation failure
    statusCode = 400;
    details = Object.values(err.errors).map((e) => e.message);
    message = "Validation failed";
  } else if (err.name === "CastError") {
    // Malformed ObjectId, etc.
    statusCode = 400;
    message = `Invalid value for "${err.path}"`;
  } else if (err.code === 11000) {
    // Duplicate key
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    message = `A record with that ${field} already exists`;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired, please log in again";
  } else if (err.name === "MulterError") {
    statusCode = 400;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}
