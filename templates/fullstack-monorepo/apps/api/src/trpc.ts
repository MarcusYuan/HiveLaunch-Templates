import { initTRPC, TRPCError } from '@trpc/server';
import { db } from '@hivelaunch/database';

export interface Context {
  db: typeof db;
  session: {
    user: {
      id: string;
      email: string;
    } | null;
  };
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});
