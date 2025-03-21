import { jsPDFOptions } from "jspdf";
import { Options as Html2CanvasOptions } from "html2canvas";

/**
 * Configuration options for generating and downloading a prescription PDF.
 *
 * @interface DownloadPrescriptionOptions
 *
 * @property {string | (() => string)} [fileName]
 *    Specifies the name for the downloaded PDF file.
 *    - Accepts either:
 *      - A string template supporting date/time variables.
 *      - A function that returns the generated filename.
 *    - Default format: `${patientName}_${YYYYMMDD}.pdf`.
 *
 * @property {jsPDFOptions} [pdfOptions]
 *    Configuration options for the PDF generation process.
 *    - Merges with default settings:
 *      `{ orientation: 'l', unit: 'mm', format: [297, 210] }`.
 *
 * @property {Html2CanvasOptions} [html2canvasOptions]
 *    Settings for the HTML-to-canvas conversion process.
 *    - Extends default options:
 *      `{ scale: 3, useCORS: true, logging: true }`.
 */
export interface DownloadPrescriptionOptions {
  fileName?: string | (() => string);
  pdfOptions?: jsPDFOptions;
  html2canvasOptions?: Html2CanvasOptions;
}
