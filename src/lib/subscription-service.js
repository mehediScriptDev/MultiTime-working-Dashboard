const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const subscriptionService = {
  // Get current subscription status
  async getStatus(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/subscription/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }

      return await response.json();
    } catch (error) {
      console.error('Subscription status error:', error);
      return null;
    }
  },

  // Get subscription usage info
  async getUsage(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/subscription/usage`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription usage');
      }

      return await response.json();
    } catch (error) {
      console.error('Subscription usage error:', error);
      return null;
    }
  },

  // Initiate upgrade flow (returns redirect URL or subscription data)
  async upgrade({ returnUrl, cancelUrl, token }) {
    try {
      const payload = { returnUrl, cancelUrl };
      console.log("Calling upgrade endpoint with:", { payload, token: token ? "present" : "missing" });

      const response = await fetch(`${API_BASE_URL}/subscription/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Upgrade response:", { status: response.status, data, fullData: JSON.stringify(data) });

      if (!response.ok) {
        // Build detailed validation message if available
        let errorMsg = data?.message || data?.error || `HTTP ${response.status}`;
        try {
          if (Array.isArray(data?.errors) && data.errors.length) {
            const details = data.errors.map(e => `${e.param || e.field || e.key}: ${e.msg || e.message || JSON.stringify(e)}`);
            errorMsg = `${errorMsg} — ${details.join('; ')}`;
          }
        } catch (e) {
          console.warn('Failed to parse validation errors', e);
        }
        console.error("Upgrade validation error details:", data);
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error('Subscription upgrade error:', error);
      throw error;
    }
  },

  // Fix failed upgrade
  async fixUpgrade(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/subscription/upgrade/fix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fix upgrade');
      }

      return data;
    } catch (error) {
      console.error('Subscription fix error:', error);
      throw error;
    }
  },

  // Cancel subscription
  async cancel(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/subscription/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to cancel subscription');
      }

      return data;
    } catch (error) {
      console.error('Subscription cancel error:', error);
      throw error;
    }
  },
};
