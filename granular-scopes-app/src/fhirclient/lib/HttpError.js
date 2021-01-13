"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class HttpError extends Error {
  constructor(message = "Unknown error", statusCode = 0, statusText = "Error", body = null) {
    super(message);
    this.message = message;
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.status = statusCode;
    this.statusText = statusText;
    this.body = body;
  }

  toJSON() {
    return {
      name: this.name,
      statusCode: this.statusCode,
      status: this.status,
      statusText: this.statusText,
      message: this.message,
      body: this.body
    };
  }

}

exports.default = HttpError;