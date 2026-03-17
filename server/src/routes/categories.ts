import { Router, Request, Response } from 'express';
import { create, listByUser, update } from '../models/category';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const categories = await listByUser(user.id as string);
  res.json(categories);
});

router.post('/', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, color, is_global } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name required' });
  }
  const userId = (is_global && user.role !== 'admin') ? null : user.id;
  const category = await create(userId as any, name, color as any, !!is_global);
  res.status(201).json(category);
});

router.put('/:id', async (req: Request, res: Response) => {
  const category = await update(req.params.id as string, req.body as any);
  if (!category) {
    return res.status(404).json({ error: 'Category not found or no changes' });
  }
  res.json(category);
});

export default router;
