import { FormUse } from "src/app/_models/forms/formTypes";

/**
 * Options for submitting a form.
 *
 * @property {FormUse} use - Specifies the form usage context.
 * @property {any} value - The value to be submitted.
 * @property {number} id - The identifier for the submission.
 * @property {string} redirectUrl - The URL to redirect to after submission.
 * @property {boolean} useIdAfterResponseForRedirect - Indicates whether to use the response ID for redirection.
 * @property {string} toastMessage - The message to display in a toast notification.
 */
export interface SubmitOptions {
  use?: FormUse;
  id?: number;
  value?: any;
  redirectUrl?: string;
  useIdAfterResponseForRedirect?: boolean;
  toastMessage?: string;
}
