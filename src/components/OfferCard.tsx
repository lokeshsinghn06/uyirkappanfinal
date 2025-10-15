import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Offer } from '@/contexts/DriverContext';
import { MapPin, Building2, Clock, Gauge } from 'lucide-react';
import { formatDistance } from '@/lib/routing';

interface OfferCardProps {
  offer: Offer;
  onAccept: () => void;
  onReject: () => void;
}

export const OfferCard = ({ offer, onAccept, onReject }: OfferCardProps) => {
  const [timeLeft, setTimeLeft] = useState(Math.floor((offer.expiresAt - Date.now()) / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.floor((offer.expiresAt - Date.now()) / 1000);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onReject();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [offer.expiresAt, onReject]);

  const progress = (timeLeft / 15) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <Card className={`transition-all ${isUrgent ? 'border-destructive shadow-lg' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">New Ride Request</CardTitle>
          <Badge variant={offer.type === 'BLS' ? 'secondary' : offer.type === 'ALS' ? 'default' : 'outline'}>
            {offer.type}
          </Badge>
        </div>
        <div className="text-sm font-semibold text-muted-foreground">{offer.riderName}</div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Pickup</div>
            <div className="text-sm font-medium">{offer.pickup.addr}</div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Building2 className="mt-1 h-4 w-4 flex-shrink-0 text-accent" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Destination</div>
            <div className="text-sm font-medium">{offer.hospital.addr}</div>
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <div className="flex items-center gap-1.5">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{formatDistance(offer.distanceKm * 1000)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{offer.etaMins} min</span>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${isUrgent ? 'text-destructive' : 'text-muted-foreground'}`}>
              {timeLeft > 0 ? `Expires in ${timeLeft}s` : 'Expired'}
            </span>
            <span className={`text-xs font-mono ${isUrgent ? 'text-destructive' : ''}`}>
              {Math.floor(progress)}%
            </span>
          </div>
          <Progress value={progress} className={isUrgent ? 'bg-destructive/20' : ''} />
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onReject}
          aria-label="Reject ride offer"
        >
          Reject
        </Button>
        <Button
          className="flex-1"
          onClick={onAccept}
          disabled={timeLeft <= 0}
          aria-label="Accept ride offer"
        >
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};
