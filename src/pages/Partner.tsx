import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDriver } from '@/contexts/DriverContext';
import { joinDriverRoom, leaveDriverRoom, acceptOfferSocket, rejectOfferSocket, updateTripStatus, shareLocation } from '@/lib/driverSocket';
import { driverApi } from '@/lib/driverApi';
import { OfferCard } from '@/components/OfferCard';
import { TripCard } from '@/components/TripCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from '@/hooks/use-toast';
import { Star, LogOut, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Partner = () => {
  const navigate = useNavigate();
  const {
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
    setLocationSharing,
  } = useDriver();

  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(!driver);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!driver || !online || activeTrip) return;

    const unsubscribe = joinDriverRoom(
      driver.id,
      (offer) => {
        setOffers((prev) => {
          if (prev.some(o => o.id === offer.id)) return prev;
          return [...prev, offer];
        });
        toast({
          title: 'New Ride Request',
          description: `${offer.riderName} needs ${offer.type} ambulance`,
        });
      }
    );

    return () => {
      unsubscribe();
      leaveDriverRoom();
    };
  }, [driver, online, activeTrip, setOffers]);

  useEffect(() => {
    if (!locationSharing || !activeTrip || !driver) return;

    const interval = setInterval(() => {
      const mockLat = 13.0827 + (Math.random() - 0.5) * 0.01;
      const mockLng = 80.2707 + (Math.random() - 0.5) * 0.01;
      shareLocation(activeTrip.bookingId, { lat: mockLat, lng: mockLng });
    }, 5000);

    return () => clearInterval(interval);
  }, [locationSharing, activeTrip, driver]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const driverData = await driverApi.login(phone, password);
      setDriver(driverData);
      localStorage.setItem('uyir_driver', JSON.stringify(driverData));
      setShowLogin(false);
      toast({
        title: 'Welcome!',
        description: `Logged in as ${driverData.name}`,
      });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setDriver(null);
    setOnline(false);
    localStorage.removeItem('uyir_driver');
    setShowLogin(true);
    toast({
      title: 'Logged Out',
      description: 'See you next time!',
    });
  };

  const handleToggleOnline = async (newOnline: boolean) => {
    if (!driver) return;

    setOnline(newOnline);
    toast({
      title: newOnline ? 'You are Online' : 'You are Offline',
      description: newOnline ? 'You will receive ride offers' : 'Stopped receiving offers',
    });

    try {
      await driverApi.updateOnlineStatus(driver.id, newOnline);
    } catch (error) {
      console.error('Failed to update online status', error);
    }
  };

  const handleAcceptOffer = (offerId: string) => {
    if (!driver) return;
    acceptOffer(offerId);
    acceptOfferSocket(offerId, driver.id);
    toast({
      title: 'Offer Accepted!',
      description: 'Trip details loaded',
    });
  };

  const handleRejectOffer = (offerId: string) => {
    if (!driver) return;
    rejectOffer(offerId);
    rejectOfferSocket(offerId, driver.id);
  };

  const handleStatusChange = (newStatus: string) => {
    if (!activeTrip || !driver) return;
    setStatus(newStatus as any);
    updateTripStatus(activeTrip.bookingId, newStatus, driver.id);

    const statusMessages: Record<string, string> = {
      ENROUTE: 'Heading to pickup location',
      AT_PICKUP: 'Arrived at pickup',
      TO_HOSPITAL: 'En route to hospital',
      COMPLETED: 'Trip completed!',
    };

    toast({
      title: 'Status Updated',
      description: statusMessages[newStatus] || 'Trip status updated',
    });
  };

  if (showLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Driver Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {driver.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{driver.name}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-warning text-warning" />
                <span className="font-mono">{driver.rating}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="online-toggle"
                className={`text-sm font-medium ${online ? 'text-accent' : 'text-muted-foreground'}`}
              >
                {online ? 'Online' : 'Offline'}
              </Label>
              <Switch
                id="online-toggle"
                checked={online}
                onCheckedChange={handleToggleOnline}
                disabled={!!activeTrip}
                aria-label="Toggle online status"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {activeTrip ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TripCard
              trip={activeTrip}
              locationSharing={locationSharing}
              onStatusChange={handleStatusChange}
              onLocationSharingChange={setLocationSharing}
            />
          </motion.div>
        ) : online ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Available Offers</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>{offers.length} pending</span>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {offers.length > 0 ? (
                offers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <OfferCard
                      offer={offer}
                      onAccept={() => handleAcceptOffer(offer.id)}
                      onReject={() => handleRejectOffer(offer.id)}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center"
                >
                  <Card>
                    <CardContent className="py-12">
                      <TrendingUp className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">Waiting for Offers</h3>
                      <p className="text-sm text-muted-foreground">
                        You will be notified when new ride requests come in
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="mb-2 text-lg font-semibold">You are Offline</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Toggle the switch above to start receiving ride offers
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        <p>Uyirkappan Driver v1.0.0 • Emergency Response Platform</p>
      </footer>
    </div>
  );
};

export default Partner;
