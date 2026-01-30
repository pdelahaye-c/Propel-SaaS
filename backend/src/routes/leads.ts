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
  budget: z.number().optional(),
  locationPreference: z.string().optional(),
  lastInteractionSummary: z.string().optional(),
  assignedAgentId: z.string().optional(),
});

const updateLeadSchema = createLeadSchema.partial();

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
        { name: { contains: search } },
        { email: { contains: search } },
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
          activities: {
            orderBy: { timestamp: 'desc' },
            take: 5,
          },
        },
        orderBy: sort && typeof sort === 'string'
          ? { [sort]: order === 'asc' ? 'asc' : 'desc' }
          : { lastInteractionTime: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({
      data: leads,
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
        activities: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    res.json(lead);
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
        ...data,
        assignedAgentId: data.assignedAgentId || req.user!.userId,
      },
      include: {
        assignedAgent: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    res.status(201).json(lead);
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
        lastInteractionTime: new Date(),
      },
      include: {
        assignedAgent: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    res.json(lead);
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

router.post('/:id/activities', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = z.object({
      type: z.enum(['CALL', 'NOTE', 'EMAIL', 'SMS', 'VIEWING']),
      content: z.string().min(1),
    });
    const data = schema.parse(req.body);

    const activity = await prisma.activity.create({
      data: {
        ...data,
        leadId: req.params.id,
      },
    });

    // Update lead's last interaction
    await prisma.lead.update({
      where: { id: req.params.id },
      data: {
        lastInteractionTime: new Date(),
        lastInteractionSummary: data.content.substring(0, 200),
      },
    });

    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
});

export default router;
