const API_BASE = '/api';
const TOKEN_KEY = 'greenzo_auth_token_v2';

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

async function request(path, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read selected file'));
    reader.readAsDataURL(file);
  });
}

export const api = {
  // Storefront
  getCatalog: () => request('/catalog'),
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  validateCoupon: (code, subtotal) =>
    request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal })
    }),
  createOrder: (payload) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  trackOrder: (query) => request(`/orders/track/${encodeURIComponent(query)}`),
  bookConsultation: (payload) =>
    request('/consultations', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  subscribeNewsletter: (email) =>
    request('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),
  submitReview: (payload) =>
    request('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Authentication & Customer Account
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getMe: () => request('/auth/me'),
  updateProfile: (payload) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  // Razorpay Payments
  createRazorpayOrder: (items, couponCode) =>
    request('/payments/razorpay/create-order', {
      method: 'POST',
      body: JSON.stringify({ items, couponCode })
    }),
  verifyRazorpayAndPlace: (payload) =>
    request('/payments/razorpay/verify-and-place', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Admin Panel CRUD & Uploads
  admin: {
    getDashboard: () => request('/admin/dashboard'),
    uploadPhoto: async (file) => {
      const dataUrl = await fileToDataUrl(file);
      return request('/admin/upload', {
        method: 'POST',
        body: JSON.stringify({ filename: file.name, dataUrl })
      });
    },
    createProduct: (payload) =>
      request('/admin/products', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    updateProduct: (id, payload) =>
      request(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }),
    quickUpdateProduct: (id, payload) =>
      request(`/admin/products/${id}/quick`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      }),
    deleteProduct: (id) =>
      request(`/admin/products/${id}`, {
        method: 'DELETE'
      }),
    createCategory: (payload) =>
      request('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    createCoupon: (payload) =>
      request('/admin/coupons', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    updateCoupon: (id, payload) =>
      request(`/admin/coupons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }),
    deleteCoupon: (id) =>
      request(`/admin/coupons/${id}`, {
        method: 'DELETE'
      }),
    addGalleryPhoto: (payload) =>
      request('/admin/gallery', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    deleteGalleryPhoto: (id) =>
      request(`/admin/gallery/${id}`, {
        method: 'DELETE'
      }),
    saveSettings: (payload) =>
      request('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(payload)
      }),
    updateOrderStatus: (id, payload) =>
      request(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      }),
    updateConsultationStatus: (id, status) =>
      request(`/admin/consultations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
  }
};

export function getPotSwatchClass(colorName = '') {
  const lower = colorName.toLowerCase();
  if (lower.includes('sage')) return 'pot-swatch-sage';
  if (lower.includes('terracotta') || lower.includes('sand')) return 'pot-swatch-terracotta';
  if (lower.includes('charcoal') || lower.includes('black')) return 'pot-swatch-charcoal';
  return 'pot-swatch-ivory';
}
