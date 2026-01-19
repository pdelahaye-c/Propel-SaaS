
export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED = 'CLOSED',
  LOST = 'LOST'
}

export enum LeadSource {
  VOICE_AGENT = 'VOICE_AGENT',
  CHAT_WIDGET = 'CHAT_WIDGET',
  WEB_FORM = 'WEB_FORM',
  MANUAL = 'MANUAL'
}

export interface Activity {
  id: string;
  type: 'CALL' | 'NOTE' | 'EMAIL' | 'SMS' | 'VIEWING';
  content: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  heatScore: number; // 0-100
  lastInteractionTime: string;
  lastInteractionSummary: string; // The "Context" needed for the agent
  budget: number;
  locationPreference: string;
  assignedAgentId: string;
  activities: Activity[];
}

export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Individual' | 'Investor' | 'Company';
  status: 'Active' | 'Inactive';
  budget: number;
  requirements: string;
  lastActive: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface KPIData {
  totalLeads: number;
  responseRate: number;
  conversionRate: number;
  avgResponseTimeMin: number;
  revenuePotential: number;
}

export interface Property {
  id: string;
  sku: string;
  title: string;
  address: string;
  city: string;
  price: number;
  status: 'FOR_SALE' | 'SOLD' | 'RENTED' | 'UNDER_OFFER';
  type: 'Apartment' | 'House' | 'Office' | 'Building';
  beds: number;
  baths: number;
  sqft: number;
  surface: number; // m2
  imageUrl: string;
  features: string[];
}

export interface Contract {
  id: string;
  reference: string;
  stage: string; // e.g., "Contrat de vente/location", "Clôturé / Encaissé"
  agencyName: string;
  propertyId: string;
  sellerId: string;
  buyerId: string;
  offerDate?: string;
  contractDate?: string;
  signDate?: string; // Acte authentique
  price: number;
  fees: number;
  agencyFees: number;
  status: 'Active' | 'Closed';
}

export type TimeRange = '1D' | '7D' | '1M' | '3M' | '6M' | '1Y';

// --- NEW TYPES FOR CALL LOGS ---

export interface AIAction {
    id: string;
    type: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'CALENDAR' | 'CRM_UPDATE';
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    description: string;
    timestamp: string;
}

export interface CallLog {
    id: string;
    callerName: string;
    phoneNumber: string;
    isKnownContact: boolean; // True if they exist in Buyers/Leads
    leadStatus: LeadStatus;
    direction: 'INBOUND' | 'OUTBOUND';
    status: 'COMPLETED' | 'MISSED' | 'VOICEMAIL';
    duration: number; // seconds
    timestamp: string;
    summary: string;
    transcript: string; // Full text
    sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    aiActions: AIAction[];
    tags: string[];
}
