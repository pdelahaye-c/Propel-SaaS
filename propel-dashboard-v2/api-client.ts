/**
 * API Client for Propel Backend
 *
 * Handles authentication token management and provides
 * typed methods for all API endpoints.
 */

const API_BASE = 'http://localhost:3001/api';

// --- Token Management ---

let authToken: string | null = null;

export function getToken(): string | null {
  if (authToken) return authToken;
  authToken = localStorage.getItem('propel-token');
  return authToken;
}

export function setToken(token: string): void {
  authToken = token;
  localStorage.setItem('propel-token', token);
}

export function clearToken(): void {
  authToken = null;
  localStorage.removeItem('propel-token');
}

// --- Base Fetch ---

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
    window.dispatchEvent(new CustomEvent('auth:logout'));
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// --- Auth API ---

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string | null;
  avatarUrl: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
    apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => apiFetch<AuthUser>('/auth/me'),

  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) =>
    apiFetch<AuthUser>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// --- Paginated Response ---

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// --- Leads API ---

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  heatScore: number;
  lastInteractionTime: string;
  lastInteractionSummary: string;
  budget: number;
  locationPreference: string;
  assignedAgentId: string | null;
  assignedAgent?: { id: string; firstName: string; lastName: string } | null;
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: string;
  content: string;
  timestamp: string;
}

export const leadsApi = {
  list: (params?: { status?: string; source?: string; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.source) query.set('source', params.source);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    return apiFetch<PaginatedResponse<Lead>>(`/leads?${query}`);
  },

  get: (id: string) => apiFetch<Lead>(`/leads/${id}`),

  create: (data: Partial<Lead>) =>
    apiFetch<Lead>('/leads', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Lead>) =>
    apiFetch<Lead>(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/leads/${id}`, { method: 'DELETE' }),

  addActivity: (id: string, data: { type: string; content: string }) =>
    apiFetch<Activity>(`/leads/${id}/activities`, { method: 'POST', body: JSON.stringify(data) }),
};

// --- Properties API ---

export interface Property {
  id: string;
  sku: string;
  title: string;
  address: string;
  city: string;
  price: number;
  status: string;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  surface: number;
  imageUrl: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export const propertiesApi = {
  list: (params?: { status?: string; type?: string; city?: string; search?: string; minPrice?: number; maxPrice?: number; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.type) query.set('type', params.type);
    if (params?.city) query.set('city', params.city);
    if (params?.search) query.set('search', params.search);
    if (params?.minPrice) query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice) query.set('maxPrice', String(params.maxPrice));
    if (params?.page) query.set('page', String(params.page));
    return apiFetch<PaginatedResponse<Property>>(`/properties?${query}`);
  },

  get: (id: string) => apiFetch<Property>(`/properties/${id}`),

  create: (data: Partial<Property>) =>
    apiFetch<Property>('/properties', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Property>) =>
    apiFetch<Property>(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/properties/${id}`, { method: 'DELETE' }),
};

// --- Buyers API ---

export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  budget: number;
  requirements: string;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export const buyersApi = {
  list: (params?: { status?: string; type?: string; search?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.type) query.set('type', params.type);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    return apiFetch<PaginatedResponse<Buyer>>(`/buyers?${query}`);
  },

  get: (id: string) => apiFetch<Buyer>(`/buyers/${id}`),

  create: (data: Partial<Buyer>) =>
    apiFetch<Buyer>('/buyers', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Buyer>) =>
    apiFetch<Buyer>(`/buyers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/buyers/${id}`, { method: 'DELETE' }),
};

// --- Contracts API ---

export interface Contract {
  id: string;
  reference: string;
  stage: string;
  agencyName: string;
  propertyId: string;
  sellerId: string;
  buyerId: string;
  offerDate: string | null;
  contractDate: string | null;
  signDate: string | null;
  price: number;
  fees: number;
  agencyFees: number;
  status: string;
  property?: { id: string; title: string; city: string };
  buyer?: { id: string; name: string };
  seller?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export const contractsApi = {
  list: (params?: { status?: string; search?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    return apiFetch<PaginatedResponse<Contract>>(`/contracts?${query}`);
  },

  get: (id: string) => apiFetch<Contract>(`/contracts/${id}`),

  create: (data: Partial<Contract>) =>
    apiFetch<Contract>('/contracts', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Contract>) =>
    apiFetch<Contract>(`/contracts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/contracts/${id}`, { method: 'DELETE' }),
};

// --- CallLogs API ---

export interface CallLogEntry {
  id: string;
  callerName: string;
  phoneNumber: string;
  isKnownContact: boolean;
  leadStatus: string;
  direction: string;
  status: string;
  duration: number;
  timestamp: string;
  summary: string;
  transcript: string;
  sentiment: string;
  tags: string[];
  aiActions: AIActionEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface AIActionEntry {
  id: string;
  type: string;
  status: string;
  description: string;
  timestamp: string;
}

export const callLogsApi = {
  list: (params?: { direction?: string; status?: string; sentiment?: string; search?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.direction) query.set('direction', params.direction);
    if (params?.status) query.set('status', params.status);
    if (params?.sentiment) query.set('sentiment', params.sentiment);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    return apiFetch<PaginatedResponse<CallLogEntry>>(`/call-logs?${query}`);
  },

  get: (id: string) => apiFetch<CallLogEntry>(`/call-logs/${id}`),

  create: (data: Partial<CallLogEntry>) =>
    apiFetch<CallLogEntry>('/call-logs', { method: 'POST', body: JSON.stringify(data) }),

  stats: () => apiFetch<{
    totalCalls: number;
    completed: number;
    missed: number;
    voicemail: number;
    totalMinutes: number;
    avgDurationSeconds: number;
  }>('/call-logs/stats/summary'),
};

// --- Dashboard API ---

export interface DashboardKPIs {
  totalLeads: number;
  activeContracts: number;
  propertiesForSale: number;
  closedContracts: number;
  revenuePotential: number;
  conversionRate: number;
}

export const dashboardApi = {
  kpis: () => apiFetch<DashboardKPIs>('/dashboard/kpis'),
};

// --- Health Check ---

export const healthCheck = () =>
  apiFetch<{ status: string; timestamp: string }>('/health');
