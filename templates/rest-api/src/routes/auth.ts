import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { login, register } from '../services/auth';

export const authRoute = new Hono();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

authRoute.post('/login', zValidator('json', loginSchema), async (c) => {
  const data = c.req.valid('json');
  const result = await login(data);
  if (!result) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }
  return c.json(result);
});

authRoute.post('/register', zValidator('json', registerSchema), async (c) => {
  const data = c.req.valid('json');
  const result = await register(data);
  return c.json(result, 201);
});
