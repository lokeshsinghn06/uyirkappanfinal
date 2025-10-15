import { io, Socket } from 'socket.io-client';
import { Offer } from '@/contexts/DriverContext';

const MOCK_MODE = true;

let socket: Socket | null = null;
let mockIntervals: NodeJS.Timeout[] = [];

const generateMockOffer = (): Offer => {
  const offerId = `offer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const bookingId = `booking_${Date.now()}`;

  const pickupLat = 13.0827 + (Math.random() - 0.5) * 0.1;
  const pickupLng = 80.2707 + (Math.random() - 0.5) * 0.1;
  const hospitalLat = 13.0827 + (Math.random() - 0.5) * 0.1;
  const hospitalLng = 80.2707 + (Math.random() - 0.5) * 0.1;

  const types: ('BLS' | 'ALS' | 'NEO')[] = ['BLS', 'ALS', 'NEO'];
  const names = ['Rajesh Kumar', 'Priya Sharma', 'Anand Krishnan', 'Lakshmi Devi', 'Suresh Babu'];

  return {
    id: offerId,
    bookingId,
    riderName: names[Math.floor(Math.random() * names.length)],
    pickup: {
      lat: pickupLat,
      lng: pickupLng,
      addr: `${Math.floor(pickupLat * 100)}, Anna Nagar, Chennai`,
    },
    hospital: {
      lat: hospitalLat,
      lng: hospitalLng,
      addr: 'Apollo Hospital, Greams Road, Chennai',
    },
    type: types[Math.floor(Math.random() * types.length)],
    distanceKm: Math.floor(Math.random() * 15) + 2,
    etaMins: Math.floor(Math.random() * 25) + 5,
    expiresAt: Date.now() + 15000,
  };
};

export const joinDriverRoom = (
  driverId: string,
  onOffer: (offer: Offer) => void,
  onTripUpdate?: (data: { status?: string; eta?: number; location?: { lat: number; lng: number } }) => void
): (() => void) => {
  if (MOCK_MODE) {
    const interval = setInterval(() => {
      const offer = generateMockOffer();
      onOffer(offer);
    }, Math.random() * 4000 + 6000);

    mockIntervals.push(interval);

    return () => {
      clearInterval(interval);
      mockIntervals = mockIntervals.filter(i => i !== interval);
    };
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
  socket = io(socketUrl);

  socket.emit('driver:join', driverId);

  socket.on('offer:new', (offer: Offer) => {
    onOffer(offer);
  });

  if (onTripUpdate) {
    socket.on('trip:update', onTripUpdate);
  }

  return () => {
    if (socket) {
      socket.emit('driver:leave', driverId);
      socket.disconnect();
      socket = null;
    }
  };
};

export const leaveDriverRoom = () => {
  mockIntervals.forEach(interval => clearInterval(interval));
  mockIntervals = [];

  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const acceptOfferSocket = (offerId: string, driverId: string) => {
  if (MOCK_MODE) {
    console.log(`[MOCK] Driver ${driverId} accepted offer ${offerId}`);
    return;
  }

  if (socket) {
    socket.emit('offer:accept', { offerId, driverId });
  }
};

export const rejectOfferSocket = (offerId: string, driverId: string) => {
  if (MOCK_MODE) {
    console.log(`[MOCK] Driver ${driverId} rejected offer ${offerId}`);
    return;
  }

  if (socket) {
    socket.emit('offer:reject', { offerId, driverId });
  }
};

export const updateTripStatus = (bookingId: string, status: string, driverId: string) => {
  if (MOCK_MODE) {
    console.log(`[MOCK] Trip ${bookingId} status updated to ${status} by driver ${driverId}`);
    return;
  }

  if (socket) {
    socket.emit('trip:status', { bookingId, status, driverId });
  }
};

export const shareLocation = (bookingId: string, location: { lat: number; lng: number }) => {
  if (MOCK_MODE) {
    return;
  }

  if (socket) {
    socket.emit('driver:location', { bookingId, location });
  }
};
