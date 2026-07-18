function errorHandler(err, req, res, next) {
  let statusCode = err.status || 500;
  let message = "Internal server error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field === "email" ? "Email" : "Username"} is already in use`;
  }

  if (err.status) {
    message = err.message;
  }

  const timestamp = new Date().toISOString();

  if (statusCode >= 500) {
    console.error(
      `[${timestamp}] SYSTEM ERROR [${req.method}] ${req.url}:`,
      err.originalError || err,
    );
  } else {
    console.warn(`[${timestamp}] CLIENT WARNING [${req.method}] ${req.url}: ${message}`);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  });
}

export { errorHandler };
