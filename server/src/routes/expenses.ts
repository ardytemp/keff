import { Router, Request, Response } from 'express';
import { create, findByUser, findById, update, remove } from '../models/expense';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { start, end } = req.query;
  const startDate = start ? new Date(start as string) : undefined;
  const endDate = end ? new Date(end as string) : undefined;
  const expenses = await findByUser(user.id as string, startDate, endDate);
  res.json(expenses);
});

router.post('/', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const expense = await create(user.id as string, req.body as any);
  res.status(201).json(expense);
});

router.get('/:id', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const expense = await findById(req.params.id as string);
  if (!expense || expense.user_id !== user.id) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  res.json(expense);
});

router.put('/:id', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const expense = await update(req.params.id as string, req.body as any);
  if (!expense) {
    return res.status(404).json({ error: 'Expense not found or no changes' });
  }
  if (expense.user_id !== user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  res.json(expense);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const expense = await findById(req.params.id as string);
  if (!expense || expense.user_id !== user.id) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  await remove(req.params.id as string);
  res.status(204).send();
});

export default router;
