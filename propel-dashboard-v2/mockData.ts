import { Lead, LeadStatus, LeadSource, KPIData, Property, Buyer, Seller, Contract, CallLog } from './types';

export const MOCK_KPIS: KPIData = {
  totalLeads: 124,
  responseRate: 92,
  conversionRate: 18.5,
  avgResponseTimeMin: 8,
  revenuePotential: 4250000
};

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    email: 'sophie.m@gmail.com',
    phone: '+33 6 12 34 56 78',
    status: LeadStatus.NEW,
    source: LeadSource.VOICE_AGENT,
    heatScore: 95,
    lastInteractionTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    lastInteractionSummary: "Called twice. Looking for T3 in Bastille with balcony. Urgent move-in.",
    budget: 550000,
    locationPreference: 'Paris 11',
    assignedAgentId: 'agent-1',
    activities: []
  },
  {
    id: '2',
    name: 'Marc Dubois',
    email: 'm.dubois@corporate.fr',
    phone: '+33 6 98 76 54 32',
    status: LeadStatus.CONTACTED,
    source: LeadSource.CHAT_WIDGET,
    heatScore: 78,
    lastInteractionTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    lastInteractionSummary: "Chatted about 4-bed house in Vincennes. Selling current flat first.",
    budget: 850000,
    locationPreference: 'Vincennes',
    assignedAgentId: 'agent-1',
    activities: []
  },
  {
    id: '3',
    name: 'Sarah Connor',
    email: 's.connor@sky.net',
    phone: '+33 7 00 00 00 00',
    status: LeadStatus.QUALIFIED,
    source: LeadSource.WEB_FORM,
    heatScore: 60,
    lastInteractionTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    lastInteractionSummary: "Viewing scheduled for Friday. Pre-approved for mortgage.",
    budget: 400000,
    locationPreference: 'Lyon 06',
    assignedAgentId: 'agent-1',
    activities: []
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'j.wilson@tech.com',
    phone: '+33 6 55 44 33 22',
    status: LeadStatus.NEW,
    source: LeadSource.VOICE_AGENT,
    heatScore: 88,
    lastInteractionTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    lastInteractionSummary: "Voice AI flagged frustration. Asking about fees.",
    budget: 600000,
    locationPreference: 'Bordeaux',
    assignedAgentId: 'agent-2',
    activities: []
  },
  {
    id: '5',
    name: 'Emma Stone',
    email: 'emma.s@hollywood.com',
    phone: '+1 555 0199',
    status: LeadStatus.NEGOTIATION,
    source: LeadSource.MANUAL,
    heatScore: 45,
    lastInteractionTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    lastInteractionSummary: "Offer submitted on Rue de Rivoli penthouse.",
    budget: 2500000,
    locationPreference: 'Paris 01',
    assignedAgentId: 'agent-1',
    activities: []
  },
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    sku: 'PRP-2024-001',
    title: 'Modern Loft in Bastille',
    address: '12 Rue de la Roquette',
    city: 'Paris',
    price: 550000,
    status: 'FOR_SALE',
    type: 'Apartment',
    beds: 2,
    baths: 1,
    sqft: 750,
    surface: 70,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    features: ['Balcony', 'Elevator', 'Renovated']
  },
  {
    id: 'p2',
    sku: 'PRP-2024-002',
    title: 'Appartement Marseille 7ème',
    address: 'Corniche Kennedy',
    city: 'Marseille 7ème',
    price: 477000,
    status: 'UNDER_OFFER',
    type: 'Apartment',
    beds: 2,
    baths: 1,
    sqft: 645,
    surface: 59.69,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
    features: ['Sea View', 'Terrace', 'Garage']
  },
  {
    id: 'p3',
    sku: 'PRP-2024-003',
    title: 'Sunny Flat Lyon 6',
    address: '8 Boulevard des Belges',
    city: 'Lyon',
    price: 395000,
    status: 'SOLD',
    type: 'Apartment',
    beds: 3,
    baths: 1,
    sqft: 900,
    surface: 85,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
    features: ['Park View', 'High Ceilings']
  },
  {
    id: 'p4',
    sku: 'PRP-2024-004',
    title: 'Maison Cassis Centre',
    address: 'Rue de la Ciotat',
    city: 'Cassis',
    price: 570000,
    status: 'SOLD',
    type: 'House',
    beds: 3,
    baths: 2,
    sqft: 1100,
    surface: 102,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    features: ['Garden', 'Pool', 'Quiet']
  },
  {
    id: 'p5',
    sku: 'PRP-2024-005',
    title: 'Downtown Office Space',
    address: '10 La Défense',
    city: 'Paris',
    price: 1200000,
    status: 'RENTED',
    type: 'Office',
    beds: 0,
    baths: 2,
    sqft: 3000,
    surface: 280,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    features: ['Open Plan', 'Meeting Rooms']
  }
];

