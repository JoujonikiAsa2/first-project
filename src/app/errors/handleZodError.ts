import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

  //zod error handler
  export const handleZodError = (err: ZodError) : TGenericErrorResponse  => {
    const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
      return {
        //last index
        path: issue?.path[issue.path.length - 1],
        message: issue.message,
      };
    });
    const statusCode = 400;
    return {
      statusCode,
      message: 'Validation Error',
      errorSources,
    };
  };