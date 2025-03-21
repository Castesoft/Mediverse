import { Options as Html2CanvasOptions } from "html2canvas";

/**
 * Configuration options for printing a prescription.
 *
 * @interface PrintPrescriptionOptions
 *
 * @property {string} [printTitle]
 *    Title displayed in the print dialog and browser tab.
 *    - Default format: `${patientName}_${YYYYMMDD}`.
 *
 * @property {Html2CanvasOptions} [html2canvasOptions]
 *    Configuration options for the HTML-to-canvas conversion process.
 *    - Extends default settings:
 *      `{ scale: 3, useCORS: true, logging: true }`.
 */
export interface PrintPrescriptionOptions {
  printTitle?: string;
  html2canvasOptions?: Html2CanvasOptions;
}
