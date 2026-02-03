// API service for timezone operations
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const timezoneService = {
  async getAll(token) {
    const response = await fetch(`${API_BASE_URL}/timezones`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch timezones');
    }

    return await response.json();
  },

  async create(timezone, token) {
    const response = await fetch(`${API_BASE_URL}/timezones`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(timezone),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create timezone');
    }

    return await response.json();
  },

  async update(id, timezone, token) {
    const response = await fetch(`${API_BASE_URL}/timezones/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(timezone),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update timezone');
    }

    return await response.json();
  },

  async delete(id, token) {
    const response = await fetch(`${API_BASE_URL}/timezones/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete timezone');
    }

    return await response.json();
  },
};
