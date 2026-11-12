import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const port = 3199;
let server;
test('Expense Tracker API supports health, transaction validation, CRUD and analytics', async (t) => {
  server = spawn(process.execPath, ['server/index.js'], { env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  t.after(() => server?.kill());
  let ready = false;
  for (let i=0; i<40; i++) { try { const r=await fetch(`http://localhost:${port}/api/health`); if(r.ok){ready=true;break;} } catch {} await delay(100); }
  assert.equal(ready, true, 'API server should start');
  const health = await (await fetch(`http://localhost:${port}/api/health`)).json(); assert.equal(health.storage,'in-memory');
  const invalid = await fetch(`http://localhost:${port}/api/transactions`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ title:'', amount:-2 }) }); assert.equal(invalid.status,400);
  const created = await fetch(`http://localhost:${port}/api/transactions`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ title:'Test purchase', amount:12.5, type:'expense', category:'Food', date:'2026-11-12', recurring:false, note:'test' }) });
  assert.equal(created.status,201); const item=await created.json();
  const list = await (await fetch(`http://localhost:${port}/api/transactions`)).json(); assert.ok(list.some(t=>t.id===item.id));
  const analytics = await (await fetch(`http://localhost:${port}/api/analytics`)).json(); assert.ok(analytics.expense >= 12.5);
  const removed = await fetch(`http://localhost:${port}/api/transactions/${item.id}`, {method:'DELETE'}); assert.equal(removed.status,204);
  const csv = await fetch(`http://localhost:${port}/api/export`); assert.match(csv.headers.get('content-type'),/text\/csv/);
});
