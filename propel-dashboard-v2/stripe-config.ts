/**
 * Stripe Configuration for Propel SaaS
 *
 * This file defines the Stripe plans, pricing, and configuration
 * needed for the SaaS billing system.
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a Stripe account at https://dashboard.stripe.com
 * 2. Go to Products > Create Product for each plan below
 * 3. Copy the Price IDs into your .env.local file
 * 4. Set up webhooks at https://dashboard.stripe.com/webhooks
 *    - Endpoint URL: https://your-domain.com/api/stripe/webhook
 *    - Events: checkout.session.completed, customer.subscription.updated,
 *              customer.subscription.deleted, invoice.payment_succeeded,
 *              invoice.payment_failed
 * 5. Copy the webhook signing secret into STRIPE_WEBHOOK_SECRET
 */

// --- Plan Definitions ---

export interface StripePlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number; // EUR
  priceYearly: number;  // EUR (with discount)
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  features: string[];
  limits: {
    agents: number;       // -1 = unlimited
    leadsPerMonth: number; // -1 = unlimited
    properties: number;    // -1 = unlimited
    aiCallMinutes: number; // -1 = unlimited
    storageGB: number;
  };
  highlighted?: boolean; // For the pricing page "recommended" badge
}

export const STRIPE_PLANS: StripePlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Pour les agents indépendants qui démarrent.',
    priceMonthly: 49,
    priceYearly: 468, // 39/mois = 20% discount
    stripePriceIdMonthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || 'price_starter_monthly',
    stripePriceIdYearly: process.env.STRIPE_PRICE_STARTER_YEARLY || 'price_starter_yearly',
    features: [
      '1 agent',
      '50 leads / mois',
      '20 propriétés',
      '100 min appels AI / mois',
      'Dashboard & KPIs de base',
      'Gestion des leads',
      'Gestion des propriétés',
      'Support email',
    ],
    limits: {
      agents: 1,
      leadsPerMonth: 50,
      properties: 20,
      aiCallMinutes: 100,
      storageGB: 5,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les agences en croissance.',
    priceMonthly: 149,
    priceYearly: 1428, // 119/mois = 20% discount
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
    features: [
      '5 agents',
      'Leads illimités',
      '100 propriétés',
      '500 min appels AI / mois',
      'Dashboard & Analytics avancés',
      'Inbox multi-canal',
      'Rapports & exports',
      'Matching buyer / property',
      'Intégration calendrier',
      'Support prioritaire',
    ],
    limits: {
      agents: 5,
      leadsPerMonth: -1,
      properties: 100,
      aiCallMinutes: 500,
      storageGB: 25,
    },
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Pour les réseaux et grandes agences.',
    priceMonthly: 399,
    priceYearly: 3828, // 319/mois = 20% discount
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',
    stripePriceIdYearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || 'price_enterprise_yearly',
    features: [
      'Agents illimités',
      'Leads illimités',
      'Propriétés illimitées',
      'Appels AI illimités',
      'Tous les modules',
      'API Access',
      'White-label',
      'E-signature intégrée',
      'Génération de documents',
      'Multi-agences',
      'SSO / SAML',
      'Account Manager dédié',
    ],
    limits: {
      agents: -1,
      leadsPerMonth: -1,
      properties: -1,
      aiCallMinutes: -1,
      storageGB: 100,
    },
  },
];

// --- Stripe Webhook Events ---

export const STRIPE_WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'invoice.finalized',
  'customer.updated',
  'payment_method.attached',
  'payment_method.detached',
] as const;

export type StripeWebhookEvent = typeof STRIPE_WEBHOOK_EVENTS[number];

// --- Subscription Status ---

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'paused';

export interface UserSubscription {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  planId: string; // 'starter' | 'pro' | 'enterprise'
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
}

// --- Helper to get plan by ID ---

export function getPlanById(planId: string): StripePlan | undefined {
  return STRIPE_PLANS.find(plan => plan.id === planId);
}

// --- Helper to check feature access ---

export function hasFeatureAccess(
  subscription: UserSubscription | null,
  feature: 'inbox' | 'reports' | 'ai_calls' | 'matching' | 'api' | 'documents' | 'whitelabel'
): boolean {
  if (!subscription || subscription.status !== 'active' && subscription.status !== 'trialing') {
    return false;
  }

  const plan = getPlanById(subscription.planId);
  if (!plan) return false;

  switch (feature) {
    case 'inbox':
    case 'reports':
    case 'matching':
      return plan.id === 'pro' || plan.id === 'enterprise';
    case 'ai_calls':
      return true; // All plans have some AI minutes
    case 'api':
    case 'documents':
    case 'whitelabel':
      return plan.id === 'enterprise';
    default:
      return false;
  }
}

// --- Helper to check usage limits ---

export function isWithinLimits(
  subscription: UserSubscription | null,
  metric: 'agents' | 'leadsPerMonth' | 'properties' | 'aiCallMinutes',
  currentUsage: number
): boolean {
  if (!subscription) return false;

  const plan = getPlanById(subscription.planId);
  if (!plan) return false;

  const limit = plan.limits[metric];
  if (limit === -1) return true; // Unlimited

  return currentUsage < limit;
}
