import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // --- Create default users ---
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@propel.app' },
    update: {},
    create: {
      email: 'admin@propel.app',
      passwordHash,
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'ADMIN',
      phone: '+33 6 00 00 00 01',
    },
  });

  const agent1 = await prisma.user.upsert({
    where: { email: 'agent@propel.app' },
    update: {},
    create: {
      email: 'agent@propel.app',
      passwordHash,
      firstName: 'Marie',
      lastName: 'Laurent',
      role: 'AGENT',
      phone: '+33 6 00 00 00 02',
    },
  });

  console.log('  Users created');

  // --- Create Leads (uses Supabase schema: budgetMin/budgetMax, aiSummary) ---
  const leads = [
    {
      name: 'Sophie Martin',
      email: 'sophie.m@gmail.com',
      phone: '+33 6 12 34 56 78',
      status: 'NEW',
      source: 'VOICE_AGENT',
      heatScore: 95,
      aiSummary: 'Called twice. Looking for T3 in Bastille with balcony. Urgent move-in.',
      budgetMax: 550000,
      locationPreference: 'Paris 11',
      assignedAgentId: admin.id,
    },
    {
      name: 'Marc Dubois',
      email: 'm.dubois@corporate.fr',
      phone: '+33 6 98 76 54 32',
      status: 'CONTACTED',
      source: 'CHAT_WIDGET',
      heatScore: 78,
      aiSummary: 'Chatted about 4-bed house in Vincennes. Selling current flat first.',
      budgetMax: 850000,
      locationPreference: 'Vincennes',
      assignedAgentId: admin.id,
    },
    {
      name: 'Sarah Connor',
      email: 's.connor@sky.net',
      phone: '+33 7 00 00 00 00',
      status: 'QUALIFIED',
      source: 'WEB_FORM',
      heatScore: 60,
      aiSummary: 'Viewing scheduled for Friday. Pre-approved for mortgage.',
      budgetMax: 400000,
      locationPreference: 'Lyon 06',
      assignedAgentId: admin.id,
    },
    {
      name: 'James Wilson',
      email: 'j.wilson@tech.com',
      phone: '+33 6 55 44 33 22',
      status: 'NEW',
      source: 'VOICE_AGENT',
      heatScore: 88,
      aiSummary: 'Voice AI flagged frustration. Asking about fees.',
      budgetMax: 600000,
      locationPreference: 'Bordeaux',
      assignedAgentId: agent1.id,
    },
    {
      name: 'Emma Stone',
      email: 'emma.s@hollywood.com',
      phone: '+1 555 0199',
      status: 'NEGOTIATION',
      source: 'MANUAL',
      heatScore: 45,
      aiSummary: 'Offer submitted on Rue de Rivoli penthouse.',
      budgetMax: 2500000,
      locationPreference: 'Paris 01',
      assignedAgentId: admin.id,
    },
  ];

  for (const lead of leads) {
    await prisma.lead.create({ data: lead });
  }
  console.log('  Leads created');

  // --- Create Properties ---
  const properties = [
    {
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
      features: JSON.stringify(['Balcony', 'Elevator', 'Renovated']),
      createdById: admin.id,
    },
    {
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
      features: JSON.stringify(['Sea View', 'Terrace', 'Garage']),
      createdById: admin.id,
    },
    {
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
      features: JSON.stringify(['Park View', 'High Ceilings']),
      createdById: admin.id,
    },
    {
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
      features: JSON.stringify(['Garden', 'Pool', 'Quiet']),
      createdById: admin.id,
    },
    {
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
      features: JSON.stringify(['Open Plan', 'Meeting Rooms']),
      createdById: admin.id,
    },
  ];

  const createdProperties: any[] = [];
  for (const prop of properties) {
    const created = await prisma.property.create({ data: prop });
    createdProperties.push(created);
  }
  console.log('  Properties created');

  // --- Create Buyers ---
  const buyers = [
    { name: 'ROMAND WESTENDORP', email: 'r.west@gmail.com', phone: '+33 6 00 00 00 00', type: 'Individual', status: 'Active', budget: 500000, requirements: 'T3 Marseille Sea View', lastActive: '2025-09-22' },
    { name: 'LECLABART Pierre', email: 'p.lecla@yahoo.fr', phone: '+33 6 11 11 11 11', type: 'Investor', status: 'Active', budget: 600000, requirements: 'House Cassis Renovation', lastActive: '2025-10-10' },
    { name: 'MARIA ANTONIETTA', email: 'maria.a@hotmail.com', phone: '+33 6 22 22 22 22', type: 'Individual', status: 'Active', budget: 450000, requirements: 'Apartment with terrace', lastActive: '2024-12-02' },
    { name: 'LAVAUD Jean', email: 'j.lavaud@orange.fr', phone: '+33 6 33 33 33 33', type: 'Individual', status: 'Active', budget: 350000, requirements: 'Small house exterior', lastActive: '2025-03-04' },
  ];

  const createdBuyers: any[] = [];
  for (const buyer of buyers) {
    const created = await prisma.buyer.create({ data: buyer });
    createdBuyers.push(created);
  }
  console.log('  Buyers created');

  // --- Create Sellers ---
  const sellers = [
    { name: 'VIDAL', email: 'vidal@mail.com', phone: '' },
    { name: 'MAILLANT', email: 'maillant@mail.com', phone: '' },
    { name: 'AMEZIANE', email: 'ameziane@mail.com', phone: '' },
    { name: 'LOVERA', email: 'lovera@mail.com', phone: '' },
    { name: 'POUZIN', email: 'pouzin@mail.com', phone: '' },
  ];

  const createdSellers: any[] = [];
  for (const seller of sellers) {
    const created = await prisma.seller.create({ data: seller });
    createdSellers.push(created);
  }
  console.log('  Sellers created');

  // --- Create Contracts ---
  const contracts = [
    {
      reference: '86233324',
      stage: 'Contrat de vente/location',
      agencyName: 'BARNES Marseille',
      propertyId: createdProperties[1].id,
      sellerId: createdSellers[0].id,
      buyerId: createdBuyers[0].id,
      offerDate: '2025-09-22',
      contractDate: '2025-10-13',
      price: 477000,
      fees: 0,
      agencyFees: 0,
      status: 'Active',
    },
    {
      reference: '86233325',
      stage: 'Contrat de vente/location',
      agencyName: 'BARNES Marseille',
      propertyId: createdProperties[1].id,
      sellerId: createdSellers[1].id,
      buyerId: createdBuyers[0].id,
      offerDate: '2025-09-22',
      contractDate: '2025-10-13',
      price: 477000,
      fees: 0,
      agencyFees: 0,
      status: 'Active',
    },
    {
      reference: '85495220',
      stage: 'Clôturé / Encaissé',
      agencyName: 'BARNES Marseille',
      propertyId: createdProperties[3].id,
      sellerId: createdSellers[2].id,
      buyerId: createdBuyers[1].id,
      offerDate: '2025-09-10',
      contractDate: '2025-10-10',
      signDate: '2026-01-08',
      price: 570000,
      fees: 21375,
      agencyFees: 18500,
      status: 'Closed',
    },
    {
      reference: '85357236',
      stage: 'Clôturé / Encaissé',
      agencyName: 'BARNES Marseille',
      propertyId: createdProperties[0].id,
      sellerId: createdSellers[3].id,
      buyerId: createdBuyers[2].id,
      contractDate: '2024-12-02',
      signDate: '2024-12-02',
      price: 4240,
      fees: 2088,
      agencyFees: 2088,
      status: 'Closed',
    },
    {
      reference: '85440103',
      stage: 'Clôturé / Encaissé',
      agencyName: 'BARNES Marseille',
      propertyId: createdProperties[0].id,
      sellerId: createdSellers[4].id,
      buyerId: createdBuyers[3].id,
      contractDate: '2025-03-04',
      price: 3450,
      fees: 3938,
      agencyFees: 3938,
      status: 'Closed',
    },
  ];

  for (const contract of contracts) {
    await prisma.contract.create({ data: contract });
  }
  console.log('  Contracts created');

  // --- Create Call Logs with CallLogActions ---
  const callLog1 = await prisma.callLog.create({
    data: {
      callerName: 'Sophie Martin',
      phoneNumber: '+33 6 12 34 56 78',
      isKnownContact: true,
      leadStatus: 'QUALIFIED',
      direction: 'INBOUND',
      status: 'COMPLETED',
      duration: 145,
      summary: 'Sophie wants to visit the Bastille Loft this weekend. Budget confirmed.',
      sentiment: 'POSITIVE',
      tags: JSON.stringify(['Visit Request', 'High Budget']),
      transcript: `AI: Bonjour, ici l'assistant virtuel de l'agence Propel. Comment puis-je vous aider ?
Sophie: Bonjour, je suis Sophie Martin. Je vous ai déjà eu au téléphone. Je rappelle pour l'appartement à Bastille.
AI: Bonjour Madame Martin, ravi de vous retrouver. Vous parlez du Loft Rue de la Roquette ?
Sophie: Exactement. J'en ai parlé à mon mari, on aimerait le visiter ce samedi.
AI: C'est noté. J'ai un créneau à 10h30 ou 14h00. Qu'est-ce qui vous conviendrait le mieux ?
Sophie: 14h00 ce serait parfait.
AI: Je réserve ça. Je vous envoie un récapitulatif par WhatsApp avec le code d'entrée. Autre chose ?
Sophie: Non c'est tout, merci !`,
    },
  });

  await prisma.callLogAction.createMany({
    data: [
      { type: 'CALENDAR', status: 'SUCCESS', description: 'Scheduled viewing: Sat 14:00', callLogId: callLog1.id },
      { type: 'WHATSAPP', status: 'SUCCESS', description: 'Sent property card & access code', callLogId: callLog1.id },
      { type: 'CRM_UPDATE', status: 'SUCCESS', description: 'Moved stage to "Qualified"', callLogId: callLog1.id },
    ],
  });

  const callLog2 = await prisma.callLog.create({
    data: {
      callerName: '+33 6 99 88 77 66',
      phoneNumber: '+33 6 99 88 77 66',
      isKnownContact: false,
      leadStatus: 'NEW',
      direction: 'INBOUND',
      status: 'COMPLETED',
      duration: 210,
      summary: 'New lead looking for investment property in Lyon. Needs guidance.',
      sentiment: 'NEUTRAL',
      tags: JSON.stringify(['Investor', 'New Lead']),
      transcript: `AI: Agence Propel, bonjour.
Caller: Oui bonjour, je cherche à investir dans le locatif sur Lyon.
AI: Très bien. Avez-vous un quartier de prédilection ou un budget défini ?
Caller: Pas vraiment, je regarde le 6ème mais c'est cher. J'ai environ 300k€.
AI: Le 6ème est effectivement premium. Avec 300k€, nous avons des opportunités intéressantes sur Villeurbanne limitrophe ou le 3ème. Souhaitez-vous recevoir une sélection ?
Caller: Pourquoi pas. Envoyez-moi ça par mail.
AI: Je note. Quelle est votre adresse email ?`,
    },
  });

  await prisma.callLogAction.createMany({
    data: [
      { type: 'CRM_UPDATE', status: 'SUCCESS', description: 'Created new Lead: "Investor Lyon"', callLogId: callLog2.id },
      { type: 'EMAIL', status: 'PENDING', description: 'Drafted selection email (Wait for agent approval)', callLogId: callLog2.id },
    ],
  });

  const callLog3 = await prisma.callLog.create({
    data: {
      callerName: 'James Wilson',
      phoneNumber: '+33 6 55 44 33 22',
      isKnownContact: true,
      leadStatus: 'NEGOTIATION',
      direction: 'INBOUND',
      status: 'VOICEMAIL',
      duration: 45,
      summary: 'Left a voicemail regarding the fees negotiation.',
      sentiment: 'NEGATIVE',
      tags: JSON.stringify(['Urgent', 'Negotiation']),
      transcript: `(Voicemail) Bonjour, c'est James. Je viens de voir votre proposition de mandat. Les honoraires à 5% ne me conviennent pas du tout. On avait parlé de 4%. Rappelez-moi vite sinon je vais voir ailleurs.`,
    },
  });

  await prisma.callLogAction.create({
    data: {
      type: 'SMS',
      status: 'SUCCESS',
      description: 'Alerted Agent: "Urgent Callback Request"',
      callLogId: callLog3.id,
    },
  });

  console.log('  Call logs created');

  console.log('Database seeded successfully!');
  console.log('');
  console.log('Default accounts:');
  console.log('  Admin: admin@propel.app / password123');
  console.log('  Agent: agent@propel.app / password123');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
