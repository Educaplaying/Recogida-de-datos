/**
 * Shared Type Definitions for the Corporate Partner Portal
 */

export interface WorkCenterParticipation {
  id: string;
  locationExact: string;
  profile: string;
  functions: string;
  competencies: string;
  slotsCount: number;
}

export interface PartnerData {
  id: string;
  companyName: string;
  companyDescription: string;
  contactPerson: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  participations: WorkCenterParticipation[];
  submissionDate: string;
}

export interface SupportTicket {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  submissionDate: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
}

export type ActiveTab = 'landing' | 'submission' | 'success' | 'support' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

