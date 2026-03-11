import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const helloRouter = router({
  greet: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        message: `Hello ${input.text}!`,
      };
    }),
});