export const MOCK_BUYERS: Buyer[] = [
    { id: 'b1', name: 'ROMAND WESTENDORP', email: 'r.west@gmail.com', phone: '+33 6 00 00 00 00', type: 'Individual', status: 'Active', budget: 500000, requirements: 'T3 Marseille Sea View', lastActive: '2025-09-22' },
    { id: 'b2', name: 'LECLABART Pierre', email: 'p.lecla@yahoo.fr', phone: '+33 6 11 11 11 11', type: 'Investor', status: 'Active', budget: 600000, requirements: 'House Cassis Renovation', lastActive: '2025-10-10' },
    { id: 'b3', name: 'MARIA ANTONIETTA', email: 'maria.a@hotmail.com', phone: '+33 6 22 22 22 22', type: 'Individual', status: 'Active', budget: 450000, requirements: 'Apartment with terrace', lastActive: '2024-12-02' },
    { id: 'b4', name: 'LAVAUD Jean', email: 'j.lavaud@orange.fr', phone: '+33 6 33 33 33 33', type: 'Individual', status: 'Active', budget: 350000, requirements: 'Small house exterior', lastActive: '2025-03-04' },
];

export const MOCK_SELLERS: Seller[] = [
    { id: 's1', name: 'VIDAL', email: 'vidal@mail.com', phone: '' },
    { id: 's2', name: 'MAILLANT', email: 'maillant@mail.com', phone: '' },
    { id: 's3', name: 'AMEZIANE', email: 'ameziane@mail.com', phone: '' },
    { id: 's4', name: 'LOVERA', email: 'lovera@mail.com', phone: '' },
    { id: 's5', name: 'POUZIN', email: 'pouzin@mail.com', phone: '' },
];

export const MOCK_CONTRACTS: Contract[] = [
    {
        id: 'c1',
        reference: '86233324',
        stage: 'Contrat de vente/location',
        agencyName: 'BARNES Marseille',
        propertyId: 'p2',
        sellerId: 's1',
        buyerId: 'b1',
        offerDate: '2025-09-22',
        contractDate: '2025-10-13',
        price: 477000,
        fees: 0,
        agencyFees: 0,
        status: 'Active'
    },
    {
        id: 'c2',
        reference: '86233324', // Duplicate ref as per screenshot implies linked docs or same property flow
        stage: 'Contrat de vente/location',
        agencyName: 'BARNES Marseille',
        propertyId: 'p2',
        sellerId: 's2',
        buyerId: 'b1',
        offerDate: '2025-09-22',
        contractDate: '2025-10-13',
        price: 477000,
        fees: 0,
        agencyFees: 0,
        status: 'Active'
    },
    {
        id: 'c3',
        reference: '85495220',
        stage: 'Clôturé / Encaissé',
        agencyName: 'BARNES Marseille',
        propertyId: 'p4',
        sellerId: 's3',
        buyerId: 'b2',
        offerDate: '2025-09-10',
        contractDate: '2025-10-10',
        signDate: '2026-01-08',
        price: 570000,
        fees: 21375,
        agencyFees: 18500,
        status: 'Closed'
    },
    {
        id: 'c4',
        reference: '85357236',
        stage: 'Clôturé / Encaissé',
        agencyName: 'BARNES Marseille',
        propertyId: 'p1', // Mismatch in location on screenshot but using generic property linkage
        sellerId: 's4',
        buyerId: 'b3',
        contractDate: '2024-12-02',
        signDate: '2024-12-02',
        price: 4240, // As per screenshot, likely rental or smaller fee
        fees: 2088,
        agencyFees: 2088,
        status: 'Closed'
    },
    {
        id: 'c5',
        reference: '85440103',
        stage: 'Clôturé / Encaissé',
        agencyName: 'BARNES Marseille',
        propertyId: 'p1',
        sellerId: 's5',
        buyerId: 'b4',
        contractDate: '2025-03-04',
        price: 3450,
        fees: 3938,
        agencyFees: 3938,
        status: 'Closed'
    }
];

