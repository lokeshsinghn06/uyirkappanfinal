import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  online: boolean;
  currentAmbulanceId?: string;
}

export interface Offer {
  id: string;
  bookingId: string;
  riderName: string;
  pickup: { lat: number; lng: number; addr: string };
  hospital: { lat: number; lng: number; addr: string };
  type: 'BLS' | 'ALS' | 'NEO';
  distanceKm: number;
  etaMins: number;
  expiresAt: number;
}

export type TripStatus = 'ACCEPTED' | 'ENROUTE' | 'AT_PICKUP' | 'TO_HOSPITAL' | 'COMPLETED' | 'CANCELED';

export interface LiveTrip {
  bookingId: string;
  pickup: { lat: number; lng: number; addr: string };
  hospital: { lat: number; lng: number; addr: string };
  status: TripStatus;
  etaMins: number;
  polyline?: string;
  riderName: string;
  type: 'BLS' | 'ALS' | 'NEO';
  distanceKm: number;
}

interface DriverContextType {
  driver: Driver | null;
  online: boolean;
  offers: Offer[];
  activeTrip: LiveTrip | null;
  locationSharing: boolean;
  setDriver: (driver: Driver | null) => void;
  setOnline: (online: boolean) => void;
  setOffers: (offers: Offer[]) => void;
  acceptOffer: (offerId: string) => void;
  rejectOffer: (offerId: string) => void;
  setStatus: (status: TripStatus) => void;
  setEta: (mins: number) => void;
  endTrip: () => void;
  setLocationSharing: (sharing: boolean) => void;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [online, setOnlineState] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeTrip, setActiveTrip] = useState<LiveTrip | null>(null);
  const [locationSharing, setLocationSharing] = useState(false);

  useEffect(() => {
    const storedDriver = localStorage.getItem('uyir_driver');
    if (storedDriver) {
      const driverData = JSON.parse(storedDriver);
      setDriver(driverData);
    }
  }, []);

  const setOnline = useCallback((newOnline: boolean) => {
    setOnlineState(newOnline);
    if (driver) {
      const updatedDriver = { ...driver, online: newOnline };
      setDriver(updatedDriver);
      localStorage.setItem('uyir_driver', JSON.stringify(updatedDriver));
    }
    if (!newOnline) {
      setOffers([]);
    }
  }, [driver]);

  const acceptOffer = useCallback((offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    const newTrip: LiveTrip = {
      bookingId: offer.bookingId,
      pickup: offer.pickup,
      hospital: offer.hospital,
      status: 'ACCEPTED',
      etaMins: offer.etaMins,
      riderName: offer.riderName,
      type: offer.type,
      distanceKm: offer.distanceKm,
    };

    setActiveTrip(newTrip);
    setOffers([]);
    setLocationSharing(true);
  }, [offers]);

  const rejectOffer = useCallback((offerId: string) => {
    setOffers(prev => prev.filter(o => o.id !== offerId));
  }, []);

  const setStatus = useCallback((status: TripStatus) => {
    if (activeTrip) {
      setActiveTrip({ ...activeTrip, status });
      if (status === 'COMPLETED' || status === 'CANCELED') {
        setTimeout(() => {
          setActiveTrip(null);
          setLocationSharing(false);
        }, 1000);
      }
    }
  }, [activeTrip]);

  const setEta = useCallback((mins: number) => {
    if (activeTrip) {
      setActiveTrip({ ...activeTrip, etaMins: mins });
    }
  }, [activeTrip]);

  const endTrip = useCallback(() => {
    setActiveTrip(null);
    setLocationSharing(false);
  }, []);

  return (
    <DriverContext.Provider
      value={{
        driver,
        online,
        offers,
        activeTrip,
        locationSharing,
        setDriver,
        setOnline,
        setOffers,
        acceptOffer,
        rejectOffer,
        setStatus,
        setEta,
        endTrip,
        setLocationSharing,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDriver must be used within DriverProvider');
  }
  return context;
};
