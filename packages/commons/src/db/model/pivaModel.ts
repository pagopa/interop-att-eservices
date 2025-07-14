export interface PivaModel {
  organizationId: string;
  valid: boolean;
  status: "ATTIVA" | "CESSATA" | "SOSPESA";
  denomination: string;
  dateStartActivity: string;
  dateEndActivity: string;
  dateStartSuspension: string;
  isOrganizationId: boolean;
  organizationGroupId: string;
  dateStartPartecipationOrganizationGroupId: string;
  isPartecipantOrganizationGroupId: boolean;
}

export interface VerificaPartitaIva {
  partitaIva: string;
  valida: boolean;
  messaggio: string;
}