export const MOCK_CALL_LOGS: CallLog[] = [
    {
        id: 'call_1',
        callerName: 'Sophie Martin',
        phoneNumber: '+33 6 12 34 56 78',
        isKnownContact: true,
        leadStatus: LeadStatus.QUALIFIED,
        direction: 'INBOUND',
        status: 'COMPLETED',
        duration: 145, // seconds
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        summary: "Sophie wants to visit the Bastille Loft this weekend. Budget confirmed.",
        sentiment: 'POSITIVE',
        tags: ['Visit Request', 'High Budget'],
        transcript: `AI: Bonjour, ici l'assistant virtuel de l'agence Propel. Comment puis-je vous aider ?
Sophie: Bonjour, je suis Sophie Martin. Je vous ai déjà eu au téléphone. Je rappelle pour l'appartement à Bastille.
AI: Bonjour Madame Martin, ravi de vous retrouver. Vous parlez du Loft Rue de la Roquette ?
Sophie: Exactement. J'en ai parlé à mon mari, on aimerait le visiter ce samedi.
AI: C'est noté. J'ai un créneau à 10h30 ou 14h00. Qu'est-ce qui vous conviendrait le mieux ?
Sophie: 14h00 ce serait parfait.
AI: Je réserve ça. Je vous envoie un récapitulatif par WhatsApp avec le code d'entrée. Autre chose ?
Sophie: Non c'est tout, merci !`,
        aiActions: [
            { id: 'a1', type: 'CALENDAR', status: 'SUCCESS', description: 'Scheduled viewing: Sat 14:00', timestamp: new Date().toISOString() },
            { id: 'a2', type: 'WHATSAPP', status: 'SUCCESS', description: 'Sent property card & access code', timestamp: new Date().toISOString() },
            { id: 'a3', type: 'CRM_UPDATE', status: 'SUCCESS', description: 'Moved stage to "Qualified"', timestamp: new Date().toISOString() }
        ]
    },
    {
        id: 'call_2',
        callerName: '+33 6 99 88 77 66',
        phoneNumber: '+33 6 99 88 77 66',
        isKnownContact: false,
        leadStatus: LeadStatus.NEW,
        direction: 'INBOUND',
        status: 'COMPLETED',
        duration: 210,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        summary: "New lead looking for investment property in Lyon. Needs guidance.",
        sentiment: 'NEUTRAL',
        tags: ['Investor', 'New Lead'],
        transcript: `AI: Agence Propel, bonjour.
Caller: Oui bonjour, je cherche à investir dans le locatif sur Lyon.
AI: Très bien. Avez-vous un quartier de prédilection ou un budget défini ?
Caller: Pas vraiment, je regarde le 6ème mais c'est cher. J'ai environ 300k€.
AI: Le 6ème est effectivement premium. Avec 300k€, nous avons des opportunités intéressantes sur Villeurbanne limitrophe ou le 3ème. Souhaitez-vous recevoir une sélection ?
Caller: Pourquoi pas. Envoyez-moi ça par mail.
AI: Je note. Quelle est votre adresse email ?`,
        aiActions: [
            { id: 'a4', type: 'CRM_UPDATE', status: 'SUCCESS', description: 'Created new Lead: "Investor Lyon"', timestamp: new Date().toISOString() },
            { id: 'a5', type: 'EMAIL', status: 'PENDING', description: 'Drafted selection email (Wait for agent approval)', timestamp: new Date().toISOString() }
        ]
    },
    {
        id: 'call_3',
        callerName: 'James Wilson',
        phoneNumber: '+33 6 55 44 33 22',
        isKnownContact: true,
        leadStatus: LeadStatus.NEGOTIATION,
        direction: 'INBOUND',
        status: 'VOICEMAIL',
        duration: 45,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        summary: "Left a voicemail regarding the fees negotiation.",
        sentiment: 'NEGATIVE',
        tags: ['Urgent', 'Negotiation'],
        transcript: `(Voicemail) Bonjour, c'est James. Je viens de voir votre proposition de mandat. Les honoraires à 5% ne me conviennent pas du tout. On avait parlé de 4%. Rappelez-moi vite sinon je vais voir ailleurs.`,
        aiActions: [
            { id: 'a6', type: 'SMS', status: 'SUCCESS', description: 'Alerted Agent: "Urgent Callback Request"', timestamp: new Date().toISOString() }
        ]
    }
];
