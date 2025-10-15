import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LiveTrip, TripStatus } from '@/contexts/DriverContext';
import { StatusBadge } from '@/components/StatusBadge';
import { EtaPill } from '@/components/EtaPill';
import { MapPin, Building2, Navigation, Gauge } from 'lucide-react';
import { formatDistance } from '@/lib/routing';

interface TripCardProps {
  trip: LiveTrip;
  locationSharing: boolean;
  onStatusChange: (status: TripStatus) => void;
  onLocationSharingChange: (enabled: boolean) => void;
}

const getNextAction = (status: TripStatus): { label: string; nextStatus: TripStatus } | null => {
  switch (status) {
    case 'ACCEPTED':
      return { label: 'Start to Pickup', nextStatus: 'ENROUTE' };
    case 'ENROUTE':
      return { label: 'Arrived at Pickup', nextStatus: 'AT_PICKUP' };
    case 'AT_PICKUP':
      return { label: 'Start to Hospital', nextStatus: 'TO_HOSPITAL' };
    case 'TO_HOSPITAL':
      return { label: 'Complete Trip', nextStatus: 'COMPLETED' };
    default:
      return null;
  }
};

const getNavigationUrl = (trip: LiveTrip): string => {
  const destination = trip.status === 'ACCEPTED' || trip.status === 'ENROUTE'
    ? trip.pickup
    : trip.hospital;

  return `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&travelmode=driving`;
};

export const TripCard = ({ trip, locationSharing, onStatusChange, onLocationSharingChange }: TripCardProps) => {
  const nextAction = getNextAction(trip.status);
  const navUrl = getNavigationUrl(trip);

  return (
    <Card className="border-primary shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Active Trip</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={trip.type === 'BLS' ? 'secondary' : trip.type === 'ALS' ? 'default' : 'outline'}>
              {trip.type}
            </Badge>
            <StatusBadge status={trip.status} />
          </div>
        </div>
        <div className="text-sm font-semibold text-muted-foreground">{trip.riderName}</div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Pickup</div>
              <div className="text-sm font-medium">{trip.pickup.addr}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Building2 className="mt-1 h-4 w-4 flex-shrink-0 text-accent" />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Hospital</div>
              <div className="text-sm font-medium">{trip.hospital.addr}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{formatDistance(trip.distanceKm * 1000)}</span>
            </div>
            <EtaPill seconds={trip.etaMins * 60} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            <Label htmlFor="location-sharing" className="text-sm font-medium">
              Share Location
            </Label>
          </div>
          <Switch
            id="location-sharing"
            checked={locationSharing}
            onCheckedChange={onLocationSharingChange}
            aria-label="Toggle location sharing"
          />
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => window.open(navUrl, '_blank')}
          aria-label="Open navigation in Google Maps"
        >
          <Navigation className="mr-2 h-4 w-4" />
          Navigate
        </Button>
        {nextAction && (
          <Button
            className="flex-1"
            onClick={() => onStatusChange(nextAction.nextStatus)}
            aria-label={nextAction.label}
          >
            {nextAction.label}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
