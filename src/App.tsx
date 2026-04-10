/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  CloudSun, 
  Mic, 
  MapPin, 
  Droplets, 
  Thermometer, 
  Wind, 
  AlertTriangle,
  Settings,
  Home,
  Database,
  MessageSquare,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Languages,
  Info,
  ExternalLink,
  ArrowRight,
  Moon,
  Sun,
  Scale,
  Award,
  Filter,
  Check,
  TrendingUp,
  Plus,
  Calendar,
  Lightbulb,
  Sparkles,
  Bug as BugIcon,
  Activity,
  CloudRain,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { AppState, Language, SoilData, WeatherData, MarketPrice, Crop, PriceAlert } from './types';
import { CROPS, DISEASES, TRANSLATIONS, EXPERT_TIPS } from './constants';
import { fetchSoilData, fetchWeatherData, reverseGeocode, getGeminiResponse, searchLocation, fetchMarketNews } from './services';
import { cn } from './utils';
import WeatherMap from './components/WeatherMap';
import MarketView from './components/MarketView';
import NewsSection from './components/NewsSection';

function LoadingScreen({ onSkip }: { onSkip?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sprout className="text-primary animate-pulse" size={24} />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-text">KisanSense</h3>
        <p className="text-xs text-secondary animate-pulse">Analyzing agricultural data...</p>
      </div>
      {onSkip && (
        <button 
          onClick={onSkip}
          className="text-xs text-primary font-bold hover:underline mt-4"
        >
          Skip & Use Default Location
        </button>
      )}
    </div>
  );
}

function getRotationAdvice(previousCropId: string | undefined, language: string) {
  if (!previousCropId) return null;
  
  const prevCrop = CROPS.find(c => c.id === previousCropId);
  if (!prevCrop) return null;

  const recommendations = {
    cereal: CROPS.filter(c => c.rotationGroup === 'pulse' || c.rotationGroup === 'legume'),
    pulse: CROPS.filter(c => c.rotationGroup === 'cereal' || c.rotationGroup === 'oilseed'),
    legume: CROPS.filter(c => c.rotationGroup === 'cereal' || c.rotationGroup === 'vegetable'),
    oilseed: CROPS.filter(c => c.rotationGroup === 'pulse' || c.rotationGroup === 'cereal'),
    vegetable: CROPS.filter(c => c.rotationGroup === 'cereal' || c.rotationGroup === 'pulse'),
    millet: CROPS.filter(c => c.rotationGroup === 'pulse' || c.rotationGroup === 'legume'),
  };

  const nextCrops = (recommendations[prevCrop.rotationGroup as keyof typeof recommendations] || CROPS.filter(c => c.id !== previousCropId));
  const nextCrop = nextCrops[0] || CROPS.find(c => c.id !== previousCropId);

  if (!nextCrop) return null;

  const benefits: { [key: string]: { [key: string]: string } } = {
    cereal: {
      en: 'Rotating with pulses improves soil nitrogen levels.',
      hi: 'दलहन के साथ फसल चक्र मिट्टी में नाइट्रोजन के स्तर में सुधार करता है।',
    },
    pulse: {
      en: 'Cereals benefit from the nitrogen fixed by previous pulses.',
      hi: 'पिछली दालों द्वारा स्थिर नाइट्रोजन से अनाज को लाभ होता है।',
    },
    legume: {
      en: 'Legumes restore soil fertility for the next crop.',
      hi: 'दलहन अगली फसल के लिए मिट्टी की उर्वरता बहाल करते हैं।',
    },
    oilseed: {
      en: 'Rotating oilseeds helps in breaking pest and disease cycles.',
      hi: 'तिलहन का फसल चक्र कीट और रोग चक्र को तोड़ने में मदद करता है।',
    },
    vegetable: {
      en: 'Vegetables followed by cereals maintain balanced nutrient demand.',
      hi: 'सब्जियों के बाद अनाज संतुलित पोषक तत्वों की मांग बनाए रखते हैं।',
    }
  };

  return {
    nextCrop,
    reason: language === 'hi' ? 'मिट्टी के स्वास्थ्य के लिए अनुशंसित' : 'Recommended for soil health',
    benefit: benefits[prevCrop.rotationGroup]?.[language] || benefits[prevCrop.rotationGroup]?.en || 'Rotating crops maintains soil health and breaks pest cycles.'
  };
}

