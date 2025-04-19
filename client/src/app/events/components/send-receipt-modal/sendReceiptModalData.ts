export interface SendReceiptModalData {
  title: string;
  patientEmail: string;
}

export interface SendReceiptModalResult {
  success: boolean;
  email?: string;
}