import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@hivelaunch/api';

export const trpc = createTRPCReact<AppRouter>();
