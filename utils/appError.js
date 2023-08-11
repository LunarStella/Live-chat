class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    //status는 statusCode에 따라 다르다.
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    //opeation error 일 시에만 client에게 전달
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
