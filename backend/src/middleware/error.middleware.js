const errorHandler = (err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err.stack || err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Server error",
  });
};

export { errorHandler };
