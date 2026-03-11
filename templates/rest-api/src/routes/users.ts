import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { listUsers, getUser, createUser, updateUser, deleteUser } from '../services/users';

export const usersRoute = new Hono();

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

usersRoute.get('/', async (c) => {
  const users = await listUsers();
  return c.json({ users });
});

usersRoute.get('/:id', async (c) => {
  const id = c.req.param('id');
  const user = await getUser(id);
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }
  return c.json({ user });
});

usersRoute.post('/', zValidator('json', createUserSchema), async (c) => {
  const data = c.req.valid('json');
  const user = await createUser(data);
  return c.json({ user }, 201);
});

usersRoute.put('/:id', zValidator('json', updateUserSchema), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');
  const user = await updateUser(id, data);
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }
  return c.json({ user });
});

usersRoute.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await deleteUser(id);
  return c.json({ success: true });
});
