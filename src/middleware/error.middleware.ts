import { Request, Response, NextFunction } from "express";
import HttpError from "../error/HttpError";

const errorMiddleware = (
  err,
  req: Request,
  res: Response,
  next?: NextFunction
) => {
  if (err instanceof HttpError) {
    const httpError: HttpError = <HttpError>err;

    res.status(httpError.statusCode).json({
      error: {
        statusCode: httpError.statusCode,
        message: err.message,
      },
    });

    return;
  }

  res.status(500).json({
    error: {
      statusCode: 500,
      message: err.message,
    },
  });
};

export default errorMiddleware;
