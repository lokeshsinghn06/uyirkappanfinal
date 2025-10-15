import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Landing
      landing: {
        tagline: 'Milliseconds save lives.',
        hero: 'On-demand emergency ambulance service',
        description: 'Real-time tracking, multi-offer dispatch, and hospital-aware routing',
        bookAmbulance: 'Book Ambulance',
        operatorLogin: 'Operator Login',
        multiOffer: 'Multi-offer dispatch',
        multiOfferDesc: 'Multiple ambulances can bid for your request',
        liveTracking: 'Live tracking',
        liveTrackingDesc: 'Track your ambulance in real-time',
        hospitalAware: 'Hospital-aware routing',
        hospitalAwareDesc: 'Optimal routes to the right hospital',
      },
      // Booking
      booking: {
        title: 'Book Ambulance',
        step1: 'Pickup Details',
        step2: 'Hospital & Ambulance',
        step3: 'Confirmation',
        pickup: 'Pickup Location',
        searchAddress: 'Search address...',
        patientName: 'Patient Name',
        patientPhone: 'Patient Phone',
        selectHospital: 'Select Hospital',
        ambulanceType: 'Ambulance Type',
        bls: 'Basic Life Support',
        als: 'Advanced Life Support',
        neo: 'Neonatal',
        distance: 'Distance',
        eta: 'ETA',
        fare: 'Estimated Fare',
        contact: 'Contact Number',
        otp: 'Enter OTP',
        next: 'Next',
        back: 'Back',
        confirm: 'Confirm Booking',
        findingAmbulances: 'Finding nearby ambulances...',
        offersReceived: 'Offers Received',
        accept: 'Accept',
      },
      // Tracking
      tracking: {
        title: 'Track Ambulance',
        bookingCode: 'Booking Code',
        driver: 'Driver',
        ambulance: 'Ambulance',
        rating: 'Rating',
        callDriver: 'Call Driver',
        shareLocation: 'Share Location',
        status: {
          REQUESTED: 'Requested',
          OFFERING: 'Receiving Offers',
          ACCEPTED: 'Accepted',
          ENROUTE: 'En Route to Pickup',
          AT_PICKUP: 'At Pickup Location',
          TO_HOSPITAL: 'Going to Hospital',
          COMPLETED: 'Completed',
          CANCELED: 'Canceled',
        },
      },
      // Dashboard
      dashboard: {
        title: 'Dashboard',
        liveRequests: 'Live Requests',
        activeTrips: 'Active Trips',
        fleet: 'Fleet',
        drivers: 'Drivers',
        hospitals: 'Hospitals',
        analytics: 'Analytics',
        avgEta: 'Avg ETA',
        activeTripsCount: 'Active Trips',
        completionRate: 'Completion Rate',
      },
      // Partner
      partner: {
        title: 'Driver Portal',
        goOnline: 'Go Online',
        goOffline: 'Go Offline',
        newRequest: 'New Request',
        accept: 'Accept',
        reject: 'Reject',
        navigate: 'Navigate',
      },
      // Auth
      auth: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        forgotPassword: 'Forgot Password?',
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: 'Already have an account?',
      },
      // Common
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        retry: 'Retry',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        noResults: 'No results found',
      },
    },
  },
  ta: {
    translation: {
      // Landing
      landing: {
        tagline: 'மில்லி விநாடிகள் உயிர்களைக் காக்கும்.',
        hero: 'தேவைக்கேற்ற அவசர ஆம்புலன்ஸ் சேவை',
        description: 'நேரடி கண்காணிப்பு, பல சலுகை அனுப்புதல் மற்றும் மருத்துவமனை-விழிப்புணர்வு வழிகாட்டுதல்',
        bookAmbulance: 'ஆம்புலன்ஸ் முன்பதிவு',
        operatorLogin: 'இயக்குநர் உள்நுழைவு',
        multiOffer: 'பல சலுகை அனுப்புதல்',
        multiOfferDesc: 'உங்கள் கோரிக்கைக்கு பல ஆம்புலன்ஸ்கள் ஏலம் எடுக்கலாம்',
        liveTracking: 'நேரடி கண்காணிப்பு',
        liveTrackingDesc: 'உங்கள் ஆம்புலன்ஸை நேரடியாகக் கண்காணியுங்கள்',
        hospitalAware: 'மருத்துவமனை-விழிப்புணர்வு வழிகாட்டுதல்',
        hospitalAwareDesc: 'சரியான மருத்துவமனைக்கு உகந்த வழிகள்',
      },
      // Add more Tamil translations as needed
      common: {
        loading: 'ஏற்றுகிறது...',
        error: 'பிழை ஏற்பட்டது',
        retry: 'மீண்டும் முயற்சிக்கவும்',
        cancel: 'ரத்து செய்',
        save: 'சேமி',
        delete: 'நீக்கு',
        edit: 'திருத்து',
        close: 'மூடு',
        search: 'தேடு',
        filter: 'வடிகட்டு',
        sort: 'வரிசைப்படுத்து',
        noResults: 'முடிவுகள் இல்லை',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
