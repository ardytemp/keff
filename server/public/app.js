const API_BASE = '';
let token = localStorage.getItem('token') || '';
const views = { login: document.getElementById('login-view'), dashboard: document.getElementById('dashboard-view') };
const tabs = { expenses: document.getElementById('expenses-tab'), contacts: document.getElementById('contacts-tab'), categories: document.getElementById('categories-tab') };
const tabBtns = document.querySelectorAll('.tab-btn');

function hideAllTabs() { Object.values(tabs).forEach(el => el.classList.remove('active')); tabBtns.forEach(btn => btn.classList.remove('active')); }
function showTab(name) { hideAllTabs(); tabs[name].classList.add('active'); document.querySelector(`[data-tab="${name}"]`).classList.add('active'); if (name === 'expenses') loadExpenses(); if (name === 'contacts') loadContacts(); if (name === 'categories') loadCategories(); }
function showLogin() { views.login.classList.remove('hidden'); views.dashboard.classList.add('hidden'); }
function showDashboard() { views.login.classList.add('hidden'); views.dashboard.classList.remove('hidden'); showTab('expenses'); }

async function request(method, path, body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API_BASE + path, opts);
  if (res.status === 401) { localStorage.removeItem('token'); token = ''; showLogin(); throw new Error('Unauthorized'); }
  const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Error'); return data;
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  try { const data = await request('POST', '/api/auth/login', { email: document.getElementById('email').value, password: document.getElementById('password').value }); token = data.token; localStorage.setItem('token', token); showDashboard(); } catch (err) { document.getElementById('login-error').textContent = err.message; }
});

document.getElementById('logout-btn').addEventListener('click', () => { localStorage.removeItem('token'); token = ''; showLogin(); });
tabBtns.forEach(btn => btn.addEventListener('click', () => showTab(btn.dataset.tab)));

async function loadExpenses() {
  try { const expenses = await request('GET', '/api/expenses'); const list = document.getElementById('expenses-list'); list.innerHTML = ''; expenses.forEach(exp => { const li = document.createElement('li'); li.innerHTML = `<div><strong>${exp.amount} ${exp.currency}</strong><span>${exp.expense_date}</span><p>${exp.description || ''}</p></div><button class="delete" data-id="${exp.id}">Delete</button>`; list.appendChild(li); }); document.querySelectorAll('#expenses-list .delete').forEach(btn => { btn.addEventListener('click', async () => { if (!confirm('Delete?')) return; try { await request('DELETE', `/api/expenses/${btn.dataset.id}`); loadExpenses(); } catch (err) { alert(err.message); } }); }); } catch (err) { console.error(err); }
}

async function loadContacts() {
  try { const contacts = await request('GET', '/api/contacts'); const list = document.getElementById('contacts-list'); list.innerHTML = ''; contacts.forEach(c => { const li = document.createElement('li'); li.innerHTML = `<div><strong>${c.full_name}</strong><p>${c.email || ''} ${c.phone || ''}</p></div><button class="delete" data-id="${c.id}">Delete</button>`; list.appendChild(li); }); document.querySelectorAll('#contacts-list .delete').forEach(btn => { btn.addEventListener('click', async () => { if (!confirm('Delete?')) return; try { await request('DELETE', `/api/contacts/${btn.dataset.id}`); loadContacts(); } catch (err) { alert(err.message); } }); }); } catch (err) { console.error(err); }
}

async function loadCategories() {
  try { const categories = await request('GET', '/api/categories'); const list = document.getElementById('categories-list'); list.innerHTML = ''; categories.forEach(cat => { const li = document.createElement('li'); li.innerHTML = `<div><strong>${cat.name}</strong><span style="color:${cat.color||'#000'}">●</span></div>`; list.appendChild(li); }); } catch (err) { console.error(err); }
}

document.getElementById('expense-form').addEventListener('submit', async (e) => { e.preventDefault(); try { await request('POST', '/api/expenses', { amount: document.getElementById('exp-amount').value, expense_date: document.getElementById('exp-date').value, contact_id: document.getElementById('exp-contact').value || null, category_id: document.getElementById('exp-category').value || null, description: document.getElementById('exp-desc').value, currency: 'IDR' }); e.target.reset(); loadExpenses(); } catch (err) { alert(err.message); } });
document.getElementById('contact-form').addEventListener('submit', async (e) => { e.preventDefault(); try { await request('POST', '/api/contacts', { full_name: document.getElementById('contact-name').value, email: document.getElementById('contact-email').value || null, phone: document.getElementById('contact-phone').value || null, company: document.getElementById('contact-company').value || null }); e.target.reset(); loadContacts(); } catch (err) { alert(err.message); } });
document.getElementById('category-form').addEventListener('submit', async (e) => { e.preventDefault(); try { await request('POST', '/api/categories', { name: document.getElementById('category-name').value, color: document.getElementById('category-color').value || null }); e.target.reset(); loadCategories(); } catch (err) { alert(err.message); } });

(async () => { if (token) { showDashboard(); setTimeout(async () => { try { const contacts = await request('GET', '/api/contacts'); const sel = document.getElementById('exp-contact'); sel.innerHTML = '<option value="">None</option>'; contacts.forEach(c => sel.add(new Option(c.full_name, c.id))); } catch {} try { const categories = await request('GET', '/api/categories'); const sel = document.getElementById('exp-category'); sel.innerHTML = '<option value="">None</option>'; categories.forEach(cat => sel.add(new Option(cat.name, cat.id))); } catch {} }, 200); } else { showLogin(); } })();
