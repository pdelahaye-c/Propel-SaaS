/**
 * Stripe API Routes - Backend Implementation Guide
 *
 * IMPORTANT: This file is a REFERENCE IMPLEMENTATION.
 * These functions should be run on a backend server (Express/Node.js),
 * NOT in the browser. The current Propel Dashboard is frontend-only.
 *
 * To use this, you need to:
 * 1. Set up an Express.js backend
 * 2. Install stripe: `npm install stripe`
 * 3. Configure environment variables (see .env.example)
 * 4. Register these as Express route handlers
 *
 * Dependencies:
 *   npm install stripe express
 *   npm install -D @types/express
 */

// ============================================================
// STRIPE SERVER-SIDE CONFIGURATION
// ============================================================

/*
import Stripe from 'stripe';
import { Request, Response } from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// ============================================================
// POST /api/stripe/checkout
// Creates a Stripe Checkout Session for new subscriptions
// ============================================================

export async function createCheckoutSession(req: Request, res: Response) {
  try {
    const { priceId, userId, userEmail } = req.body;

    if (!priceId || !userId || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields: priceId, userId, userEmail' });
    }

    // Check if user already has a Stripe customer
    let customerId: string | undefined;
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
      subscription_data: {
        trial_period_days: 14, // 14-day free trial
        metadata: {
          userId,
        },
      },
      success_url: `${process.env.FRONTEND_URL}/settings?tab=billing&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
      },
    });

    return res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error.message);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

// ============================================================
// POST /api/stripe/portal
// Creates a Stripe Customer Portal session for managing subscriptions
// ============================================================

export async function createPortalSession(req: Request, res: Response) {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customerId' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/settings?tab=billing`,
    });

    return res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe portal error:', error.message);
    return res.status(500).json({ error: 'Failed to create portal session' });
  }
}

// ============================================================
// GET /api/stripe/subscription
// Gets the current user's subscription details
// ============================================================

export async function getSubscription(req: Request, res: Response) {
  try {
    const { subscriptionId } = req.query;

    if (!subscriptionId || typeof subscriptionId !== 'string') {
      return res.status(400).json({ error: 'Missing subscriptionId' });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'latest_invoice'],
    });

    return res.json({
      id: subscription.id,
      status: subscription.status,
      planId: subscription.metadata.planId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
    });
  } catch (error: any) {
    console.error('Stripe subscription error:', error.message);
    return res.status(500).json({ error: 'Failed to get subscription' });
  }
}

// ============================================================
// GET /api/stripe/invoices
// Lists invoices for the current user
// ============================================================

export async function getInvoices(req: Request, res: Response) {
  try {
    const { customerId } = req.query;

    if (!customerId || typeof customerId !== 'string') {
      return res.status(400).json({ error: 'Missing customerId' });
    }

    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 12,
    });

    return res.json(
      invoices.data.map((inv) => ({
        id: inv.id,
        number: inv.number,
        status: inv.status,
        amount: inv.amount_due,
        currency: inv.currency,
        created: new Date(inv.created * 1000).toISOString(),
        pdfUrl: inv.invoice_pdf,
        hostedUrl: inv.hosted_invoice_url,
      }))
    );
  } catch (error: any) {
    console.error('Stripe invoices error:', error.message);
    return res.status(500).json({ error: 'Failed to get invoices' });
  }
}

// ============================================================
// POST /api/stripe/webhook
// Handles Stripe webhook events
// IMPORTANT: This endpoint must receive the raw body (not parsed JSON)
// ============================================================

export async function handleWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;

  try {
    // req.body must be the raw buffer, not parsed JSON
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      console.log(`Checkout completed for user ${userId}`);
      // TODO: Update your database:
      // - Link stripeCustomerId to user
      // - Link stripeSubscriptionId to user
      // - Set subscription status to 'active' or 'trialing'
      // - Set the plan based on the price ID
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      console.log(`Subscription updated for user ${userId}: ${subscription.status}`);
      // TODO: Update subscription status in database
      // - Update status (active, past_due, canceled, etc.)
      // - Update plan if changed (upgrade/downgrade)
      // - Update period dates
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      console.log(`Subscription deleted for user ${userId}`);
      // TODO: Handle subscription cancellation
      // - Set subscription status to 'canceled'
      // - Optionally downgrade to free tier
      // - Send cancellation email
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`Payment succeeded for invoice ${invoice.id}`);
      // TODO: Record payment in database
      // - Log the payment
      // - Send receipt email
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`Payment failed for invoice ${invoice.id}`);
      // TODO: Handle failed payment
      // - Notify user via email
      // - Show banner in app
      // - After X retries, restrict access
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Acknowledge receipt of the event
  return res.json({ received: true });
}

// ============================================================
// Express Router Setup Example
// ============================================================
//
// import express from 'express';
// const router = express.Router();
//
// router.post('/checkout', createCheckoutSession);
// router.post('/portal', createPortalSession);
// router.get('/subscription', getSubscription);
// router.get('/invoices', getInvoices);
//
// // IMPORTANT: Webhook needs raw body
// router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
//
// export default router;
*/

// Placeholder export to prevent TypeScript errors in the frontend-only project
export const STRIPE_API_REFERENCE = 'See comments above for backend implementation';
