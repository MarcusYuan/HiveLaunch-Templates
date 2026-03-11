import { OpenAPIHono, createRoute } from '@hono/zod-openapi';

const docRoute = createRoute({
  method: 'get',
  path: '/api/doc',
  tags: ['Documentation'],
  summary: 'OpenAPI 3.0 specification',
  description: 'Returns OpenAPI 3.0 specification in JSON format',
  responses: {
    200: {
      description: 'OpenAPI specification',
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    },
  },
});

export const docApp = new OpenAPIHono();

docApp.openapi(docRoute, () => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'REST API',
      version: '1.0.0',
      description: 'Hono + Drizzle + Zod + PostgreSQL',
    },
    servers: [
      {
        url: '/',
        description: 'Current server',
      },
    ],
    paths: {},
  };
});
