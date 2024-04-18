class ApiError extends Error {
  constructor(
    statuscode,
    message = "somthing went wrong",
    error = [],
    stack = ""
  ) {
    super(message);
    (this.statuscode = statuscode),
      (this.error = error),
      (this.message = message),
      (this.success = false),
      (this.data = null);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default ApiError;
