export type BookingStatus =
  | 'REQUESTED'
  | 'OFFERING'
  | 'ACCEPTED'
  | 'ENROUTE'
  | 'AT_PICKUP'
  | 'TO_HOSPITAL'
  | 'COMPLETED'
  | 'CANCELED';

export type AmbulanceType = 'BLS' | 'ALS' | 'NEO';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: Location;
  capabilities: string[];
  distance?: number;
  eta?: number;
}

export interface Ambulance {
  id: string;
  registration: string;
  type: AmbulanceType;
  location: Location;
  status: 'ONLINE' | 'OFFLINE' | 'BUSY';
  driver?: Driver;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  avatar?: string;
}

export interface Booking {
  id: string;
  code: string;
  status: BookingStatus;
  pickup: Location;
  hospital: Hospital;
  ambulanceType: AmbulanceType;
  patientName: string;
  patientPhone: string;
  contactPhone: string;
  fare: number;
  distance: number;
  eta: number;
  ambulance?: Ambulance;
  route?: [number, number][];
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  ambulance: Ambulance;
  distance: number;
  eta: number;
  fare: number;
}
