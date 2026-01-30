import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// --- Validation ---

const createLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'NEGOTIATION', 'CLOSED', 'LOST']).optional(),
  source: z.enum(['VOICE_AGENT', 'CHAT_WIDGET', 'WEB_FORM', 'MANUAL']).optional(),
  heatScore: z.number().min(0).max(100).optional(),
  budgetMin: z.number().int().optional(),
  budgetMax: z.number().int().optional(),
  locationPreference: z.string().optional(),
  aiSummary: z.string().optional(),
  assignedAgentId: z.string().optional(),
});

const updateLeadSchema = createLeadSchema.partial();

// Transform Supabase Lead model to frontend-compatible format
function transformLead(lead: any) {
  return {
    ...lead,
    // Backward-compatible fields for frontend
    budget: lead.budgetMax || lead.budgetMin || 0,
    lastInteractionSummary: lead.aiSummary || '',
    lastInteractionTime: lead.updatedAt,
    // Map events to activities format for frontend
    activities: (lead.events || []).map((e: any) => ({
      id: e.id,
      type: e.type,
      content: e.summary || (e.data ? JSON.stringify(e.data) : ''),
      timestamp: e.createdAt,
    })),
  };
}

// --- GET /api/leads ---

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, source, search, sort, order, page = '1', limit = '20' } = req.query;

    const where: any = {};

    if (status && typeof status === 'string') {
      where.status = status;
    }
    if (source && typeof source === 'string') {
      where.source = source;
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          assignedAgent: {
            select: { id: true, firstName: true, lastName: true },
          },
          events: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: sort && typeof sort === 'string'
          ? { [sort]: order === 'asc' ? 'asc' : 'desc' }
          : { updatedAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({
      data: leads.map(transformLead),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
});

// --- GET /api/leads/:id ---

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id },
      include: {
        assignedAgent: {
          select: { id: true, firstName: true, lastName: true },
        },
        events: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    res.json(transformLead(lead));
  } catch (err) {
    next(err);
  }
});

// --- POST /api/leads ---

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createLeadSchema.parse(req.body);

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        source: data.source,
        heatScore: data.heatScore,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        locationPreference: data.locationPreference,
        aiSummary: data.aiSummary,
        assignedAgentId: data.assignedAgentId || req.user!.userId,
      },
      include: {
        assignedAgent: {
          select: { id: true, firstName: true, lastName: true },
        },
        events: true,
      },
    });

    res.status(201).json(transformLead(lead));
  } catch (err) {
    next(err);
  }
});

// --- PUT /api/leads/:id ---

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateLeadSchema.parse(req.body);

    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: {
        ...data,
      },
      include: {
        assignedAgent: {
          select: { id: true, firstName: true, lastName: true },
        },
        events: true,
      },
    });

    res.json(transformLead(lead));
  } catch (err) {
    next(err);
  }
});

// --- DELETE /api/leads/:id ---

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// --- POST /api/leads/:id/activities ---
// Creates a LeadEvent (backward-compatible endpoint name)

router.post('/:id/activities', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = z.object({
      type: z.enum(['CALL', 'NOTE', 'EMAIL', 'SMS', 'VIEWING']),
      content: z.string().min(1),
    });
    const data = schema.parse(req.body);

    const event = await prisma.leadEvent.create({
      data: {
        type: data.type,
        summary: data.content,
        leadId: req.params.id,
      },
    });

    // Update lead's ai_summary with latest interaction
    await prisma.lead.update({
      where: { id: req.params.id },
      data: {
        aiSummary: data.content.substring(0, 500),
      },
    });

    // Return in Activity format for frontend compatibility
    res.status(201).json({
      id: event.id,
      type: event.type,
      content: event.summary || '',
      timestamp: event.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
