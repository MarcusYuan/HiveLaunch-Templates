import { Context } from 'hono';

export function errorHandler(err: Error, c: Context) {
  console.error('Error:', err);
  
  if (err.name === 'ZodError') {
    return c.json({ error: 'Validation error', details: err.message }, 400);
  }
  
  return c.json({ error: 'Internal Server Error' }, 500);
}
