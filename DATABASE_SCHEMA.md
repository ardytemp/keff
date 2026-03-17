# Keff Database Schema (PostgreSQL)

## Tables

### users
Core accounts for advisors and clients. Includes email, password hash, role.

### contacts
CRM contacts linked to a user. Stores name, email, phone, company, notes, tags.

### categories
Expense categories, can be user-specific or global. Name, color, is_global.

### expenses
Main transactions. Tracks amount, currency, description, date, optional receipt, linked to user, contact, category.

## Indexes
Optimized queries on:
- expenses by user + date
- expenses by contact
- contacts by user
- categories by user
