import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TopNav } from '@/components/TopNav';
import { StatusBadge } from '@/components/StatusBadge';
import { EtaPill } from '@/components/EtaPill';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MapLibre } from '@/components/MapLibre';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Booking } from '@/lib/types';
import { api } from '@/lib/api';
import { subscribeToBooking } from '@/lib/socket';
import { Phone, Share2, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Track = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { t } = useTranslation();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [ambulanceLocation, setAmbulanceLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;

    const loadBooking = async () => {
      try {
        const data = await api.getBooking(bookingId);
        setBooking(data);
        if (data.ambulance?.location) {
          setAmbulanceLocation(data.ambulance.location);
        }
      } catch (error) {
        toast({ title: t('common.error'), description: 'Failed to load booking', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    loadBooking();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToBooking(bookingId, (data) => {
      if (data.location) {
        setAmbulanceLocation(data.location);
      }
      if (data.status) {
        setBooking((prev) => (prev ? { ...prev, status: data.status } : null));
      }
      if (data.eta) {
        setBooking((prev) => (prev ? { ...prev, eta: data.eta } : null));
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [bookingId, t]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Track Ambulance',
        text: `Track my ambulance booking: ${booking?.code}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link Copied', description: 'Tracking link copied to clipboard' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <LoadingSpinner />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold">{t('common.error')}</h2>
          <p className="text-muted-foreground">Booking not found</p>
        </div>
      </div>
    );
  }

  const markers = [
    { location: booking.pickup, color: '#0EA5E9', popup: 'Pickup' },
    { location: booking.hospital.location, color: '#22C55E', popup: booking.hospital.name },
    ...(ambulanceLocation ? [{ location: ambulanceLocation, color: '#F59E0B', popup: 'Ambulance' }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('tracking.title')}</h1>
            <p className="font-mono text-lg text-muted-foreground">{booking.code}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map - Larger on desktop */}
          <div className="lg:col-span-2">
            <MapLibre
              center={ambulanceLocation || booking.pickup}
              markers={markers}
              route={booking.route}
              className="h-[500px] lg:h-[600px]"
            />
          </div>

          {/* Details Sidebar */}
          <div className="space-y-4">
            {/* ETA Card */}
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <EtaPill seconds={booking.eta} />
              </CardContent>
            </Card>

            {/* Driver Info */}
            {booking.ambulance?.driver && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('tracking.driver')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{booking.ambulance.driver.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.ambulance.registration}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-warning">
                      <Star className="h-4 w-4 fill-warning" />
                      <span className="font-mono font-semibold">
                        {booking.ambulance.driver.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled
                      aria-label="Call driver (unavailable)"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      {t('tracking.callDriver')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      aria-label="Share tracking link"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Patient</div>
                  <div className="font-semibold">{booking.patientName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Hospital</div>
                  <div className="font-semibold">{booking.hospital.name}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Ambulance Type</div>
                  <div className="font-semibold">{booking.ambulanceType}</div>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="text-muted-foreground">Fare</span>
                  <span className="font-mono text-lg font-bold text-accent">
                    ₹{booking.fare.toFixed(0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
