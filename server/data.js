const today = new Date();
const date = (offset) => { const d = new Date(today); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };
export const transactions = [
  { id: 't1', title: 'Monthly salary', amount: 5200, type: 'income', category: 'Salary', date: date(-2), recurring: true, note: 'Monthly pay' },
  { id: 't2', title: 'Apartment rent', amount: 1450, type: 'expense', category: 'Housing', date: date(-4), recurring: true, note: '' },
  { id: 't3', title: 'Grocery run', amount: 126.4, type: 'expense', category: 'Food', date: date(-1), recurring: false, note: 'Weekly groceries' },
  { id: 't4', title: 'Electricity bill', amount: 82.7, type: 'expense', category: 'Utilities', date: date(-6), recurring: true, note: '' },
  { id: 't5', title: 'Freelance design', amount: 640, type: 'income', category: 'Freelance', date: date(-8), recurring: false, note: '' },
  { id: 't6', title: 'Coffee with friends', amount: 18.5, type: 'expense', category: 'Food', date: date(-3), recurring: false, note: '' },
  { id: 't7', title: 'Train pass', amount: 64, type: 'expense', category: 'Transport', date: date(-10), recurring: true, note: '' },
  { id: 't8', title: 'Streaming subscription', amount: 15.99, type: 'expense', category: 'Entertainment', date: date(-5), recurring: true, note: '' },
  { id: 't9', title: 'Book purchase', amount: 32, type: 'expense', category: 'Shopping', date: date(-12), recurring: false, note: '' },
  { id: 't10', title: 'Project bonus', amount: 300, type: 'income', category: 'Other', date: date(-15), recurring: false, note: '' }
];
export const budgets = [
  { id: 'b1', category: 'Food', limit: 350 }, { id: 'b2', category: 'Housing', limit: 1500 },
  { id: 'b3', category: 'Transport', limit: 180 }, { id: 'b4', category: 'Entertainment', limit: 100 },
  { id: 'b5', category: 'Shopping', limit: 200 }, { id: 'b6', category: 'Utilities', limit: 160 }
];
export const categories = ['Food', 'Housing', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Salary', 'Freelance', 'Other'];
