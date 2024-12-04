import { HttpErrorResponse } from "@angular/common/http";
import { Errors } from "src/app/_models/forms/formTypes";


/**
 * Represents a bad request error response from an HTTP request.
 * This class is used to handle and parse the error response,
 * categorizing it into either a validation error or a general bad request.
 */
export class BadRequest {
  type: Errors;
  message?: string;
  validationErrors: string[] = [];
  error: HttpErrorResponse;

  constructor(error: HttpErrorResponse) {
    this.error = error;
    this.message = error.error;
    if (error.error.errors) {
      this.type = "ValidationError";
      const modalStateErrors = [];
      for (const key in error.error.errors) {
        if (error.error.errors[key]) {
          modalStateErrors.push(error.error.errors[key]);
        }
      }
      this.validationErrors = modalStateErrors.flat();
    } else {
      this.type = "BadRequest";
    }
  }
}
