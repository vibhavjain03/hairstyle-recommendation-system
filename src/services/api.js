const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth API
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
    return data;
  },

  // Scan API
  submitScan: async (formDataOrObject) => {
    let response;
    if (formDataOrObject instanceof FormData) {
      response = await fetch(`${API_BASE_URL}/scans`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formDataOrObject
      });
    } else {
      response = await fetch(`${API_BASE_URL}/scans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(formDataOrObject)
      });
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Scan analysis failed');
    return data;
  },

  getScanHistory: async () => {
    const res = await fetch(`${API_BASE_URL}/scans/history`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch scan history');
    return data;
  },

  // Hairstyles Catalog API
  getHairstyles: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/hairstyles?${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch hairstyles');
    return data;
  },

  // Feedback API
  submitFeedback: async (feedbackData) => {
    const res = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(feedbackData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit feedback');
    return data;
  }
};
