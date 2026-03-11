import { Hono, Context } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { swaggerUI } from '@hono/swagger-ui';

import { healthRoute } from './routes/health';
import { usersRoute } from './routes/users';
import { authRoute } from './routes/auth';
import { docApp } from './routes/doc';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());
app.use('*', prettyJSON());

// Routes
app.route('/health', healthRoute);
app.route('/api/users', usersRoute);
app.route('/api/auth', authRoute);
app.route('/', docApp);

// Swagger UI
app.get('/docs', swaggerUI({ url: '/api/doc' }));

// Error handler
app.onError((err: Error, c: Context) => {
  console.error(err);
  return c.json({ error: err.message }, 500);
});

export default app;
