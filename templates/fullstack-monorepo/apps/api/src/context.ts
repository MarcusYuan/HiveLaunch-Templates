import type { inferAsyncReturnType } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { db } from '@hivelaunch/database';

export async function createContext(opts: FetchCreateContextFnOptions) {
  // 从 cookie 或 header 获取 session
  // 这里暂时返回空 session，实际使用时需要集成 better-auth
  const session = {
    user: null,
  };

  return {
    db,
    session,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
