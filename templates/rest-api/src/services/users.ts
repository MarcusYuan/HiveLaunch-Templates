import { db } from '../db';
import { users, type User, type NewUser } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function listUsers(): Promise<User[]> {
  return db.select().from(users);
}

export async function getUser(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function createUser(data: Omit<NewUser, 'passwordHash'> & { password: string }): Promise<User> {
  const { password, ...rest } = data;
  const passwordHash = await hashPassword(password);
  
  const [user] = await db.insert(users).values({
    ...rest,
    passwordHash,
  }).returning();
  
  return user;
}

export async function updateUser(id: string, data: Partial<Omit<NewUser, 'id'>>): Promise<User | undefined> {
  const [user] = await db.update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id));
}

async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt or argon2
  return Buffer.from(password).toString('base64');
}
