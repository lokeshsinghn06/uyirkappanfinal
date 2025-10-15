import { Booking, Hospital, Ambulance, Offer } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

// Mock data for Chennai area
const mockHospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'Apollo Hospital',
    location: { lat: 13.0475, lng: 80.2565 },
    capabilities: ['ICU', 'TRAUMA', 'NEO'],
  },
  {
    id: 'h2',
    name: 'Fortis Malar Hospital',
    location: { lat: 13.0569, lng: 80.2481 },
    capabilities: ['ICU', 'CARDIO'],
  },
  {
    id: 'h3',
    name: 'MIOT International',
    location: { lat: 13.0332, lng: 80.2358 },
    capabilities: ['TRAUMA', 'NEO'],
  },
];

const mockAmbulances: Ambulance[] = [
  {
    id: 'a1',
    registration: 'TN01AB1234',
    type: 'BLS',
    location: { lat: 13.0527, lng: 80.2511 },
    status: 'ONLINE',
    driver: {
      id: 'd1',
      name: 'Rajesh Kumar',
      phone: '+919876543210',
      rating: 4.8,
    },
  },
  {
    id: 'a2',
    registration: 'TN01CD5678',
    type: 'ALS',
    location: { lat: 13.0412, lng: 80.2472 },
    status: 'ONLINE',
    driver: {
      id: 'd2',
      name: 'Priya Sharma',
      phone: '+919876543211',
      rating: 4.9,
    },
  },
  {
    id: 'a3',
    registration: 'TN01EF9012',
    type: 'NEO',
    location: { lat: 13.0621, lng: 80.2634 },
    status: 'ONLINE',
    driver: {
      id: 'd3',
      name: 'Arun Patel',
      phone: '+919876543212',
      rating: 4.7,
    },
  },
];

export const api = {
  // Bookings
  createBooking: async (data: Partial<Booking>): Promise<Booking> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const booking: Booking = {
      id: `BKG${Date.now()}`,
      code: `UYR${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    } as Booking;
    return booking;
  },

  getBooking: async (id: string): Promise<Booking> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      id,
      code: 'UYRABC123',
      status: 'ENROUTE',
      pickup: { lat: 13.0527, lng: 80.2511, address: '123 Anna Salai, Chennai' },
      hospital: mockHospitals[0],
      ambulanceType: 'BLS',
      patientName: 'John Doe',
      patientPhone: '+919876543210',
      contactPhone: '+919876543210',
      fare: 750,
      distance: 5000,
      eta: 600,
      ambulance: mockAmbulances[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateBookingStatus: async (id: string, status: Booking['status']): Promise<Booking> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const booking = await api.getBooking(id);
    return { ...booking, status, updatedAt: new Date().toISOString() };
  },

  // Ambulances
  getNearbyAmbulances: async (lat: number, lng: number): Promise<Ambulance[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAmbulances;
  },

  // Hospitals
  getNearbyHospitals: async (
    lat: number,
    lng: number,
    needs?: string[]
  ): Promise<Hospital[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockHospitals.filter(
      (h) => !needs || needs.some((need) => h.capabilities.includes(need))
    );
  },

  // Dashboard metrics
  getDashboardMetrics: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      avgEta: 8.5,
      activeTrips: 24,
      completionRate: 94.2,
      totalBookings: 1247,
    };
  },
};
