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
} from 'lucide-react';
import { AppState, Language, SoilData, WeatherData } from './types';
import { CROPS, DISEASES, TRANSLATIONS } from './constants';
import { fetchSoilData, fetchWeatherData, reverseGeocode, getGeminiResponse } from './services';
import { cn } from './utils';

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

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const [activeTab, setActiveTab] = useState('home');
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);

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
            const [soil, weather, locationName] = await Promise.all([
              fetchSoilData(latitude, longitude),
              fetchWeatherData(latitude, longitude),
              reverseGeocode(latitude, longitude)
            ]);

            setState(prev => ({
              ...prev,
              location: { lat: latitude, lng: longitude, name: locationName },
              soil,
              weather,
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
      case 'crops': return <CropsView state={state} t={t} onPreviousCropChange={(id) => setState(prev => ({ ...prev, previousCropId: id }))} />;
      case 'weather': return <WeatherView state={state} t={t} onRefresh={refreshData} />;
      case 'disease': return <DiseaseView state={state} t={t} />;
      default: return <HomeView state={state} t={t} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text font-sans pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2D6A4F] rounded-lg flex items-center justify-center text-white">
            <Sprout size={20} />
          </div>
          <h1 className="font-bold text-lg text-[#2D6A4F]">KisanSense</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors active:scale-95"
          >
            {state.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <LanguageSelector 
            currentLanguage={state.language} 
            onLanguageChange={(lang) => setState(s => ({ ...s, language: lang }))} 
          />
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
            <MapPin size={14} className="text-[#2D6A4F]" />
            <span className="max-w-[80px] truncate sm:max-w-[120px]">{state.location?.name || 'Locating...'}</span>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {state.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 p-3 rounded-lg mb-4 flex items-center justify-between text-red-700 dark:text-red-400 text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} />
              {state.error}
            </div>
            <button onClick={() => setState(prev => ({ ...prev, error: null }))}>
              <X size={16} />
            </button>
          </div>
        )}
        {renderContent()}
      </main>

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
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 flex justify-around items-center z-50 shadow-lg transition-colors duration-300">
        <NavButton icon={<Home size={20} />} label={t.home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavButton icon={<Droplets size={20} />} label={t.soil} active={activeTab === 'soil'} onClick={() => setActiveTab('soil')} />
        <div className="relative -top-6">
          <button 
            onClick={() => setIsBotOpen(true)}
            className="w-14 h-14 bg-[#2D6A4F] rounded-full flex items-center justify-center text-white shadow-xl border-4 border-card active:scale-95 transition-all"
          >
            <Mic size={28} />
          </button>
        </div>
        <NavButton icon={<Sprout size={20} />} label={t.crops} active={activeTab === 'crops'} onClick={() => setActiveTab('crops')} />
        <NavButton icon={<Database size={20} />} label={t.disease} active={activeTab === 'disease'} onClick={() => setActiveTab('disease')} />
        <NavButton icon={<CloudSun size={20} />} label={t.weather} active={activeTab === 'weather'} onClick={() => setActiveTab('weather')} />
      </nav>

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
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-1 transition-colors", active ? "text-[#2D6A4F]" : "text-gray-400")}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function LoadingScreen({ onSkip }: { onSkip?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 bg-bg min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 dark:text-slate-400 animate-pulse">Loading KisanSense...</p>
      {onSkip && (
        <button 
          onClick={onSkip}
          className="mt-4 text-xs text-[#2D6A4F] font-medium underline"
        >
          Skip and use default location
        </button>
      )}
    </div>
  );
}

function HomeView({ state, t, setActiveTab }: { state: AppState, t: any, setActiveTab: (t: string) => void }) {
  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        {(state.soil?.isEstimated || state.weather?.isEstimated) && (
          <div className="absolute top-0 right-0 bg-amber-500 text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-tighter">
            Estimated Data
          </div>
        )}
        <h2 className="text-2xl font-bold mb-2">{t.welcome}</h2>
        <p className="text-green-100 text-sm mb-6 opacity-90">Listen to your land. Grow smarter crops.</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/20 dark:border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Droplets size={16} className="text-green-300" />
              <span className="text-xs font-medium text-green-200">Soil pH</span>
            </div>
            <div className="text-xl font-bold">{state.soil?.ph.toFixed(1) || '--'}</div>
          </div>
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/20 dark:border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer size={16} className="text-orange-300" />
              <span className="text-xs font-medium text-orange-200">Temp</span>
            </div>
            <div className="text-xl font-bold">{state.weather?.temp.toFixed(0) || '--'}°C</div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setActiveTab('soil')} className="card-bg p-4 rounded-xl shadow-sm text-left active:bg-gray-50 dark:active:bg-slate-900 transition-colors">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-[#2D6A4F] mb-3">
            <Droplets size={20} />
          </div>
          <h3 className="font-bold text-sm mb-1 text-gray-800 dark:text-slate-100">{t.soil_intelligence}</h3>
          <p className="text-[10px] text-gray-500 dark:text-slate-400">Check NPK & pH levels</p>
        </button>
        <button onClick={() => setActiveTab('crops')} className="card-bg p-4 rounded-xl shadow-sm text-left active:bg-gray-50 dark:active:bg-slate-900 transition-colors">
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center text-amber-600 mb-3">
            <Sprout size={20} />
          </div>
          <h3 className="font-bold text-sm mb-1 text-gray-800 dark:text-slate-100">{t.crop_advisor}</h3>
          <p className="text-[10px] text-gray-500 dark:text-slate-400">Best crops for your land</p>
        </button>
        <button onClick={() => setActiveTab('disease')} className="card-bg p-4 rounded-xl shadow-sm text-left active:bg-gray-50 dark:active:bg-slate-900 transition-colors">
          <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center text-red-600 mb-3">
            <Database size={20} />
          </div>
          <h3 className="font-bold text-sm mb-1 text-gray-800 dark:text-slate-100">{t.disease_library}</h3>
          <p className="text-[10px] text-gray-500 dark:text-slate-400">Identify & treat crop diseases</p>
        </button>
        <button onClick={() => setActiveTab('weather')} className="card-bg p-4 rounded-xl shadow-sm text-left active:bg-gray-50 dark:active:bg-slate-900 transition-colors">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 mb-3">
            <CloudSun size={20} />
          </div>
          <h3 className="font-bold text-sm mb-1 text-gray-800 dark:text-slate-100">{t.weather_alerts}</h3>
          <p className="text-[10px] text-gray-500 dark:text-slate-400">Local weather & alerts</p>
        </button>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 dark:text-slate-100">Smart Alerts</h2>
          <span className="text-[10px] text-[#2D6A4F] font-bold uppercase tracking-wider">Live</span>
        </div>
        <div className="space-y-3">
          {state.weather && state.weather.humidity > 80 && (
            <AlertCard 
              type="warning" 
              title={t.fungal_risk_title} 
              desc={t.fungal_risk_desc}
            />
          )}
          {state.weather && (state.weather.temp > 35 || state.weather.forecast?.some(d => d.high > 35)) && (
            <AlertCard 
              type="danger" 
              title={t.heat_stress_title} 
              desc={t.heat_stress_desc}
            />
          )}
          {state.weather && (state.weather.temp < 10 || state.weather.forecast?.some(d => d.low < 10)) && (
            <AlertCard 
              type="warning" 
              title={t.frost_alert_title} 
              desc={t.frost_alert_desc}
            />
          )}
          {state.weather?.forecast?.some(day => day.rainProb > 70) && (
            <AlertCard 
              type="info" 
              title={t.heavy_rain_title} 
              desc={t.heavy_rain_desc}
            />
          )}
          <AlertCard 
            type="info" 
            title={t.sowing_window_title} 
            desc={t.sowing_window_desc}
          />
        </div>
      </section>
    </div>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">{t.soil_intelligence}</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={onRefresh}
            disabled={state.isRefreshing}
            className={cn("p-2 rounded-lg card-bg text-gray-600 dark:text-slate-400 active:scale-95 transition-all", state.isRefreshing && "animate-spin")}
          >
            <Database size={16} />
          </button>
          {state.soil.isEstimated && (
            <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
              ESTIMATED
            </span>
          )}
        </div>
      </div>
      
      {state.soil.isEstimated && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 p-3 rounded-xl flex items-center justify-between gap-2 text-amber-800 dark:text-amber-200 text-[10px] leading-tight">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="shrink-0" />
            Soil data service is currently busy. Showing estimated values.
          </div>
          <button 
            onClick={onManualInput}
            className="shrink-0 bg-amber-600 text-white px-2 py-1 rounded font-bold uppercase"
          >
            {t.manual_input}
          </button>
        </div>
      )}

      <div className="card-bg rounded-2xl p-6 shadow-sm space-y-8 transition-colors duration-300">
        <div className="space-y-4">
          <Gauge label={t.nitrogen} value={state.soil.nitrogen} max={200} unit="mg/kg" color="bg-blue-500" />
          <Gauge label={t.phosphorus} value={state.soil.soc} max={100} unit="mg/kg" color="bg-purple-500" />
          <Gauge label={t.potassium} value={120} max={300} unit="mg/kg" color="bg-orange-500" />
        </div>

        <div className="pt-6 border-t border-border">
          <SoilTextureTriangle 
            sand={state.soil.sand} 
            silt={state.soil.silt} 
            clay={state.soil.clay} 
            t={t} 
          />
        </div>

        <div className="pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">{t.ph_level}</span>
            <span className={cn("px-3 py-1 rounded-full text-xs font-bold", 
              state.soil.ph < 6 ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : 
              state.soil.ph > 8 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            )}>
              {state.soil.ph < 6 ? 'Acidic' : state.soil.ph > 8 ? 'Alkaline' : 'Neutral'}
            </span>
          </div>
          <div className="relative h-4 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-full">
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-100 border-2 border-gray-800 dark:border-slate-900 rounded-full shadow-md transition-all duration-500"
              style={{ left: `${(state.soil.ph / 14) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium">
            <span>0 (Acidic)</span>
            <span>7 (Neutral)</span>
            <span>14 (Alkaline)</span>
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 p-4 rounded-xl">
        <h4 className="font-bold text-[#2D6A4F] text-sm mb-2">Expert Tip</h4>
        <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
          Your soil is slightly {state.soil.ph < 7 ? 'acidic' : 'alkaline'}. Consider adding {state.soil.ph < 7 ? 'lime' : 'gypsum'} to balance it for better wheat yield.
        </p>
      </div>
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
  const getIcon = (group: string) => {
    switch (group) {
      case 'cereal': return <Database size={16} />;
      case 'legume':
      case 'pulse': return <Droplets size={16} />;
      case 'vegetable': return <Sprout size={16} />;
      case 'oilseed': return <Droplets size={16} />;
      case 'fruit': return <Sprout size={16} />;
      default: return <Sprout size={16} />;
    }
  };

  const getThirdCrop = (group: string) => {
    if (group === 'legume' || group === 'pulse') return CROPS.find(c => c.rotationGroup === 'oilseed') || CROPS.find(c => c.rotationGroup === 'cereal');
    if (group === 'cereal') return CROPS.find(c => c.rotationGroup === 'vegetable') || CROPS.find(c => c.rotationGroup === 'legume' || c.rotationGroup === 'pulse');
    return CROPS.find(c => c.rotationGroup === 'legume' || c.rotationGroup === 'pulse') || CROPS.find(c => c.rotationGroup === 'cereal');
  };

  const thirdCrop = getThirdCrop(nextCrop.rotationGroup);

  return (
    <div className="flex items-center justify-between py-4 px-2">
      <div className="flex flex-col items-center gap-2 w-20 text-center">
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-900 flex items-center justify-center text-gray-500 dark:text-slate-400 border-2 border-dashed border-gray-300 dark:border-slate-800">
          {previousCrop ? getIcon(previousCrop.rotationGroup) : <Search size={16} />}
        </div>
        <span className="text-[9px] font-bold text-gray-500 dark:text-slate-400 uppercase truncate w-full">
          {previousCrop ? (previousCrop.name[language] || previousCrop.name.en) : 'Previous'}
        </span>
      </div>

      <ArrowRight size={16} className="text-gray-300 dark:text-slate-700" />

      <div className="flex flex-col items-center gap-2 w-24 text-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#2D6A4F] border-2 border-[#2D6A4F]"
        >
          {getIcon(nextCrop.rotationGroup)}
        </motion.div>
        <span className="text-[10px] font-bold text-[#2D6A4F] uppercase">
          {nextCrop.name[language] || nextCrop.name.en}
        </span>
      </div>

      <ArrowRight size={16} className="text-gray-300 dark:text-slate-700" />

      <div className="flex flex-col items-center gap-2 w-20 text-center opacity-50">
        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 border-2 border-blue-100 dark:border-blue-900/40">
          {thirdCrop ? getIcon(thirdCrop.rotationGroup) : <Sprout size={16} />}
        </div>
        <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase truncate w-full">
          {thirdCrop ? (thirdCrop.name[language] || thirdCrop.name.en) : 'Future'}
        </span>
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

function CropsView({ state, t, onPreviousCropChange }: { state: AppState, t: any, onPreviousCropChange: (id: string) => void }) {
  const [expandedCropId, setExpandedCropId] = useState<string | null>(null);
  const [compareCropIds, setCompareCropIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const topCrops = [...CROPS]
    .map(crop => ({
      crop,
      score: calculateCropScore(crop, state.soil, state.weather)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const toggleCompare = (id: string) => {
    setCompareCropIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const getMonthName = (month: number) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1];
  };

  const getRotationAdvice = () => {
    if (!state.previousCropId) {
      return {
        nextCrop: CROPS.find(c => c.id === 'wheat'),
        reason: t.no_previous_data,
        benefit: t.cereal_benefit
      };
    }

    const previousCrop = CROPS.find(c => c.id === state.previousCropId);
    if (!previousCrop) return null;

    let suggested: any = null;
    let benefit = '';

    const isLegume = (group: string) => group === 'legume' || group === 'pulse';

    if (previousCrop.rotationGroup === 'cereal' || previousCrop.rotationGroup === 'millet') {
      suggested = CROPS.find(c => isLegume(c.rotationGroup)) || CROPS.find(c => c.rotationGroup === 'oilseed');
      benefit = t.legume_benefit;
    } else if (isLegume(previousCrop.rotationGroup)) {
      suggested = CROPS.find(c => c.rotationGroup === 'cereal') || CROPS.find(c => c.rotationGroup === 'millet');
      benefit = t.cereal_benefit;
    } else if (previousCrop.rotationGroup === 'vegetable') {
      suggested = CROPS.find(c => isLegume(c.rotationGroup)) || CROPS.find(c => c.rotationGroup === 'cereal');
      benefit = t.legume_benefit;
    } else {
      suggested = CROPS.find(c => isLegume(c.rotationGroup)) || CROPS.find(c => c.rotationGroup === 'cereal');
      benefit = t.legume_benefit;
    }

    // Fallback if no crop found (should not happen with current data)
    if (!suggested) {
      suggested = CROPS.find(c => c.id === 'wheat');
    }

    return {
      nextCrop: suggested,
      reason: t.rotation_reason,
      benefit: benefit
    };
  };

  const advice = getRotationAdvice();

  return (
    <div className="space-y-8">
      {/* Rotation Advisor Section */}
      <div className="bg-[#2D6A4F]/5 border border-[#2D6A4F]/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-[#2D6A4F]">
          <Database size={20} />
          <h3 className="font-bold text-lg">{t.crop_rotation}</h3>
        </div>

        <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 border border-[#2D6A4F]/10 space-y-2">
          <h4 className="text-sm font-bold text-[#2D6A4F] flex items-center gap-2">
            <Info size={16} />
            {t.rotation_importance_title}
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t.rotation_importance_desc}
          </p>
          <a 
            href="https://en.wikipedia.org/wiki/Crop_rotation" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2D6A4F] hover:underline"
          >
            {t.learn_more} <ExternalLink size={10} />
          </a>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">{t.select_previous_crop}</label>
            <select 
              value={state.previousCropId}
              onChange={(e) => onPreviousCropChange(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#2D6A4F]/20 outline-none text-gray-800 dark:text-slate-100"
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
              className="card-bg p-4 rounded-xl border border-[#2D6A4F]/20 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#2D6A4F] uppercase tracking-wider">{t.suggested_next}</span>
                <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-bold uppercase">Recommended</span>
              </div>
              
              <RotationFlowchart 
                previousCrop={CROPS.find(c => c.id === state.previousCropId)}
                nextCrop={advice.nextCrop}
                language={state.language}
              />

              <div className="flex items-center gap-3 border-t border-gray-50 dark:border-slate-800 pt-3">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-[#2D6A4F]">
                  <Sprout size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-slate-100">{advice.nextCrop.name[state.language] || advice.nextCrop.name.en}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400">{advice.reason}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400 italic leading-relaxed border-t border-gray-50 dark:border-slate-800 pt-2">
                "{advice.benefit}"
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Top Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[#2D6A4F]">
          <Award size={20} />
          <h3 className="font-bold text-lg">{t.top_recommendations}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topCrops.map(({ crop, score }, index) => (
            <motion.div
              key={`top-${crop.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="card-bg p-4 rounded-2xl border border-[#2D6A4F]/20 shadow-sm relative overflow-hidden group cursor-pointer"
              onClick={() => setExpandedCropId(crop.id)}
            >
              <div className="absolute top-0 right-0 p-2">
                <div className="bg-[#2D6A4F] text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                  #{index + 1}
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-[#2D6A4F] group-hover:scale-110 transition-transform">
                  <Sprout size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800 dark:text-slate-100 line-clamp-1">
                    {crop.name[state.language] || crop.name.en}
                  </h4>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-[10px] font-bold text-[#2D6A4F]">{score}%</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-tight">{t.soil_match}</span>
                  </div>
                </div>
                <div className="w-full h-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#2D6A4F]" 
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">{t.crop_advisor}</h2>
          {compareCropIds.length > 0 && (
            <button 
              onClick={() => setIsCompareModalOpen(true)}
              className="flex items-center gap-2 bg-[#2D6A4F] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-all"
            >
              <Scale size={16} />
              Compare ({compareCropIds.length}/2)
            </button>
          )}
        </div>
        {CROPS.map(crop => {
          const score = calculateCropScore(crop, state.soil, state.weather);
          const isExpanded = expandedCropId === crop.id;
          const isComparing = compareCropIds.includes(crop.id);
          return (
            <div key={crop.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-colors duration-300">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer active:bg-gray-50 dark:active:bg-slate-900 transition-colors"
                onClick={() => setExpandedCropId(isExpanded ? null : crop.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100 dark:border-slate-700 bg-green-50 dark:bg-green-900/20 text-[#2D6A4F]">
                    <Sprout size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-slate-100">{crop.name[state.language] || crop.name.en}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400 font-medium">{t.water_need}: {crop.waterRequirement}</span>
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
                      "p-2 rounded-lg border transition-all active:scale-90",
                      isComparing 
                        ? "bg-green-600 border-green-600 text-white" 
                        : "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-400"
                    )}
                  >
                    <Scale size={16} />
                  </button>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#2D6A4F] mb-1">{score}% Match</div>
                    <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2D6A4F]" style={{ width: `${score}%` }}></div>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50"
                  >
                    <div className="p-4 space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Description</span>
                        <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                          {crop.description[state.language] || crop.description.en}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{t.sowing_time}</span>
                          <p className="text-xs font-bold text-gray-800 dark:text-slate-100">
                            {crop.sowingMonths.map(getMonthName).join(', ')}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Soil Suitability</span>
                          <p className="text-xs font-bold text-gray-800 dark:text-slate-100">
                            {crop.soilType[state.language] || crop.soilType.en}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 pt-2">
                        <div className="flex-1 card-bg p-2 rounded-lg border border-gray-100 dark:border-slate-800">
                          <span className="text-[10px] text-gray-400 block mb-1">Ideal pH</span>
                          <span className="text-xs font-bold text-[#2D6A4F]">{crop.minPh} - {crop.maxPh}</span>
                        </div>
                        <div className="flex-1 card-bg p-2 rounded-lg border border-gray-100 dark:border-slate-800">
                          <span className="text-[10px] text-gray-400 block mb-1">Ideal Temp</span>
                          <span className="text-xs font-bold text-orange-600">{crop.minTemp}°C - {crop.maxTemp}°C</span>
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

function WeatherView({ state, t, onRefresh }: { state: AppState, t: any, onRefresh: () => void }) {
  if (!state.weather) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">{t.weather_alerts}</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={onRefresh}
            disabled={state.isRefreshing}
            className={cn("p-2 rounded-lg card-bg text-gray-600 dark:text-slate-400 active:scale-95 transition-all", state.isRefreshing && "animate-spin")}
          >
            <CloudSun size={16} />
          </button>
          {state.weather.isEstimated && (
            <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
              ESTIMATED
            </span>
          )}
        </div>
      </div>
      
      {state.weather.isEstimated && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 p-3 rounded-xl flex items-center justify-between gap-2 text-amber-800 dark:text-amber-200 text-[10px] leading-tight">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="shrink-0" />
            Weather service is currently busy. Showing estimated values.
          </div>
          <button 
            onClick={onRefresh}
            className="shrink-0 bg-amber-600 text-white px-2 py-1 rounded font-bold uppercase"
          >
            {t.retry}
          </button>
        </div>
      )}

      <div className="card-bg rounded-2xl p-6 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-4xl font-bold text-gray-800 dark:text-slate-100">{state.weather.temp.toFixed(0)}°C</div>
            <div className="text-sm text-gray-500 dark:text-slate-400 capitalize mt-1">{state.weather.description}</div>
          </div>
          <img 
            src={`https://openweathermap.org/img/wn/${state.weather.icon}@2x.png`} 
            alt="Weather Icon" 
            className="w-20 h-20"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
          <WeatherStat icon={<Droplets size={16} />} label="Humidity" value={`${state.weather.humidity}%`} />
          <WeatherStat icon={<Wind size={16} />} label="Wind" value={`${state.weather.windSpeed} km/h`} />
          <WeatherStat icon={<CloudSun size={16} />} label="Rain" value={`${state.weather.rain} mm`} />
        </div>
      </div>

      {state.weather.forecast && state.weather.forecast.length > 0 && (
        <div className="card-bg rounded-2xl p-6 shadow-sm space-y-4 transition-colors duration-300">
          <h3 className="text-sm font-bold text-gray-800 dark:text-slate-100 border-b border-border pb-2">{t.forecast_3day}</h3>
          <div className="space-y-4">
            {state.weather.forecast.map((day, i) => (
              <div key={day.date} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-slate-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600">
                    <img 
                      src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
                      alt="Weather Icon" 
                      className="w-8 h-8"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800 dark:text-slate-100">
                      {i === 0 ? t.today : new Date(day.date).toLocaleDateString(state.language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-slate-400 capitalize">{day.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-800 dark:text-slate-100">{day.high.toFixed(0)}° / {day.low.toFixed(0)}°</div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">{t.high_low}</div>
                  </div>
                  <div className="text-right min-w-[60px]">
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400">{day.rainProb}%</div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">{t.rain_prob}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
        <h4 className="font-bold text-blue-800 text-sm mb-2">Irrigation Advice</h4>
        <p className="text-xs text-blue-700 leading-relaxed">
          {state.weather.rain > 0 
            ? "Rain detected. Skip irrigation for today to save water." 
            : "No rain expected. Ensure regular watering for Rabi crops."}
        </p>
      </div>
    </div>
  );
}

function WeatherStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-gray-400">{icon}</div>
      <span className="text-[10px] text-gray-500 font-medium">{label}</span>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  );
}

function DiseaseView({ state, t }: { state: AppState, t: any }) {
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  
  const availableCrops = Array.from(new Set(DISEASES.map(d => d.crop)));

  const filteredDiseases = DISEASES.filter(d => {
    const matchesSearch = (d.name[state.language] || d.name.en).toLowerCase().includes(search.toLowerCase()) ||
                         (d.crop).toLowerCase().includes(search.toLowerCase()) ||
                         (d.symptoms[state.language] || d.symptoms.en).toLowerCase().includes(search.toLowerCase());
    const matchesCrop = !selectedCrop || d.crop === selectedCrop;
    return matchesSearch && matchesCrop;
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">{t.disease_library}</h2>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search disease or symptoms..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full card-bg rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 transition-colors duration-300"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCrop(null)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
              !selectedCrop 
                ? "bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/20" 
                : "card-bg text-gray-500 border border-gray-100 dark:border-slate-800"
            )}
          >
            {t.all_crops || 'All Crops'}
          </button>
          {availableCrops.map(cropId => {
            const crop = CROPS.find(c => c.id === cropId);
            const cropName = crop ? (crop.name[state.language] || crop.name.en) : cropId;
            return (
              <button
                key={cropId}
                onClick={() => setSelectedCrop(cropId)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                  selectedCrop === cropId
                    ? "bg-[#2D6A4F] text-white shadow-md shadow-[#2D6A4F]/20" 
                    : "card-bg text-gray-500 border border-gray-100 dark:border-slate-800"
                )}
              >
                {cropName}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {filteredDiseases.map(d => (
          <div key={d.id} className="card-bg p-5 rounded-2xl shadow-sm space-y-4 transition-colors duration-300">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800 dark:text-slate-100">{d.name[state.language] || d.name.en}</h4>
                  <span className="text-[10px] font-bold text-[#2D6A4F] uppercase tracking-wider">{d.crop}</span>
                </div>
              </div>
              <span className={cn("text-[10px] px-2 py-1 rounded-full font-bold uppercase", 
                d.severity === 'High' ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              )}>
                {d.severity} Risk
              </span>
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">Symptoms</span>
              <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">{d.symptoms[state.language] || d.symptoms.en}</p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl space-y-4 border border-green-100 dark:border-green-800/30">
              <div className="flex items-center gap-2 text-[#2D6A4F]">
                <Database size={16} />
                <span className="text-xs font-bold uppercase tracking-tight">{t.treatment_steps}</span>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-green-700/60 uppercase">{t.dosage}</span>
                    <p className="text-xs font-bold text-green-900 dark:text-green-300">{d.dosage[state.language] || d.dosage.en}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-green-700/60 uppercase">{t.application}</span>
                    <p className="text-xs font-bold text-green-900 dark:text-green-300">{d.application[state.language] || d.application.en}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-green-700/60 uppercase">Steps</span>
                  <ul className="space-y-1.5">
                    {(d.steps[state.language] || d.steps.en).map((step, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-green-800 dark:text-green-200 leading-tight">
                        <span className="font-bold text-green-600">{idx + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredDiseases.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Search size={40} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm">No diseases found matching your search.</p>
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
      alert("Speech recognition not supported in this browser.");
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

function CropCompareModal({ crops, onClose, state, t }: { crops: any[], onClose: () => void, state: AppState, t: any }) {
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
        className="card-bg w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-[#2D6A4F]">
              <Scale size={20} />
            </div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-slate-100">Crop Comparison</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {crops.length < 2 ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-gray-300 border border-transparent dark:border-slate-800">
                <Scale size={32} />
              </div>
              <p className="text-sm text-gray-500">Please select two crops to compare their details side-by-side.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                {crops.map(crop => (
                  <div key={crop.id} className="text-center">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto text-[#2D6A4F] mb-2">
                      <Sprout size={24} />
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-slate-100">{crop.name[state.language] || crop.name.en}</h4>
                    <span className="text-[10px] font-bold text-[#2D6A4F] uppercase tracking-wider">{crop.rotationGroup}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <CompareItem label="Ideal Soil" values={crops.map(c => c.soilType[state.language] || c.soilType.en)} />
                <CompareItem label="pH Range" values={crops.map(c => `${c.minPh} - ${c.maxPh}`)} />
                <CompareItem label="Temp Range" values={crops.map(c => `${c.minTemp}°C - ${c.maxTemp}°C`)} />
                <CompareItem label="Water Need" values={crops.map(c => c.waterRequirement)} />
                <CompareItem label="Sowing Time" values={crops.map(c => c.sowingMonths.map((m: number) => {
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  return months[m-1];
                }).join(', '))} />
                <CompareItem label="Yield Potential" values={crops.map(c => {
                  const score = calculateCropScore(c, state.soil!, state.weather!);
                  return `${score}% Match`;
                })} />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-[#2D6A4F] text-white rounded-xl font-bold shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CompareItem({ label, values }: { label: string, values: string[] }) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block text-center">{label}</span>
      <div className="grid grid-cols-2 gap-4">
        {values.map((v, i) => (
          <div key={i} className="bg-gray-50 dark:bg-slate-900 p-3 rounded-xl text-center border border-transparent dark:border-slate-800">
            <span className="text-xs font-bold text-gray-700 dark:text-slate-200">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
