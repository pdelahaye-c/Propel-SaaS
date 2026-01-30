import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

const createBuyerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  type: z.enum(['Individual', 'Investor', 'Company']).optional(),
  status: z.enum(['Active', 'Inactive']).optional(),
  budget: z.number().optional(),
  requirements: z.string().optional(),
  lastActive: z.string().optional(),
});

const updateBuyerSchema = createBuyerSchema.partial();

// --- GET /api/buyers ---

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, type, search, page = '1', limit = '20' } = req.query;

    const where: any = {};
    if (status && typeof status === 'string') where.status = status;
    if (type && typeof type === 'string') where.type = type;
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));

    const [buyers, total] = await Promise.all([
      prisma.buyer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.buyer.count({ where }),
    ]);

    res.json({
      data: buyers,
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

// --- GET /api/buyers/:id ---

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id: req.params.id },
      include: { contracts: true },
    });

    if (!buyer) {
      res.status(404).json({ error: 'Buyer not found' });
      return;
    }

    res.json(buyer);
  } catch (err) {
    next(err);
  }
});

// --- POST /api/buyers ---

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createBuyerSchema.parse(req.body);
    const buyer = await prisma.buyer.create({ data });
    res.status(201).json(buyer);
  } catch (err) {
    next(err);
  }
});

// --- PUT /api/buyers/:id ---

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateBuyerSchema.parse(req.body);
    const buyer = await prisma.buyer.update({
      where: { id: req.params.id },
      data,
    });
    res.json(buyer);
  } catch (err) {
    next(err);
  }
});

// --- DELETE /api/buyers/:id ---

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.buyer.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
