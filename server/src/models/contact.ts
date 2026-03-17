import pool from '../config/database';

export interface Contact {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  tags: string[] | null;
  created_at: Date;
  updated_at: Date;
}

export async function create(userId: string, data: Partial<Contact>): Promise<Contact> {
  const res = await pool.query(
    `INSERT INTO contacts (user_id, full_name, email, phone, company, notes, tags)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, data.full_name, data.email || null, data.phone || null,
     data.company || null, data.notes || null, data.tags || null]
  );
  return res.rows[0];
}

export async function findByUser(userId: string): Promise<Contact[]> {
  const res = await pool.query('SELECT * FROM contacts WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return res.rows;
}

export async function findById(id: string): Promise<Contact | null> {
  const res = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
  return res.rows[0] || null;
}

export async function update(id: string, data: Partial<Contact>): Promise<Contact | null> {
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
  const q = `UPDATE contacts SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;
  const res = await pool.query(q, values);
  return res.rows[0] || null;
}

export async function remove(id: string): Promise<boolean> {
  const res = await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
  return res.rowCount !== null && res.rowCount > 0;
}
