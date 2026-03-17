import pool from '../config/database';

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  color: string | null;
  is_global: boolean;
  created_at: Date;
}

export async function create(userId: string | null, name: string, color?: string, is_global = false): Promise<Category> {
  const res = await pool.query(
    `INSERT INTO categories (user_id, name, color, is_global)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, name, color || null, is_global]
  );
  return res.rows[0];
}

export async function listByUser(userId: string): Promise<Category[]> {
  const res = await pool.query(
    `SELECT * FROM categories 
     WHERE user_id = $1 OR is_global = true 
     ORDER BY is_global, name`,
    [userId]
  );
  return res.rows;
}

export async function update(id: string, data: Partial<Category>): Promise<Category | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const key in data) {
    if (data[key as keyof Category] !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(data[key as keyof Category]);
      idx++;
    }
  }
  if (fields.length === 0) return null;
  values.push(id);
  const q = `UPDATE categories SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
  const res = await pool.query(q, values);
  return res.rows[0] || null;
}
