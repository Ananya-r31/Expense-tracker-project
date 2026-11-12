import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { transactions, budgets, categories } from './data.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => { res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('X-Frame-Options', 'DENY'); next(); });
const validDate = (value) => { if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const d = new Date(`${value}T00:00:00Z`); return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value; };
function validateTransaction(body) {
  const errors = [];
  if (!body || typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 80) errors.push('Title is required and must be 80 characters or fewer.');
  if (!Number.isFinite(Number(body?.amount)) || Number(body.amount) <= 0 || Number(body.amount) > 100000000) errors.push('Amount must be a positive number.');
  if (!['income', 'expense'].includes(body?.type)) errors.push('Type must be income or expense.');
  if (typeof body?.category !== 'string' || !categories.includes(body.category)) errors.push('Choose a valid category.');
  if (!validDate(body?.date)) errors.push('Date must use YYYY-MM-DD format.');
  if (body?.note !== undefined && (typeof body.note !== 'string' || body.note.length > 240)) errors.push('Note must be 240 characters or fewer.');
  return errors;
}
const filteredTransactions = (query) => transactions.filter(t => (!query.type || t.type === query.type) && (!query.category || t.category === query.category) && (!query.from || t.date >= query.from) && (!query.to || t.date <= query.to));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', storage: 'in-memory', transactionCount: transactions.length }));
app.get('/api/categories', (_req, res) => res.json(categories));
app.get('/api/transactions', (req, res) => res.json(filteredTransactions(req.query).sort((a,b) => b.date.localeCompare(a.date))));
app.post('/api/transactions', (req, res) => { const errors = validateTransaction(req.body); if (errors.length) return res.status(400).json({ errors }); const item = { id: randomUUID(), title: req.body.title.trim(), amount: Number(req.body.amount), type: req.body.type, category: req.body.category, date: req.body.date, recurring: Boolean(req.body.recurring), note: (req.body.note || '').trim() }; transactions.push(item); res.status(201).json(item); });
app.put('/api/transactions/:id', (req, res) => { const item = transactions.find(t => t.id === req.params.id); if (!item) return res.status(404).json({ error: 'Transaction not found.' }); const errors = validateTransaction(req.body); if (errors.length) return res.status(400).json({ errors }); Object.assign(item, { title: req.body.title.trim(), amount: Number(req.body.amount), type: req.body.type, category: req.body.category, date: req.body.date, recurring: Boolean(req.body.recurring), note: (req.body.note || '').trim() }); res.json(item); });
app.delete('/api/transactions/:id', (req, res) => { const i = transactions.findIndex(t => t.id === req.params.id); if (i < 0) return res.status(404).json({ error: 'Transaction not found.' }); transactions.splice(i, 1); res.status(204).end(); });
app.get('/api/budgets', (_req, res) => res.json(budgets));
app.put('/api/budgets/:category', (req, res) => { const category = req.params.category; const limit = Number(req.body?.limit); if (!categories.includes(category) || !Number.isFinite(limit) || limit < 0 || limit > 100000000) return res.status(400).json({ error: 'Provide a valid category and non-negative budget limit.' }); let budget = budgets.find(b => b.category === category); if (!budget) { budget = { id: randomUUID(), category, limit }; budgets.push(budget); } else budget.limit = limit; res.json(budget); });
app.get('/api/analytics', (req, res) => { const rows = filteredTransactions(req.query); const income = rows.filter(t => t.type === 'income').reduce((s,t) => s+t.amount,0); const expense = rows.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount,0); const byCategory = {}; const byMonth = {}; for (const t of rows) { if (t.type === 'expense') byCategory[t.category] = (byCategory[t.category] || 0) + t.amount; const month = t.date.slice(0,7); byMonth[month] ||= { month, income: 0, expense: 0 }; byMonth[month][t.type] += t.amount; } res.json({ income, expense, balance: income-expense, byCategory: Object.entries(byCategory).map(([category,amount]) => ({category,amount})).sort((a,b)=>b.amount-a.amount), byMonth: Object.values(byMonth).sort((a,b)=>a.month.localeCompare(b.month)) }); });
app.get('/api/export', (req, res) => { const rows = filteredTransactions(req.query); const esc = value => `"${String(value ?? '').replaceAll('"','""')}"`; const csv = ['Date,Title,Type,Category,Amount,Recurring,Note', ...rows.map(t => [t.date,t.title,t.type,t.category,t.amount,t.recurring ? 'Yes':'No',t.note].map(esc).join(','))].join('\r\n'); res.attachment('expense-transactions.csv').type('text/csv').send(csv); });
app.use('/api', (_req,res) => res.status(404).json({ error: 'API endpoint not found.' }));
{ const dist = path.resolve(__dirname, '../dist'); if (existsSync(path.join(dist, 'index.html'))) { app.use(express.static(dist)); app.get(/.*/, (_req,res) => res.sendFile(path.join(dist,'index.html'))); } }
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: 'Unexpected server error.' }); });
if (process.env.NODE_ENV !== 'test') app.listen(PORT, () => console.log(`Expense Tracker API running at http://localhost:${PORT}`));
export { app };