export default function App() {
  const [state, setState] = useState<AppState>({
    language: 'hi',
    location: null,
    soil: null,
    weather: null,
    loading: true,
    error: null,
    isRefreshing: false,
    previousCropId: '',
    priceAlerts: JSON.parse(localStorage.getItem('priceAlerts') || '[]'),
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  });

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', state.theme || 'light');
  }, [state.theme]);

  useEffect(() => {
    localStorage.setItem('priceAlerts', JSON.stringify(state.priceAlerts));
  }, [state.priceAlerts]);

  const addPriceAlert = (alert: Omit<PriceAlert, 'id' | 'isActive'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      isActive: true
    };
    setState(prev => ({
      ...prev,
      priceAlerts: [...prev.priceAlerts, newAlert]
    }));
  };

  const removePriceAlert = (id: string) => {
    setState(prev => ({
      ...prev,
      priceAlerts: prev.priceAlerts.filter(a => a.id !== id)
    }));
  };

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const [activeTab, setActiveTab] = useState('home');
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCropId, setActiveCropId] = useState<string | null>(null);

  // Fetch relevant news when active crop changes
  useEffect(() => {
    if (activeCropId) {
      const crop = CROPS.find(c => c.id === activeCropId);
      if (crop) {
        const query = `${crop.name.en} agriculture news india`;
        fetchMarketNews(query).then(news => {
          setState(prev => ({ ...prev, marketNews: news }));
        });
      }
    }
  }, [activeCropId]);

  const handleLocationSelect = async (loc: { lat: number; lng: number; name: string }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [soil, weather, news] = await Promise.all([
        fetchSoilData(loc.lat, loc.lng),
        fetchWeatherData(loc.lat, loc.lng),
        fetchMarketNews()
      ]);
      setState(prev => ({
        ...prev,
        location: loc,
        soil,
        weather,
        marketNews: news,
        loading: false,
        error: null
      }));
      setIsSearchOpen(false);
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load data for selected location', loading: false }));
    }
  };

  const refreshData = async () => {
    if (!state.location) return;
    setState(prev => ({ ...prev, isRefreshing: true }));
    try {
      const { lat, lng } = state.location;
      const [soil, weather] = await Promise.all([
        fetchSoilData(lat, lng),
        fetchWeatherData(lat, lng)
      ]);
      setState(prev => ({ ...prev, soil, weather, isRefreshing: false, error: null }));
    } catch (err) {
      setState(prev => ({ ...prev, isRefreshing: false, error: 'Refresh failed. Please try again.' }));
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!navigator.geolocation) {
        setState(prev => ({ ...prev, error: 'Geolocation not supported', loading: false }));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const [soil, weather, locationName, news] = await Promise.all([
              fetchSoilData(latitude, longitude),
              fetchWeatherData(latitude, longitude),
              reverseGeocode(latitude, longitude),
              fetchMarketNews()
            ]);

            setState(prev => ({
              ...prev,
              location: { lat: latitude, lng: longitude, name: locationName },
              soil,
              weather,
              marketNews: news,
              loading: false,
              error: null
            }));
          } catch (err) {
            console.error("Initialization error:", err);
            setState(prev => ({ 
              ...prev, 
              error: 'Failed to fetch data for your location. Please try again later.', 
              loading: false 
            }));
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setState(prev => ({ 
            ...prev, 
            error: 'Location access denied. Please enable GPS or enter location manually.', 
            loading: false 
          }));
        },
        { timeout: 10000 } // 10 second timeout for GPS
      );
    };
    init();
  }, []);

  const t = TRANSLATIONS[state.language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const handleSkip = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      // Default to New Delhi coordinates
      const lat = 28.6139;
      const lng = 77.2090;
      const [soil, weather, locationName] = await Promise.all([
        fetchSoilData(lat, lng),
        fetchWeatherData(lat, lng),
        reverseGeocode(lat, lng)
      ]);

      setState(prev => ({
        ...prev,
        location: { lat, lng, name: locationName },
        soil,
        weather,
        loading: false,
        error: null
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load default data', loading: false }));
    }
  };

  const renderContent = () => {
    if (state.loading) return <LoadingScreen onSkip={handleSkip} />;
    
    switch (activeTab) {
      case 'home': return <HomeView state={state} t={t} setActiveTab={setActiveTab} />;
      case 'soil': return <SoilView state={state} t={t} onRefresh={refreshData} onManualInput={() => setIsSoilModalOpen(true)} />;
      case 'crops': return <CropsView state={state} t={t} onPreviousCropChange={(id) => setState(prev => ({ ...prev, previousCropId: id }))} setActiveCropId={setActiveCropId} />;
      case 'weather': return <WeatherView state={state} t={t} onRefresh={refreshData} />;
      case 'disease': return <DiseaseView state={state} t={t} />;
      case 'market': return (
        <MarketView 
          state={state} 
          t={t} 
          onDataUpdate={(marketData) => setState(prev => ({ ...prev, marketData }))} 
          onNewsUpdate={(marketNews) => setState(prev => ({ ...prev, marketNews }))}
          onAddAlert={addPriceAlert}
          onRemoveAlert={removePriceAlert}
        />
      );
      default: return <HomeView state={state} t={t} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text font-sans pb-24 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50 px-4 py-3 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Sprout size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-primary leading-none">KisanSense</h1>
            <p className="text-[10px] font-medium text-secondary uppercase tracking-wider mt-0.5">Smart Agriculture</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-transparent hover:border-primary/30 text-secondary transition-all active:scale-95"
          >
            <MapPin size={14} className="text-primary" />
            <span className="max-w-[80px] truncate sm:max-w-[120px] text-xs font-semibold text-text">{state.location?.name || 'Locating...'}</span>
            <Search size={12} className="opacity-40" />
          </button>

          <div className="h-6 w-px bg-border/50 mx-1" />

          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-secondary hover:text-primary transition-all active:scale-95"
          >
            {state.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <LanguageSelector 
            currentLanguage={state.language} 
            onLanguageChange={(lang) => setState(s => ({ ...s, language: lang }))} 
          />
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {state.error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/20 p-3.5 rounded-2xl flex items-center justify-between text-red-700 dark:text-red-400 text-sm shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle size={16} />
              </div>
              <span className="font-medium">{state.error}</span>
            </div>
            <button 
              onClick={() => setState(prev => ({ ...prev, error: null }))}
              className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
        {renderContent()}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="glass rounded-2xl p-2 shadow-2xl shadow-black/10 dark:shadow-primary/5 border border-white/20 dark:border-white/5 flex items-center justify-between">
          <NavItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={20} />} label={t.home} />
          <NavItem active={activeTab === 'soil'} onClick={() => setActiveTab('soil')} icon={<Database size={20} />} label={t.soil} />
          <NavItem active={activeTab === 'crops'} onClick={() => setActiveTab('crops')} icon={<Sprout size={20} />} label={t.crops} />
          <NavItem active={activeTab === 'weather'} onClick={() => setActiveTab('weather')} icon={<CloudSun size={20} />} label={t.weather} />
          <NavItem active={activeTab === 'market'} onClick={() => setActiveTab('market')} icon={<TrendingUp size={20} />} label={t.market} />
        </div>
      </nav>

      {/* AI Bot Toggle */}
      <button 
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse" />
      </button>

      {/* Manual Soil Input Modal */}
      <AnimatePresence>
        {isSoilModalOpen && (
          <SoilInputModal 
            t={t} 
            onClose={() => setIsSoilModalOpen(false)} 
            onSave={(soil) => {
              setState(prev => ({ ...prev, soil }));
              setIsSoilModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      {/* Old nav removed in favor of floating dock */}

      {/* Voice Bot Modal */}
      <AnimatePresence>
        {isBotOpen && (
          <VoiceBot 
            state={state} 
            onClose={() => setIsBotOpen(false)} 
            t={t}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <LocationSearchModal 
            onClose={() => setIsSearchOpen(false)} 
            onSelect={handleLocationSelect}
            onUseCurrentLocation={() => {
              setIsSearchOpen(false);
              // Trigger the initial location fetch again
              const init = async () => {
                if (!navigator.geolocation) return;
                setState(prev => ({ ...prev, loading: true }));
                navigator.geolocation.getCurrentPosition(
                  async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const [soil, weather, locationName, news] = await Promise.all([
                      fetchSoilData(latitude, longitude),
                      fetchWeatherData(latitude, longitude),
                      reverseGeocode(latitude, longitude),
                      fetchMarketNews()
                    ]);
                    setState(prev => ({
                      ...prev,
                      location: { lat: latitude, lng: longitude, name: locationName },
                      soil,
                      weather,
                      marketNews: news,
                      loading: false,
                      error: null
                    }));
                  },
                  () => setState(prev => ({ ...prev, error: 'Location access denied', loading: false }))
                );
              };
              init();
            }}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 relative",
        active ? "text-primary" : "text-secondary hover:text-text"
      )}
    >
      {active && (
        <motion.div 
          layoutId="nav-active"
          className="absolute inset-0 bg-primary/10 rounded-xl"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <div className={cn("transition-transform duration-300", active && "scale-110")}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

function HomeView({ state, t, setActiveTab }: { state: AppState, t: any, setActiveTab: (tab: string) => void }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-8 text-white shadow-2xl shadow-primary/20">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest">
            <Sparkles size={12} />
            {t.welcome}
          </div>
          <h2 className="text-4xl font-display font-bold leading-tight text-balance">
            Empowering Your <br /> Farming Journey
          </h2>
          <p className="text-white/80 text-sm max-w-xs leading-relaxed">
            Get real-time soil intelligence, crop advice, and market insights tailored for your land.
          </p>
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => setActiveTab('soil')}
              className="bg-white text-primary font-bold px-6 py-3 rounded-2xl shadow-lg shadow-black/10 active:scale-95 transition-all flex items-center gap-2"
            >
              {t.check_soil}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 h-48 bg-primary-dark/30 rounded-full blur-2xl" />
        <Sprout size={180} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <QuickStatCard 
          icon={<Thermometer className="text-orange-500" />} 
          label="Temperature" 
          value={`${state.weather?.temp.toFixed(0)}°C`}
          subValue={state.weather?.description}
          onClick={() => setActiveTab('weather')}
        />
        <QuickStatCard 
          icon={<Droplets className="text-blue-500" />} 
          label="Soil pH" 
          value={state.soil?.ph.toFixed(1)}
          subValue={state.soil?.texture}
          onClick={() => setActiveTab('soil')}
        />
      </div>

      {/* Expert Tips Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={20} />
            {t.expert_tips}
          </h3>
          <button className="text-xs font-bold text-primary hover:underline">{t.view_all}</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
          {EXPERT_TIPS.map((tip, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -4 }}
              className="min-w-[280px] card-bg p-5 space-y-3 border-l-4 border-l-primary"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{tip.category}</span>
                <Award size={14} className="text-amber-500" />
              </div>
              <h4 className="font-bold text-sm leading-snug">{tip.title[state.language] || tip.title.en}</h4>
              <p className="text-xs text-secondary leading-relaxed line-clamp-2">{tip.content[state.language] || tip.content.en}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* News Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="text-primary" size={20} />
            {t.latest_news}
          </h3>
        </div>
        <NewsSection news={state.marketNews || []} t={t} />
      </section>
    </div>
  );
}

function QuickStatCard({ icon, label, value, subValue, onClick }: { icon: React.ReactNode, label: string, value: any, subValue: any, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="card-bg p-5 text-left space-y-3 group hover:border-primary/30 transition-all active:scale-95"
    >
      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{label}</p>
        <h4 className="text-2xl font-display font-bold mt-1">{value}</h4>
        <p className="text-[10px] font-medium text-secondary mt-1 capitalize">{subValue}</p>
      </div>
    </button>
  );
}

function AlertCard({ type, title, desc }: { type: 'warning' | 'danger' | 'info', title: string, desc: string }) {
  const colors = {
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30 text-amber-800 dark:text-amber-200",
    danger: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30 text-red-800 dark:text-red-200",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30 text-blue-800 dark:text-blue-200"
  };
  const icons = {
    warning: <AlertTriangle size={18} className="text-amber-500" />,
    danger: <AlertTriangle size={18} className="text-red-500" />,
    info: <CloudSun size={18} className="text-blue-500" />
  };

  return (
    <div className={cn("p-3 rounded-xl border flex gap-3 transition-colors duration-300", colors[type])}>
      <div className="mt-0.5">{icons[type]}</div>
      <div>
        <h4 className="font-bold text-xs mb-0.5">{title}</h4>
        <p className="text-[11px] opacity-80 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function SoilView({ state, t, onRefresh, onManualInput }: { state: AppState, t: any, onRefresh: () => void, onManualInput: () => void }) {
  if (!state.soil) return <LoadingScreen />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-bold text-text">{t.soil_intelligence}</h2>
          <p className="text-xs text-secondary font-medium mt-1 uppercase tracking-wider">Real-time Analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onRefresh}
            disabled={state.isRefreshing}
            className={cn("p-2.5 rounded-xl card-bg text-secondary hover:text-primary active:scale-95 transition-all", state.isRefreshing && "animate-spin")}
          >
            <Database size={18} />
          </button>
          <button 
            onClick={onManualInput}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Plus size={14} />
            {t.manual_input}
          </button>
        </div>
      </div>

      {/* Main Soil Card */}
      <div className="card-bg p-8 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{t.ph}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-display font-bold text-primary">{state.soil.ph.toFixed(1)}</h3>
                <span className="text-xs font-bold text-secondary">Level</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{t.soil_texture}</p>
              <h4 className="text-xl font-bold text-text">{state.soil.texture}</h4>
            </div>
          </div>
          
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="12" className="text-gray-100 dark:text-gray-800" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="58" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * state.soil.ph) / 14}
                  className="text-primary"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-secondary uppercase">pH Scale</span>
                <span className="text-lg font-bold">14.0</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Soil Composition Grid */}
      <div className="grid grid-cols-3 gap-4">
        <SoilStatCard label={t.sand} value={`${state.soil.sand}%`} color="bg-amber-500" />
        <SoilStatCard label={t.silt} value={`${state.soil.silt}%`} color="bg-orange-500" />
        <SoilStatCard label={t.clay} value={`${state.soil.clay}%`} color="bg-red-500" />
      </div>

      {/* Organic Carbon & Nitrogen */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-bg p-5 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Database size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.soc}</span>
          </div>
          <h4 className="text-2xl font-display font-bold">{state.soil.soc} <span className="text-xs font-sans font-medium text-secondary">g/kg</span></h4>
        </div>
        <div className="card-bg p-5 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Droplets size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Nitrogen</span>
          </div>
          <h4 className="text-2xl font-display font-bold">{state.soil.nitrogen} <span className="text-xs font-sans font-medium text-secondary">mg/kg</span></h4>
        </div>
      </div>
    </div>
  );
}

function SoilStatCard({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="card-bg p-4 text-center space-y-2">
      <div className={cn("w-2 h-2 rounded-full mx-auto", color)} />
      <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{label}</p>
      <h4 className="text-lg font-display font-bold">{value}</h4>
    </div>
  );
}

function Gauge({ label, value, max, unit, color }: { label: string, value: number, max: number, unit: string, color: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-gray-600 dark:text-slate-400">{label}</span>
        <span className="font-bold text-gray-800 dark:text-slate-100">{value} {unit}</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}

function RotationFlowchart({ previousCrop, nextCrop, language }: { previousCrop: any, nextCrop: any, language: string }) {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <div className="flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-secondary shadow-sm border border-border/50">
          <Sprout size={28} />
        </div>
        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{previousCrop?.name[language] || previousCrop?.name.en || 'Previous'}</span>
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <motion.div 
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-primary"
        >
          <ArrowRight size={24} />
        </motion.div>
        <div className="h-0.5 w-12 bg-gradient-to-r from-secondary/20 via-primary/40 to-primary/20 rounded-full" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Sprout size={28} />
        </div>
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{nextCrop.name[language] || nextCrop.name.en}</span>
      </div>
    </div>
  );
}

const calculateCropScore = (crop: any, soil: SoilData | null, weather: WeatherData | null) => {
  if (!soil) return 0;
  let score = 100;
  
  // pH check
  if (soil.ph < crop.minPh || soil.ph > crop.maxPh) score -= 30;
  
  // SOC check (Organic Carbon) - most crops prefer > 0.5%
  if (soil.soc < 0.5) score -= 15;
  else if (soil.soc > 0.8) score += 5;

  // Texture check
  const texture = (soil.texture || '').toLowerCase();
  const preferredSoil = (crop.soilType.en || '').toLowerCase();
  if (preferredSoil.includes(texture) && texture !== 'unknown' && texture !== '') {
    score += 10;
  } else if (texture !== 'unknown' && texture !== '') {
    score -= 10;
  }

  // Nitrogen check (existing)
  if (soil.nitrogen < 50 && crop.id === 'wheat') score -= 20;
  
  return Math.min(Math.max(score, 40), 100);
};
function CropCompareModal({ crops, onClose, state, t }: { crops: any[], onClose: () => void, state: AppState, t: any }) {
  const getMonthName = (month: number) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1];
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="card-bg w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 border-b border-border/50 flex items-center justify-between bg-primary/5">
          <div>
            <h3 className="text-2xl font-bold text-text">Crop Comparison</h3>
            <p className="text-xs text-secondary font-medium mt-1 uppercase tracking-wider">Side-by-side analysis</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white dark:bg-gray-800 rounded-2xl text-secondary hover:text-text transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-8">
            {crops.map((crop, idx) => {
              const score = calculateCropScore(crop, state.soil, state.weather);
              return (
                <div key={crop.id} className="space-y-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={cn(
                      "w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg",
                      idx === 0 ? "bg-primary text-white shadow-primary/20" : "bg-amber-500 text-white shadow-amber-500/20"
                    )}>
                      <Sprout size={40} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-text">{crop.name[state.language] || crop.name.en}</h4>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className={cn("text-sm font-display font-bold", idx === 0 ? "text-primary" : "text-amber-500")}>
                          {score}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <CompareItem 
                      label="Soil Type" 
                      value={crop.soilType[state.language] || crop.soilType.en} 
                      icon={<Database size={14} />} 
                    />
                    <CompareItem 
                      label="pH Range" 
                      value={`${crop.minPh} - ${crop.maxPh}`} 
                      icon={<Activity size={14} />} 
                    />
                    <CompareItem 
                      label="Temp Range" 
                      value={`${crop.minTemp}°C - ${crop.maxTemp}°C`} 
                      icon={<Thermometer size={14} />} 
                    />
                    <CompareItem 
                      label="Water Needs" 
                      value={crop.waterRequirement} 
                      icon={<Droplets size={14} />} 
                    />
                    <CompareItem 
                      label="Sowing Time" 
                      value={crop.sowingMonths.map(getMonthName).join(', ')} 
                      icon={<Calendar size={14} />} 
                    />
                    <CompareItem 
                      label="Yield Potential" 
                      value={crop.yieldPotential[state.language] || crop.yieldPotential.en} 
                      icon={<Award size={14} />} 
                    />
                  </div>
                </div>
              );
            })}

            {crops.length < 2 && (
              <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border/50 rounded-[2rem] space-y-4 opacity-50">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-secondary">
                  <Plus size={32} />
                </div>
                <p className="text-sm font-medium text-secondary">Select another crop to compare</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CompareItem({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="space-y-2 bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-border/30">
      <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <p className="text-sm font-bold text-text leading-snug">{value}</p>
    </div>
  );
}

function CropsView({ state, t, onPreviousCropChange, setActiveCropId }: { state: AppState, t: any, onPreviousCropChange: (id: string) => void, setActiveCropId: (id: string | null) => void }) {
  const [expandedCropId, setExpandedCropId] = useState<string | null>(null);
  const [compareCropIds, setCompareCropIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleCompare = (id: string) => {
    setCompareCropIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const handleExpand = (id: string) => {
    const newId = expandedCropId === id ? null : id;
    setExpandedCropId(newId);
    setActiveCropId(newId);
  };

  const getMonthName = (month: number) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1];
  };

  const advice = getRotationAdvice(state.previousCropId, state.language);

  const topCrops = [...CROPS]
    .map(crop => ({
      crop,
      score: calculateCropScore(crop, state.soil, state.weather)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-bold text-text">{t.crop_advisor}</h2>
          <p className="text-xs text-secondary font-medium mt-1 uppercase tracking-wider">Smart Recommendations</p>
        </div>
        {compareCropIds.length > 0 && (
          <button 
            onClick={() => setIsCompareModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Scale size={16} />
            Compare ({compareCropIds.length}/2)
          </button>
        )}
      </div>

      {/* Rotation Advisor Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary px-1">
          <RefreshCw size={20} />
          <h3 className="text-lg font-bold">{t.crop_rotation}</h3>
        </div>
        
        <div className="card-bg p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">{t.select_previous_crop}</label>
            <select 
              value={state.previousCropId}
              onChange={(e) => onPreviousCropChange(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              <option value="">-- Select --</option>
              {CROPS.map(c => (
                <option key={c.id} value={c.id}>{c.name[state.language] || c.name.en}</option>
              ))}
            </select>
          </div>

          {advice && advice.nextCrop && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/5 rounded-[2rem] p-6 space-y-6 border border-primary/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{t.suggested_next}</span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                  <Sparkles size={12} />
                  RECOMMENDED
                </div>
              </div>
              
              <RotationFlowchart 
                previousCrop={CROPS.find(c => c.id === state.previousCropId)}
                nextCrop={advice.nextCrop}
                language={state.language}
              />

              <div className="flex items-center gap-4 border-t border-primary/10 pt-6">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary shadow-sm">
                  <Sprout size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-text">{advice.nextCrop.name[state.language] || advice.nextCrop.name.en}</h4>
                  <p className="text-[10px] text-secondary font-medium mt-0.5">{advice.reason}</p>
                </div>
              </div>
              <p className="text-xs text-primary font-medium italic leading-relaxed bg-white/50 dark:bg-black/20 p-4 rounded-2xl">
                "{advice.benefit}"
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Top Recommendations */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-amber-500 px-1">
          <Award size={20} />
          <h3 className="text-lg font-bold">{t.top_recommendations}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topCrops.map(({ crop, score }, index) => (
            <motion.div
              key={`top-${crop.id}`}
              whileHover={{ y: -4 }}
              className="card-bg p-6 rounded-[2rem] text-center space-y-4 relative overflow-hidden group cursor-pointer border border-transparent hover:border-amber-500/30 transition-all"
              onClick={() => handleExpand(crop.id)}
            >
              <div className="absolute top-0 right-0 p-3">
                <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                  #{index + 1}
                </div>
              </div>
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-amber-500 mx-auto group-hover:scale-110 transition-transform">
                <Sprout size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-balance">
                  {crop.name[state.language] || crop.name.en}
                </h4>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-lg font-display font-bold text-amber-500">{score}%</span>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-tight">Match</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  className="h-full bg-amber-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Crops List */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold px-1">All Crops</h3>
        <div className="space-y-4">
          {CROPS.map(crop => {
            const score = calculateCropScore(crop, state.soil, state.weather);
            const isExpanded = expandedCropId === crop.id;
            const isComparing = compareCropIds.includes(crop.id);
            return (
              <div key={crop.id} className="card-bg rounded-[2rem] overflow-hidden group hover:border-primary/30 transition-all">
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
                  onClick={() => handleExpand(crop.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Sprout size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text">{crop.name[state.language] || crop.name.en}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{crop.waterRequirement} Water</span>
                        <div className="w-1 h-1 rounded-full bg-secondary/30" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{score}% Match</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(crop.id);
                      }}
                      className={cn(
                        "p-3 rounded-xl border transition-all active:scale-90",
                        isComparing 
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                          : "bg-gray-50 dark:bg-gray-800 border-transparent text-secondary"
                      )}
                    >
                      <Scale size={18} />
                    </button>
                    <div className="text-secondary">
                      {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border/50 bg-gray-50/30 dark:bg-gray-800/30"
                    >
                      <div className="p-8 space-y-8">
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Description</span>
                          <p className="text-sm text-secondary leading-relaxed">
                            {crop.description[state.language] || crop.description.en}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{t.sowing_time}</span>
                            <p className="text-sm font-bold text-text">
                              {crop.sowingMonths.map(getMonthName).join(', ')}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Soil Suitability</span>
                            <p className="text-sm font-bold text-text">
                              {crop.soilType[state.language] || crop.soilType.en}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="card-bg p-4 rounded-2xl border border-border/50">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">Ideal pH</span>
                            <span className="text-lg font-display font-bold text-primary">{crop.minPh} - {crop.maxPh}</span>
                          </div>
                          <div className="card-bg p-4 rounded-2xl border border-border/50">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">Ideal Temp</span>
                            <span className="text-lg font-display font-bold text-orange-500">{crop.minTemp}°C - {crop.maxTemp}°C</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {isCompareModalOpen && (
          <CropCompareModal 
            crops={CROPS.filter(c => compareCropIds.includes(c.id))}
            onClose={() => setIsCompareModalOpen(false)}
            state={state}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WeatherImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-slate-800/50 animate-pulse rounded-lg">
          <div className="w-1/2 h-1/2 border-2 border-blue-500/50 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", className)}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

function WeatherView({ state, t, onRefresh }: { state: AppState, t: any, onRefresh: () => void }) {
  if (!state.weather) return <LoadingScreen />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-bold text-text">{t.weather}</h2>
          <p className="text-xs text-secondary font-medium mt-1 uppercase tracking-wider">Local Forecast</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onRefresh}
            disabled={state.isRefreshing}
            className={cn("p-2.5 rounded-xl card-bg text-secondary hover:text-primary active:scale-95 transition-all", state.isRefreshing && "animate-spin")}
          >
            <CloudSun size={18} />
          </button>
        </div>
      </div>

      {/* Main Weather Card */}
      <div className="card-bg p-8 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{t.today}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-6xl font-display font-bold text-primary">{state.weather.temp.toFixed(0)}°</h3>
                <span className="text-lg font-bold text-secondary">C</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
              {state.weather.description}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <WeatherImage 
              src={`https://openweathermap.org/img/wn/${state.weather.icon}@4x.png`} 
              alt={state.weather.description} 
              className="w-32 h-32 relative z-10 drop-shadow-2xl"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-border/50">
          <WeatherStat icon={<Droplets size={16} />} label="Humidity" value={`${state.weather.humidity}%`} />
          <WeatherStat icon={<Wind size={16} />} label="Wind" value={`${state.weather.windSpeed} km/h`} />
          <WeatherStat icon={<CloudRain size={16} />} label="Rain" value={`${state.weather.rain} mm`} />
        </div>
      </div>

      {/* Weather Map */}
      {state.location && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold px-1">{t.weather_map}</h3>
          <div className="card-bg p-2 rounded-[2rem] overflow-hidden">
            <WeatherMap 
              lat={state.location.lat} 
              lng={state.location.lng} 
              locationName={state.location.name} 
            />
          </div>
        </section>
      )}

      {/* Hourly Forecast */}
      {state.weather.hourly && state.weather.hourly.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold px-1">{t.hourly_forecast}</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
            {state.weather.hourly.map((hour, i) => (
              <div key={i} className="min-w-[80px] card-bg p-4 flex flex-col items-center gap-3">
                <span className="text-[10px] font-bold text-secondary">
                  {new Date(hour.time).getHours()}:00
                </span>
                <WeatherImage 
                  src={`https://openweathermap.org/img/wn/${hour.icon}.png`} 
                  alt={hour.description} 
                  className="w-10 h-10"
                />
                <span className="text-sm font-bold">{hour.temp.toFixed(0)}°</span>
                <div className="flex items-center gap-1 text-[9px] font-bold text-blue-500">
                  <Droplets size={8} />
                  {hour.rainProb}%
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Weekly Forecast */}
      {state.weather.forecast && state.weather.forecast.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold px-1">{t.weekly_forecast}</h3>
          <div className="card-bg divide-y divide-border/50">
            {state.weather.forecast.map((day, i) => (
              <div key={day.date} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                    <WeatherImage 
                      src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
                      alt={day.description} 
                      className="w-8 h-8"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      {i === 0 ? t.today : new Date(day.date).toLocaleDateString(state.language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long' })}
                    </p>
                    <p className="text-[10px] font-medium text-secondary capitalize">{day.description}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-bold text-primary">{day.high.toFixed(0)}° <span className="text-secondary font-medium">/ {day.low.toFixed(0)}°</span></p>
                  <div className="flex items-center justify-end gap-1 text-[9px] font-bold text-blue-500">
                    <Droplets size={8} />
                    {day.rainProb}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function WeatherStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-gray-400 dark:text-slate-500">{icon}</div>
      <span className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">{label}</span>
      <span className="text-sm font-bold text-gray-800 dark:text-slate-100">{value}</span>
    </div>
  );
}

function DiseaseView({ state, t }: { state: AppState, t: any }) {
  const [search, setSearch] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const availableCrops = Array.from(new Set(DISEASES.map(d => d.crop)));
  const severities = ['High', 'Medium', 'Low'];

  const filteredDiseases = DISEASES.filter(d => {
    const matchesSearch = (d.name[state.language] || d.name.en).toLowerCase().includes(search.toLowerCase()) ||
                         (d.crop).toLowerCase().includes(search.toLowerCase()) ||
                         (d.symptoms[state.language] || d.symptoms.en).toLowerCase().includes(search.toLowerCase());
    const matchesCrop = selectedCrops.length === 0 || selectedCrops.includes(d.crop);
    const matchesSeverity = selectedSeverities.length === 0 || selectedSeverities.includes(d.severity);
    return matchesSearch && matchesCrop && matchesSeverity;
  });

  const toggleCrop = (cropId: string) => {
    setSelectedCrops(prev => 
      prev.includes(cropId) ? prev.filter(id => id !== cropId) : [...prev, cropId]
    );
  };

  const toggleSeverity = (severity: string) => {
    setSelectedSeverities(prev => 
      prev.includes(severity) ? prev.filter(s => s !== severity) : [...prev, severity]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-bold text-text">{t.disease_library}</h2>
          <p className="text-xs text-secondary font-medium mt-1 uppercase tracking-wider">Diagnosis & Treatment</p>
        </div>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={cn(
            "p-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-bold",
            isFilterOpen || selectedCrops.length > 0 || selectedSeverities.length > 0
              ? "bg-primary text-white shadow-lg shadow-primary/20" 
              : "card-bg text-secondary"
          )}
        >
          <Filter size={18} />
          <span>{t.filter}</span>
        </button>
      </div>

      <div className="space-y-4 px-1">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search disease or symptoms..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full card-bg rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="card-bg rounded-[2rem] p-6 space-y-6 shadow-xl border border-primary/5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{t.select_crops}</span>
                    {(selectedCrops.length > 0 || selectedSeverities.length > 0) && (
                      <button 
                        onClick={() => { setSelectedCrops([]); setSelectedSeverities([]); }}
                        className="text-[10px] font-bold text-red-500 uppercase hover:underline"
                      >
                        {t.clear_all}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableCrops.map(cropId => {
                      const crop = CROPS.find(c => c.id === cropId);
                      const cropName = crop ? (crop.name[state.language] || crop.name.en) : cropId;
                      const isSelected = selectedCrops.includes(cropId);
                      return (
                        <button
                          key={cropId}
                          onClick={() => toggleCrop(cropId)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-bold transition-all border",
                            isSelected
                              ? "bg-primary text-white border-primary shadow-md"
                              : "card-bg text-secondary border-transparent"
                          )}
                        >
                          {cropName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{t.select_severity}</span>
                  <div className="flex gap-2">
                    {severities.map(severity => {
                      const isSelected = selectedSeverities.includes(severity);
                      return (
                        <button
                          key={severity}
                          onClick={() => toggleSeverity(severity)}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-[10px] font-bold transition-all border flex items-center justify-center gap-2",
                            isSelected
                              ? "bg-primary text-white border-primary shadow-md"
                              : "card-bg text-secondary border-transparent"
                          )}
                        >
                          {isSelected && <Check size={12} />}
                          {severity}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        {filteredDiseases.map(d => (
          <div key={d.id} className="card-bg p-6 space-y-6 group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{d.name[state.language] || d.name.en}</h4>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">{d.crop}</p>
                </div>
              </div>
              <span className={cn("text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider", 
                d.severity === 'High' ? "bg-red-100 text-red-600" : 
                d.severity === 'Medium' ? "bg-amber-100 text-amber-600" :
                "bg-blue-100 text-blue-600"
              )}>
                {d.severity} Risk
              </span>
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Symptoms</span>
              <p className="text-xs text-secondary leading-relaxed">{d.symptoms[state.language] || d.symptoms.en}</p>
            </div>

            <div className="bg-primary/5 p-6 rounded-[2rem] space-y-6 border border-primary/10">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t.treatment_steps}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">{t.dosage}</span>
                  <p className="text-xs font-bold text-text">{d.dosage[state.language] || d.dosage.en}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">{t.application}</span>
                  <p className="text-xs font-bold text-text">{d.application[state.language] || d.application.en}</p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">Action Plan</span>
                <ul className="space-y-2">
                  {(d.steps[state.language] || d.steps.en).map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-xs text-text leading-relaxed">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
        {filteredDiseases.length === 0 && (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto mb-4 text-secondary opacity-20" />
            <p className="text-secondary font-medium">No diseases found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SoilInputModal({ t, onClose, onSave }: { t: any, onClose: () => void, onSave: (soil: SoilData) => void }) {
  const [ph, setPh] = useState('7.0');
  const [nitrogen, setNitrogen] = useState('100');
  const [soc, setSoc] = useState('1.5');
  const [sand, setSand] = useState('40');
  const [silt, setSilt] = useState('40');
  const [clay, setClay] = useState('20');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card-bg rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
      >
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 dark:text-slate-100">{t.manual_input}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">{t.ph_level}</label>
              <input 
                type="number" 
                step="0.1"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none text-gray-800 dark:text-slate-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">{t.nitrogen} (mg/kg)</label>
              <input 
                type="number" 
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none text-gray-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">{t.soc} (g/kg)</label>
            <input 
              type="number" 
              step="0.1"
              value={soc}
              onChange={(e) => setSoc(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none text-gray-800 dark:text-slate-100"
            />
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-3 block">{t.soil_texture} (%)</label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500">{t.sand}</label>
                <input 
                  type="number" 
                  value={sand}
                  onChange={(e) => setSand(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none text-gray-800 dark:text-slate-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500">{t.silt}</label>
                <input 
                  type="number" 
                  value={silt}
                  onChange={(e) => setSilt(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none text-gray-800 dark:text-slate-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500">{t.clay}</label>
                <input 
                  type="number" 
                  value={clay}
                  onChange={(e) => setClay(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-2 text-xs focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none text-gray-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-slate-900/50 flex gap-3 border-t border-gray-100 dark:border-slate-800">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-xl transition-colors"
          >
            {t.cancel}
          </button>
          <button 
            onClick={() => onSave({
              ph: parseFloat(ph),
              nitrogen: parseFloat(nitrogen),
              soc: parseFloat(soc),
              texture: 'Loamy',
              sand: parseFloat(sand),
              silt: parseFloat(silt),
              clay: parseFloat(clay),
              isEstimated: false
            })}
            className="flex-1 py-3 text-sm font-bold bg-[#2D6A4F] text-white rounded-xl shadow-lg active:scale-95 transition-all"
          >
            {t.save}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VoiceBot({ state, onClose, t }: { state: AppState, onClose: () => void, t: any }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    const getLangCode = (lang: Language) => {
      const codes: Record<Language, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        bn: 'bn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        kn: 'kn-IN'
      };
      return codes[lang] || 'en-IN';
    };
    recognition.lang = getLangCode(state.language);
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleUserMessage(transcript);
    };
    recognition.start();
  };

  const handleUserMessage = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsTyping(true);
    
    const response = await getGeminiResponse(text, state.language, {
      soil: state.soil,
      weather: state.weather,
      location: state.location?.name || 'Unknown'
    });
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    
    // Speak response
    const utterance = new SpeechSynthesisUtterance(response);
    const getLangCode = (lang: Language) => {
      const codes: Record<Language, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        bn: 'bn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        kn: 'kn-IN'
      };
      return codes[lang] || 'en-IN';
    };
    utterance.lang = getLangCode(state.language);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-0 z-[60] bg-bg flex flex-col"
    >
      <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600">
            <MessageSquare size={18} />
          </div>
          <h2 className="font-bold text-gray-800 dark:text-slate-100">KisanMitra AI</h2>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
          <X size={24} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-4">
            <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/10 rounded-full flex items-center justify-center text-purple-600 mx-auto">
              <Mic size={40} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-slate-100">How can I help you today?</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 px-10">Ask me about your soil, weather, or which crops to sow.</p>
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {['मेरी मिट्टी कैसी है?', 'आज मौसम कैसा है?', 'गेहूं कब बोएं?'].map(q => (
                <button 
                  key={q} 
                  onClick={() => handleUserMessage(q)}
                  className="text-xs bg-gray-100 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-white/5 px-3 py-2 rounded-full text-gray-600 dark:text-slate-300 transition-colors border border-gray-200 dark:border-slate-800"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[80%] p-3 rounded-2xl text-sm shadow-sm", 
              m.role === 'user' ? "bg-[#2D6A4F] text-white rounded-tr-none" : "bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-slate-100 rounded-tl-none"
            )}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-100 dark:border-slate-800 flex flex-col items-center gap-4">
        <button 
          onClick={startListening}
          disabled={isListening}
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all active:scale-90",
            isListening ? "bg-red-500 animate-pulse" : "bg-purple-600"
          )}
        >
          <Mic size={32} />
        </button>
        <p className="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-widest">
          {isListening ? 'Listening...' : 'Tap to Speak'}
        </p>
      </div>
    </motion.div>
  );
}

function LocationSearchModal({ onClose, onSelect, onUseCurrentLocation, t }: { onClose: () => void, onSelect: (loc: any) => void, onUseCurrentLocation: () => void, t: any }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    const res = await searchLocation(query);
    setResults(res);
    setIsSearching(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm pt-20"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        className="card-bg w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              autoFocus
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t.search_location}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </form>

          <button 
            onClick={onUseCurrentLocation}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 text-[#2D6A4F] text-xs font-bold border border-green-100 dark:border-green-900/30 active:scale-95 transition-all"
          >
            <MapPin size={14} />
            {t.use_current_location}
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((res, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(res)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-900 rounded-xl transition-colors text-left group"
                >
                  <div className="w-8 h-8 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-[#2D6A4F] transition-colors">
                    <MapPin size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700 dark:text-slate-200">{res.name}</span>
                    <span className="text-[10px] text-gray-400 truncate max-w-[280px]">Lat: {res.lat.toFixed(4)}, Lng: {res.lng.toFixed(4)}</span>
                  </div>
                  <ChevronRight size={16} className="ml-auto text-gray-300" />
                </button>
              ))}
            </div>
          ) : query && !isSearching ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-12 h-12 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Search size={24} />
              </div>
              <p className="text-sm text-gray-500">{t.no_results}</p>
            </div>
          ) : (
            <div className="py-10 text-center space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Search for a city or village</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SoilTextureTriangle({ sand, silt, clay, t }: { sand: number, silt: number, clay: number, t: any }) {
  // Normalize to 100%
  const total = sand + silt + clay || 1;
  const s = (sand / total) * 100;
  const si = (silt / total) * 100;
  const c = (clay / total) * 100;

  // Triangle vertices: Top (50, 0), Bottom Left (0, 86.6), Bottom Right (100, 86.6)
  // Point P(s, si, c):
  // P.x = (s * 0 + si * 100 + c * 50) / 100
  // P.y = (s * 86.6 + si * 86.6 + c * 0) / 100
  const px = (si + c * 0.5);
  const py = (100 - c) * 0.866;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-slate-400">{t.soil_texture}</span>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">{s.toFixed(0)}% {t.sand}</span>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">{si.toFixed(0)}% {t.silt}</span>
          <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">{c.toFixed(0)}% {t.clay}</span>
        </div>
      </div>
      
      <div className="relative aspect-[1.15/1] w-full max-w-[240px] mx-auto card-bg rounded-xl p-4 shadow-inner transition-colors duration-300">
        <svg viewBox="-10 -10 120 106.6" className="w-full h-full overflow-visible">
          {/* Background Triangle */}
          <path 
            d="M 50 0 L 100 86.6 L 0 86.6 Z" 
            fill="currentColor" 
            className="text-gray-50 dark:text-slate-900"
            stroke="currentColor" 
            strokeWidth="1"
            strokeOpacity="0.1"
          />
          
          {/* Grid Lines */}
          {[20, 40, 60, 80].map(val => (
            <React.Fragment key={val}>
              {/* Clay lines (horizontal) */}
              <line x1={val/2} y1={86.6 - (val * 0.866)} x2={100 - val/2} y2={86.6 - (val * 0.866)} stroke="currentColor" className="text-gray-200 dark:text-slate-700" strokeWidth="0.5" strokeDasharray="2,2" />
              {/* Sand lines */}
              <line x1={val} y1={86.6} x2={val/2 + 50} y2={val * 0.866 / 2} stroke="currentColor" className="text-gray-200 dark:text-slate-700" strokeWidth="0.5" strokeDasharray="2,2" />
              {/* Silt lines */}
              <line x1={100-val} y1={86.6} x2={50 - val/2} y2={val * 0.866 / 2} stroke="currentColor" className="text-gray-200 dark:text-slate-700" strokeWidth="0.5" strokeDasharray="2,2" />
            </React.Fragment>
          ))}

          {/* Labels */}
          <text x="50" y="-5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#EF4444">{t.clay}</text>
          <text x="-5" y="92" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#D97706">{t.sand}</text>
          <text x="105" y="92" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#2563EB">{t.silt}</text>

          {/* Data Point */}
          <motion.circle 
            initial={{ r: 0 }}
            animate={{ r: 4 }}
            cx={px} 
            cy={py} 
            fill="#2D6A4F" 
            stroke="white" 
            strokeWidth="1.5"
            className="shadow-lg"
          />
          <motion.circle 
            initial={{ r: 0 }}
            animate={{ r: 8 }}
            cx={px} 
            cy={py} 
            fill="#2D6A4F" 
            fillOpacity="0.2"
          />
        </svg>
      </div>
    </div>
  );
}

function LanguageSelector({ currentLanguage, onLanguageChange }: { currentLanguage: Language, onLanguageChange: (lang: Language) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg card-bg border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors active:scale-95"
      >
        <Languages size={16} className="text-[#2D6A4F]" />
        <span className="text-xs font-bold uppercase tracking-tight">
          {currentLanguage}
        </span>
        <ChevronDown size={14} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-48 card-bg rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-[60] grid grid-cols-1 gap-0.5 max-h-[320px] overflow-y-auto"
          >
            {(Object.keys(TRANSLATIONS) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  onLanguageChange(lang);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                  currentLanguage === lang 
                    ? "bg-green-50 dark:bg-green-900/20 text-[#2D6A4F] font-bold" 
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-900"
                )}
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold">{TRANSLATIONS[lang].language_name}</span>
                  <span className="text-[10px] opacity-50 uppercase tracking-tighter">{lang}</span>
                </div>
                {currentLanguage === lang && <div className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
