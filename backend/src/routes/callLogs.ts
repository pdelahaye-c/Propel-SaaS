import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

const createCallLogSchema = z.object({
  callerName: z.string().min(1),
  phoneNumber: z.string().min(1),
  isKnownContact: z.boolean().optional(),
  leadStatus: z.string().optional(),
  direction: z.enum(['INBOUND', 'OUTBOUND']),
  status: z.enum(['COMPLETED', 'MISSED', 'VOICEMAIL']),
  duration: z.number().int().min(0).optional(),
  summary: z.string().optional(),
  transcript: z.string().optional(),
  sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']).optional(),
  tags: z.array(z.string()).optional(),
});

const updateCallLogSchema = createCallLogSchema.partial();

// Transform call log to frontend format (alias callLogActions → aiActions)
function transformCallLog(log: any) {
  return {
    ...log,
    tags: JSON.parse(log.tags),
    aiActions: log.callLogActions || [],
  };
}

// --- GET /api/call-logs ---

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { direction, status, sentiment, search, page = '1', limit = '20' } = req.query;

    const where: any = {};
    if (direction && typeof direction === 'string') where.direction = direction;
    if (status && typeof status === 'string') where.status = status;
    if (sentiment && typeof sentiment === 'string') where.sentiment = sentiment;
    if (search && typeof search === 'string') {
      where.OR = [
        { callerName: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search } },
        { summary: { contains: search, mode: 'insensitive' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));

    const [callLogs, total] = await Promise.all([
      prisma.callLog.findMany({
        where,
        include: {
          callLogActions: { orderBy: { timestamp: 'desc' } },
        },
        orderBy: { timestamp: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.callLog.count({ where }),
    ]);

    res.json({
      data: callLogs.map(transformCallLog),
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

// --- GET /api/call-logs/stats/summary ---
// NOTE: This must be before /:id to avoid route conflict

router.get('/stats/summary', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalCalls, completed, missed, voicemail] = await Promise.all([
      prisma.callLog.count(),
      prisma.callLog.count({ where: { status: 'COMPLETED' } }),
      prisma.callLog.count({ where: { status: 'MISSED' } }),
      prisma.callLog.count({ where: { status: 'VOICEMAIL' } }),
    ]);

    const allLogs = await prisma.callLog.findMany({
      select: { duration: true },
      where: { status: 'COMPLETED' },
    });

    const totalMinutes = allLogs.reduce((sum, l) => sum + l.duration, 0) / 60;
    const avgDuration = allLogs.length > 0
      ? allLogs.reduce((sum, l) => sum + l.duration, 0) / allLogs.length
      : 0;

    res.json({
      totalCalls,
      completed,
      missed,
      voicemail,
      totalMinutes: Math.round(totalMinutes),
      avgDurationSeconds: Math.round(avgDuration),
    });
  } catch (err) {
    next(err);
  }
});

// --- GET /api/call-logs/:id ---

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const callLog = await prisma.callLog.findUnique({
      where: { id: req.params.id },
      include: { callLogActions: true },
    });

    if (!callLog) {
      res.status(404).json({ error: 'Call log not found' });
      return;
    }

    res.json(transformCallLog(callLog));
  } catch (err) {
    next(err);
  }
});

// --- POST /api/call-logs ---

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createCallLogSchema.parse(req.body);
    const callLog = await prisma.callLog.create({
      data: {
        ...data,
        tags: JSON.stringify(data.tags || []),
      },
      include: { callLogActions: true },
    });
    res.status(201).json(transformCallLog(callLog));
  } catch (err) {
    next(err);
  }
});

// --- PUT /api/call-logs/:id ---

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateCallLogSchema.parse(req.body);
    const callLog = await prisma.callLog.update({
      where: { id: req.params.id },
      data: {
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : undefined,
      },
      include: { callLogActions: true },
    });
    res.json(transformCallLog(callLog));
  } catch (err) {
    next(err);
  }
});

// --- DELETE /api/call-logs/:id ---

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.callLog.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
