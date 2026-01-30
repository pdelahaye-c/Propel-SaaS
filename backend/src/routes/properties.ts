import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// --- Validation ---

const createPropertySchema = z.object({
  sku: z.string().min(1),
  title: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  price: z.number().positive(),
  status: z.enum(['FOR_SALE', 'SOLD', 'RENTED', 'UNDER_OFFER']).optional(),
  type: z.enum(['Apartment', 'House', 'Office', 'Building']).optional(),
  beds: z.number().int().min(0).optional(),
  baths: z.number().int().min(0).optional(),
  sqft: z.number().int().min(0).optional(),
  surface: z.number().min(0).optional(),
  imageUrl: z.string().optional(),
  features: z.array(z.string()).optional(),
});

const updatePropertySchema = createPropertySchema.partial();

// --- GET /api/properties ---

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, type, city, search, minPrice, maxPrice, page = '1', limit = '20' } = req.query;

    const where: any = {};

    if (status && typeof status === 'string') where.status = status;
    if (type && typeof type === 'string') where.type = type;
    if (city && typeof city === 'string') where.city = { contains: city };
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search } },
        { address: { contains: search } },
        { city: { contains: search } },
        { sku: { contains: search } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.property.count({ where }),
    ]);

    // Parse features from JSON string
    const parsed = properties.map(p => ({
      ...p,
      features: JSON.parse(p.features),
    }));

    res.json({
      data: parsed,
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

// --- GET /api/properties/:id ---

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        contracts: true,
      },
    });

    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    res.json({
      ...property,
      features: JSON.parse(property.features),
    });
  } catch (err) {
    next(err);
  }
});

// --- POST /api/properties ---

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createPropertySchema.parse(req.body);

    const property = await prisma.property.create({
      data: {
        ...data,
        features: JSON.stringify(data.features || []),
        createdById: req.user!.userId,
      },
    });

    res.status(201).json({
      ...property,
      features: JSON.parse(property.features),
    });
  } catch (err) {
    next(err);
  }
});

// --- PUT /api/properties/:id ---

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updatePropertySchema.parse(req.body);

    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: {
        ...data,
        features: data.features ? JSON.stringify(data.features) : undefined,
      },
    });

    res.json({
      ...property,
      features: JSON.parse(property.features),
    });
  } catch (err) {
    next(err);
  }
});

// --- DELETE /api/properties/:id ---

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.property.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
