import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface AuthResult {
  user: { id: string; name: string; email: string };
  token: string;
}

export async function login(input: LoginInput): Promise<AuthResult | null> {
  const [user] = await db.select().from(users).where(eq(users.email, input.email));
  
  if (!user) return null;
  
  const isValid = await verifyPassword(input.password, user.passwordHash);
  if (!isValid) return null;
  
  const token = generateToken(user.id);
  
  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const passwordHash = await hashPassword(input.password);
  
  const [user] = await db.insert(users).values({
    name: input.name,
    email: input.email,
    passwordHash,
  }).returning();
  
  const token = generateToken(user.id);
  
  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
}

function generateToken(userId: string): string {
  // In production, use JWT
  return Buffer.from(userId).toString('base64');
}

async function hashPassword(password: string): Promise<string> {
  return Buffer.from(password).toString('base64');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return Buffer.from(password).toString('base64') === hash;
}
