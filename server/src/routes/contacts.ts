import { Router, Request, Response } from 'express';
import { create, findByUser, findById, update, remove } from '../models/contact';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const contacts = await findByUser(user.id as string);
  res.json(contacts);
});

router.post('/', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const contact = await create(user.id as string, req.body as any);
  res.status(201).json(contact);
});

router.get('/:id', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const contact = await findById(req.params.id as string);
  if (!contact || contact.user_id !== user.id) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res.json(contact);
});

router.put('/:id', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const contact = await update(req.params.id as string, req.body as any);
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found or no changes' });
  }
  if (contact.user_id !== user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  res.json(contact);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const contact = await findById(req.params.id as string);
  if (!contact || contact.user_id !== user.id) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  await remove(req.params.id as string);
  res.status(204).send();
});

export default router;
