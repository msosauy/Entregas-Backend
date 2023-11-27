export default class CustomError {
  static createError({
    status = 500,
    message,
    cause,
    code = 1,
    name = "error",
  }) {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;
    error.status = status;
    throw error;
  }
}
