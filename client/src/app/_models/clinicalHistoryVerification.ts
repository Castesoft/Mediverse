export class ClinicalHistoryVerification {
  hasAccess: boolean;
  consentGrantedAt?: Date;

  constructor(hasAccess: boolean, consentGrantedAt?: Date) {
    this.hasAccess = hasAccess;
    this.consentGrantedAt = consentGrantedAt;
  }
}
