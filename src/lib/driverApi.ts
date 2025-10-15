import { Driver } from '@/contexts/DriverContext';

const MOCK_MODE = true;

export const driverApi = {
  login: async (phone: string, password: string): Promise<Driver> => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: `driver_${Date.now()}`,
        name: 'Kumar Venkatesh',
        phone,
        rating: 4.7,
        online: false,
        currentAmbulanceId: 'AMB-TN-0123',
      };
    }

    const response = await fetch('/api/driver/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  updateOnlineStatus: async (driverId: string, online: boolean): Promise<void> => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[MOCK] Driver ${driverId} is now ${online ? 'online' : 'offline'}`);
      return;
    }

    const response = await fetch(`/api/driver/${driverId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ online }),
    });

    if (!response.ok) {
      throw new Error('Failed to update status');
    }
  },

  getProfile: async (driverId: string): Promise<Driver> => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        id: driverId,
        name: 'Kumar Venkatesh',
        phone: '+91 98765 43210',
        rating: 4.7,
        online: false,
        currentAmbulanceId: 'AMB-TN-0123',
      };
    }

    const response = await fetch(`/api/driver/${driverId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },
};
