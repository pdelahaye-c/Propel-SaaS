import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[Error]', err.message);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (err.message.includes('Unique constraint')) {
    res.status(409).json({ error: 'A record with this value already exists' });
    return;
  }

  if (err.message.includes('Record to update not found') || err.message.includes('Record to delete does not exist')) {
    res.status(404).json({ error: 'Record not found' });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}
