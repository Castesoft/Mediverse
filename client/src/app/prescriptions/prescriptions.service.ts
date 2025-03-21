import { Injectable } from "@angular/core";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { Prescription } from "src/app/_models/prescriptions/prescription";
import { PrescriptionParams } from "src/app/_models/prescriptions/prescriptionParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { prescriptionColumns, prescriptionDictionary } from "src/app/_models/prescriptions/prescriptionConstants";
import html2canvas from "html2canvas";
import jsPDF, { jsPDFOptions } from "jspdf";
import { PrintPrescriptionOptions } from "src/app/prescriptions/printPrescriptionOptions.model";
import { DownloadPrescriptionOptions } from "src/app/prescriptions/downloadPrescriptionOptions.model";
import { formatFilename } from "src/app/_utils/util";

@Injectable({
  providedIn: 'root',
})
export class PrescriptionsService extends ServiceHelper<Prescription, PrescriptionParams, FormGroup2<PrescriptionParams>> {
  constructor() {
    super(PrescriptionParams, 'prescriptions', prescriptionDictionary, prescriptionColumns);
  }

  async export(item: Prescription, element: HTMLElement, action: 'print' | 'download') {
    if (action === 'download') {
      await this.downloadPrescription(item, element);
    } else {
      await this.printPrescription(element);
    }
  }

  private async printPrescription(element: HTMLElement, options: PrintPrescriptionOptions = {}): Promise<void> {
    const defaultOptions = {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: true,
      letterRendering: true,
      windowWidth: 1024,
      ...options.html2canvasOptions
    };

    const canvas: HTMLCanvasElement = await html2canvas(element, defaultOptions);
    const imgData: string = canvas.toDataURL('image/png');
    const printWindow: Window | null = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(`
          <html lang="es">
            <head>
              <title>${options.printTitle || 'Imprimir Receta'}</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                img { max-width: 100%; max-height: 100%; }
              </style>
            </head>
            <body>
              <img src="${imgData}" alt="receta" />
            </body>
          </html>
        `);
      printWindow.document.close();
      printWindow.focus();

      await new Promise<void>((resolve) => {
        printWindow.onload = () => {
          printWindow.print();
          printWindow.onafterprint = () => {
            printWindow.close();
            resolve();
          };
        };
      });
    }
  }

  private async downloadPrescription(prescription: Prescription, element: HTMLElement, options: DownloadPrescriptionOptions = {}): Promise<void> {
    const defaultCanvasOptions = {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: true,
      windowWidth: 1024,
      ...options.html2canvasOptions
    };

    const defaultPdfOptions: jsPDFOptions = {
      orientation: 'l',
      unit: 'mm',
      ...options.pdfOptions
    };

    const canvas: HTMLCanvasElement = await html2canvas(element, defaultCanvasOptions);
    const pdf = new jsPDF(defaultPdfOptions);

    const imgData: string = canvas.toDataURL('image/png');

    pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), '', 'FAST');

    let fileName;
    if (typeof options.fileName === 'function') {
      fileName = options.fileName();
    } else {
      fileName = options.fileName || this.getPrescriptionFileName(prescription);
    }

    pdf.save(`${fileName}.pdf`);
  }

  private getPrescriptionFileName(prescription: Prescription): string {
    const baseName: string = prescription.patient?.fullName || 'receta';
    const date: string = new Date(prescription.date || Date.now())
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');

    return formatFilename(`${baseName}_${date}`);
  }
}
