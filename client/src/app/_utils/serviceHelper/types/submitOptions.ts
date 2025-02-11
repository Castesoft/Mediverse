import { FormUse } from "src/app/_models/forms/formTypes";

/**
 * Options for submitting a form.
 *
 * @property {FormUse} use - Specifies the form usage context.
 * @property {any} value - The value to be submitted.
 * @property {number} id - The identifier for the submission.
 */
type SubmitOptions = {
  use: FormUse;
  value: any;
  id: number;
}

export default SubmitOptions;
