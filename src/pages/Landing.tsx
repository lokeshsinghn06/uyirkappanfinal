import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, MapPin, Building2 } from 'lucide-react';
import { TopNav } from '@/components/TopNav';
import { motion } from 'framer-motion';

const Landing = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Activity,
      title: t('landing.multiOffer'),
      description: t('landing.multiOfferDesc'),
    },
    {
      icon: MapPin,
      title: t('landing.liveTracking'),
      description: t('landing.liveTrackingDesc'),
    },
    {
      icon: Building2,
      title: t('landing.hospitalAware'),
      description: t('landing.hospitalAwareDesc'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center"
        >
          <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl">
            {t('landing.hero')}
          </h1>
          <p className="mb-2 text-2xl font-medium text-primary md:text-3xl">
            {t('landing.tagline')}
          </p>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            {t('landing.description')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="rounded-2xl px-8 py-6 text-lg">
              <Link to="/book">{t('landing.bookAmbulance')}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-2xl px-8 py-6 text-lg"
            >
              <Link to="/auth">{t('landing.operatorLogin')}</Link>
            </Button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="h-full transition-smooth hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-20 grid gap-8 md:grid-cols-3"
        >
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold text-primary">24/7</div>
            <div className="text-lg text-muted-foreground">Available</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold text-primary">&lt;8</div>
            <div className="text-lg text-muted-foreground">Avg Response Time (min)</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold text-primary">94%</div>
            <div className="text-lg text-muted-foreground">Success Rate</div>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Uyirkappan. Emergency services platform.</p>
      </footer>
    </div>
  );
};

export default Landing;
