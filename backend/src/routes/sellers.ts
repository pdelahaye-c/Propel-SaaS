import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

const createSellerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
});

const updateSellerSchema = createSellerSchema.partial();

// --- GET /api/sellers ---

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;
    const where: any = {};

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const sellers = await prisma.seller.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: sellers });
  } catch (err) {
    next(err);
  }
});

// --- GET /api/sellers/:id ---

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const seller = await prisma.seller.findUnique({
      where: { id: req.params.id },
      include: { contracts: true },
    });

    if (!seller) {
      res.status(404).json({ error: 'Seller not found' });
      return;
    }

    res.json(seller);
  } catch (err) {
    next(err);
  }
});

// --- POST /api/sellers ---

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createSellerSchema.parse(req.body);
    const seller = await prisma.seller.create({ data });
    res.status(201).json(seller);
  } catch (err) {
    next(err);
  }
});

// --- PUT /api/sellers/:id ---

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateSellerSchema.parse(req.body);
    const seller = await prisma.seller.update({
      where: { id: req.params.id },
      data,
    });
    res.json(seller);
  } catch (err) {
    next(err);
  }
});

// --- DELETE /api/sellers/:id ---

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.seller.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
