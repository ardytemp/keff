import pool from '../config/database';
import bcrypt from 'bcrypt';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export async function createUser(email: string, password: string, full_name?: string): Promise<User> {
  const password_hash = await bcrypt.hash(password, 12);
  const res = await pool.query(
    `INSERT INTO users (email, password_hash, full_name) 
     VALUES ($1, $2, $3) 
     RETURNING id, email, full_name, role, created_at, updated_at`,
    [email, password_hash, full_name || null]
  );
  return res.rows[0];
}

export async function findByEmail(email: string): Promise<User | null> {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0] || null;
}

export async function findById(id: string): Promise<User | null> {
  const res = await pool.query('SELECT id, email, full_name, role, created_at FROM users WHERE id = $1', [id]);
  return res.rows[0] || null;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return await bcrypt.compare(password, user.password_hash);
}
