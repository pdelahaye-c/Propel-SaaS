import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// --- GET /api/dashboard/kpis ---

router.get('/kpis', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalLeads, activeContracts, propertiesForSale, closedContracts] = await Promise.all([
      prisma.lead.count(),
      prisma.contract.count({ where: { status: 'Active' } }),
      prisma.property.count({ where: { status: 'FOR_SALE' } }),
      prisma.contract.count({ where: { status: 'Closed' } }),
    ]);

    // Calculate revenue potential from qualified+ leads using budgetMax
    const qualifiedLeads = await prisma.lead.findMany({
      where: { status: { in: ['QUALIFIED', 'NEGOTIATION'] } },
      select: { budgetMax: true, budgetMin: true },
    });
    const revenuePotential = qualifiedLeads.reduce(
      (sum, l) => sum + (l.budgetMax || l.budgetMin || 0),
      0
    );

    // Calculate conversion rate
    const closedLeads = await prisma.lead.count({ where: { status: 'CLOSED' } });
    const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0;

    res.json({
      totalLeads,
      activeContracts,
      propertiesForSale,
      closedContracts,
      revenuePotential,
      conversionRate: Math.round(conversionRate * 10) / 10,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
