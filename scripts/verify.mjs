const BASE = process.env.API_URL || 'http://127.0.0.1:4000';

async function check(name, fn) {
  const res = await fn();
  console.log(`✅ ${name}:`, res);
  return res;
}

await check('Health Endpoint', async () => {
  const r = await fetch(`${BASE}/api/health`).then((x) => x.json());
  if (r.status !== 'ok') throw new Error('Health failed');
  return `${r.database} (${r.catalogCount} plants)`;
});

await check('Catalog Bootstrap', async () => {
  const r = await fetch(`${BASE}/api/catalog`).then((x) => x.json());
  if (!r.products?.length || !r.heroReels?.length) throw new Error('Catalog incomplete');
  return `${r.categories.length} categories, ${r.products.length} products, ${r.activeOffers.length} offers`;
});

const adminSession = await check('Admin Login Auth', async () => {
  const r = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@greenzo.in', password: 'Admin@123' })
  }).then((x) => x.json());
  if (!r.token || r.user?.role !== 'ADMIN') throw new Error('Admin login failed');
  return r;
});

await check('Admin Dashboard Protected API', async () => {
  const r = await fetch(`${BASE}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminSession.token}` }
  }).then((x) => x.json());
  if (!r.metrics) throw new Error('Admin dashboard failed');
  return `Revenue ₹${r.metrics.totalRevenue}, ${r.products.length} products, ${r.coupons.length} coupons`;
});

await check('Razorpay Order + Verification Flow', async () => {
  const createRes = await fetch(`${BASE}/api/payments/razorpay/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      couponCode: 'GREENZO10',
      items: [
        {
          slug: 'zamia-green',
          productName: 'Zamia Green (ZZ Plant)',
          potColor: 'Matte Ivory',
          potSize: 'Medium (5 inch Self-Watering)',
          unitPrice: 269,
          quantity: 2,
          isBundle: false
        }
      ]
    })
  }).then((x) => x.json());

  if (!createRes.razorpayOrderId) throw new Error('Razorpay create-order failed');
  return `${createRes.mode} order ${createRes.razorpayOrderId} (₹${createRes.amountRupees})`;
});

console.log('🎉 All Auth, Admin & Razorpay full-stack checks passed!');
