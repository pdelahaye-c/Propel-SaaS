import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

const createContractSchema = z.object({
  reference: z.string().min(1),
  stage: z.string().optional(),
  agencyName: z.string().optional(),
  propertyId: z.string().min(1),
  sellerId: z.string().min(1),
  buyerId: z.string().min(1),
  offerDate: z.string().optional(),
  contractDate: z.string().optional(),
  signDate: z.string().optional(),
  price: z.number().min(0),
  fees: z.number().min(0).optional(),
  agencyFees: z.number().min(0).optional(),
  status: z.enum(['Active', 'Closed']).optional(),
});

const updateContractSchema = createContractSchema.partial();

// --- GET /api/contracts ---

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;

    const where: any = {};
    if (status && typeof status === 'string') where.status = status;
    if (search && typeof search === 'string') {
      where.OR = [
        { reference: { contains: search } },
        { agencyName: { contains: search } },
        { stage: { contains: search } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        include: {
          property: { select: { id: true, title: true, city: true } },
          buyer: { select: { id: true, name: true } },
          seller: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.contract.count({ where }),
    ]);

    res.json({
      data: contracts,
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

// --- GET /api/contracts/:id ---

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: req.params.id },
      include: {
        property: true,
        buyer: true,
        seller: true,
      },
    });

    if (!contract) {
      res.status(404).json({ error: 'Contract not found' });
      return;
    }

    res.json(contract);
  } catch (err) {
    next(err);
  }
});

// --- POST /api/contracts ---

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createContractSchema.parse(req.body);
    const contract = await prisma.contract.create({
      data,
      include: {
        property: { select: { id: true, title: true } },
        buyer: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
      },
    });
    res.status(201).json(contract);
  } catch (err) {
    next(err);
  }
});

// --- PUT /api/contracts/:id ---

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateContractSchema.parse(req.body);
    const contract = await prisma.contract.update({
      where: { id: req.params.id },
      data,
      include: {
        property: { select: { id: true, title: true } },
        buyer: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
      },
    });
    res.json(contract);
  } catch (err) {
    next(err);
  }
});

// --- DELETE /api/contracts/:id ---

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.contract.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
