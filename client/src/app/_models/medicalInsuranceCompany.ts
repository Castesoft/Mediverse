import { Document } from "./document";

export interface MedicalInsuranceCompany {
    id: number;
    name: string;
    photoUrl: string;
}

export interface UserMedicalInsuranceCompany {
    id: number;
    name: string;
    isMain: boolean;
    policyNumber: string;
    photoUrl: string;
    document: Document;
}