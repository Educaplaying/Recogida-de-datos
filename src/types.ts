/**
 * Shared Type Definitions for the Corporate Partner Portal
 */

export interface PartnerData {
  id: string;
  companyName: string;
  location: string;
  capacity: number;
  profile: string;
  otherProfileText?: string;
  functions: string;
  competencies: string;
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

export type ActiveTab = 'landing' | 'submission' | 'success' | 'support' | 'inbox';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

