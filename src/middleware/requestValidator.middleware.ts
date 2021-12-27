import { NextFunction, Request, Response } from "express";
import { validateSync } from "class-validator";
import { plainToClass } from "class-transformer";
import BadRequest from "../error/BadRequest.error";
import BaseDTO from "../dto/Base.dto";

const validateRequest = (DtoClass: any) => {
  return (req: Request, _: Response, next?: NextFunction) => {
    try {
      if (!(DtoClass instanceof BaseDTO)) {
        const invalidParams = [];
        const requestParams = req.params;
        if (DtoClass.inParams) {
          for (const param of DtoClass.inParams) {
            if (requestParams[param.name]) {
              if (param.type == "number") {
                if (parseInt(requestParams[param.name]) == NaN) {
                  invalidParams.push({
                    from: "inParams",
                    name: param.name,
                    value: requestParams[param.name],
                    error: `Excepted type ${
                      param.type
                    } but found ${typeof requestParams[param.name]}`,
                  });
                }
              } else if (typeof requestParams[param.name] != param.type) {
                invalidParams.push({
                  from: "inParams",
                  name: param.name,
                  value: requestParams[param.name],
                  error: `Excepted type ${
                    param.type
                  } but found ${typeof requestParams[param.name]}`,
                });
              }
            } else {
              invalidParams.push({
                from: "inParams",
                name: param.name,
                error: `${param.name} is not exist in request params`,
              });
            }
          }
        }

        if (invalidParams.length) {
          const err = new BadRequest("Bad Request! Invalid request params");
          err.invalidParams = invalidParams;
          err.requestBody = requestParams;
          next(err);
        } else {
          next();
        }
      }

      let requestParams = req.body;
      let validationFrom = "body"; // Validation check in body

      // If req body is empty
      if (!Object.keys(req.body).length) {
        // if query is not empty
        if (Object.keys(req.query).length) {
          requestParams = req.query;
          validationFrom = "query"; // Validation check only in query
        } else {
          validationFrom = "body-and-query"; // Validation check in both query and body
        }
      }

      const requestDto = plainToClass(DtoClass, requestParams);

      const errors = validateSync(requestDto);

      if (errors.length) {
        let invalidParams = [];
        for (const error of errors) {
          invalidParams = invalidParams.concat(error.constraints);
        }

        const err = new BadRequest("Bad Request! Invalid request params");
        err.invalidParams = invalidParams;
        err.requestBody = requestParams;
        err.validationFrom = validationFrom;
        next(err);
      }
    } catch (e) {
      console.log("Error in request validator middleware");
      console.error(e);
    }

    next();
  };
};

export default validateRequest;
