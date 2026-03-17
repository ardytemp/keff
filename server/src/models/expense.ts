import pool from '../config/database';

export interface Expense {
  id: string;
  user_id: string;
  contact_id: string | null;
  category_id: string | null;
  amount: string;
  currency: string;
  description: string | null;
  expense_date: Date;
  receipt_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function create(userId: string, data: Partial<Expense>): Promise<Expense> {
  const res = await pool.query(
    `INSERT INTO expenses (user_id, contact_id, category_id, amount, currency, description, expense_date, receipt_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [userId, data.contact_id || null, data.category_id || null,
     data.amount, data.currency || 'IDR', data.description || null,
     data.expense_date, data.receipt_url || null]
  );
  return res.rows[0];
}

export async function findByUser(userId: string, start?: Date, end?: Date): Promise<Expense[]> {
  const conditions: string[] = ['user_id = $1'];
  const values: any[] = [userId];
  let idx = 2;
  if (start) {
    conditions.push(`expense_date >= $${idx}`);
    values.push(start);
    idx++;
  }
  if (end) {
    conditions.push(`expense_date <= $${idx}`);
    values.push(end);
    idx++;
  }
  const q = `SELECT * FROM expenses WHERE ${conditions.join(' AND ')} ORDER BY expense_date DESC`;
  const res = await pool.query(q, values);
  return res.rows;
}

export async function findById(id: string): Promise<Expense | null> {
  const res = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
  return res.rows[0] || null;
}

export async function update(id: string, data: Partial<Expense>): Promise<Expense | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      fields.push(`${key} = $${idx}`);
      values.push((data as any)[key]);
      idx++;
    }
  }
  if (fields.length === 0) return null;
  values.push(id);
  const q = `UPDATE expenses SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
  const res = await pool.query(q, values);
  return res.rows[0] || null;
}

export async function remove(id: string): Promise<boolean> {
  const res = await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
  return res.rowCount !== null && res.rowCount > 0;
}
