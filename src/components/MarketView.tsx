import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  MapPin, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  ChevronRight,
  RefreshCw,
  Scale,
  X,
  Info,
  AlertCircle,
  Bug,
  Newspaper,
  ExternalLink
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { AppState, MarketPrice, Crop, Disease, MarketNews, PriceAlert } from '../types';
import { fetchMarketPrices, fetchMarketNews } from '../services';
import { cn } from '../utils';
import { CROPS, DISEASES } from '../constants';
import NewsSection from './NewsSection';

interface MarketViewProps {
  state: AppState;
  t: any;
  onDataUpdate: (data: MarketPrice[]) => void;
  onNewsUpdate: (news: MarketNews[]) => void;
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'isActive'>) => void;
  onRemoveAlert: (id: string) => void;
}

export default function MarketView({ state, t, onDataUpdate, onNewsUpdate, onAddAlert, onRemoveAlert }: MarketViewProps) {
  const [loading, setLoading] = useState(!state.marketData || !state.marketNews);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<MarketPrice | null>(null);

  const loadData = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setLoading(true);
    
    try {
      const [data, news] = await Promise.all([
        fetchMarketPrices(),
        fetchMarketNews()
      ]);
      onDataUpdate(data);
      onNewsUpdate(news);
      setError(null);
    } catch (err) {
      setError('Failed to fetch market data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!state.marketData || !state.marketNews) {
      loadData();
    }
  }, []);

  const prices = state.marketData || [];
  
  const states = ['All', ...Array.from(new Set(prices.map(p => p.state)))].sort();
  
  const filteredPrices = prices.filter(p => {
    const matchesSearch = p.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.market.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'All' || p.state === selectedState;
    return matchesSearch && matchesState;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="relative">
          <RefreshCw className="w-12 h-12 text-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp size={16} className="text-primary" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-text">{t.loading}</p>
          <p className="text-xs text-secondary mt-1">Fetching latest market trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-bold text-text">{t.market_prices}</h2>
          <p className="text-xs text-secondary font-medium mt-1 uppercase tracking-wider">Real-time Mandi Rates</p>
        </div>
        <button 
          onClick={() => loadData(true)}
          disabled={isRefreshing}
          className={cn(
            "p-3 rounded-2xl card-bg text-secondary hover:text-primary transition-all shadow-sm active:scale-95",
            isRefreshing && "animate-spin"
          )}
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Price Alerts Summary */}
      {state.priceAlerts.length > 0 && (
        <div className="px-1">
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-4 rounded-[2rem] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-100">{state.priceAlerts.length} Active Alerts</p>
                <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium uppercase tracking-wider">Monitoring commodities</p>
              </div>
            </div>
            <div className="flex -space-x-2">
              {state.priceAlerts.slice(0, 3).map((alert, i) => (
                <div key={alert.id} className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-amber-50 dark:border-amber-900/10 flex items-center justify-center text-[10px] font-bold text-amber-600">
                  {alert.commodity[0]}
                </div>
              ))}
              {state.priceAlerts.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-800 border-2 border-amber-50 dark:border-amber-900/10 flex items-center justify-center text-[10px] font-bold text-amber-600">
                  +{state.priceAlerts.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 px-1">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder={t.search_commodity}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl card-bg border border-transparent focus:border-primary/20 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={20} />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full pl-12 pr-10 py-4 rounded-2xl card-bg border border-transparent focus:border-primary/20 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
            >
              <option value="All">{t.all_states}</option>
              {states.filter(s => s !== 'All').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary rotate-90 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Price List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredPrices.length > 0 ? (
            filteredPrices.map((price, idx) => {
              const hasAlert = state.priceAlerts.some(a => a.commodity === price.commodity);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={price.id}
                  onClick={() => setSelectedPrice(price)}
                  className="card-bg p-6 rounded-[2rem] border border-border/30 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group cursor-pointer active:scale-[0.98] relative overflow-hidden"
                >
                  {hasAlert && (
                    <div className="absolute top-0 right-0 p-2">
                      <div className="bg-amber-500 text-white p-1.5 rounded-bl-2xl rounded-tr-xl shadow-lg">
                        <AlertCircle size={14} />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">{price.commodity}</h3>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {price.variety}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary text-xs font-medium">
                        <MapPin size={14} className="text-primary/60" />
                        <span>{price.market}, {price.district}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-display font-bold text-primary">₹{price.modalPrice}</div>
                      <div className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">per {price.unit}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                    <div className="space-y-1">
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Min Price</p>
                      <p className="text-sm font-bold text-text">₹{price.minPrice}</p>
                    </div>
                    <div className="space-y-1 border-x border-border/50 px-4">
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Max Price</p>
                      <p className="text-sm font-bold text-text">₹{price.maxPrice}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Arrival</p>
                      <p className="text-[10px] font-bold text-text">{price.arrivalDate}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-20 card-bg rounded-[2.5rem] border-2 border-dashed border-border/50">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary">
                <Search size={40} />
              </div>
              <p className="text-lg font-bold text-text">{t.no_results}</p>
              <p className="text-sm text-secondary mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-1">
        <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <TrendingUp size={120} />
          </div>
          <div className="flex gap-4 relative z-10">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-text mb-2">Market Insight</h4>
              <p className="text-sm text-secondary leading-relaxed">
                Prices are updated daily from Agmarknet. Consider selling when the modal price is closer to the maximum range for better returns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* News Section */}
      <NewsSection news={state.marketNews} t={t} />

      {/* Price Alerts Section */}
      <section className="space-y-6 px-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <AlertCircle size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">{t.price_alerts}</h2>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Smart Notifications</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {state.priceAlerts.length > 0 ? (
            state.priceAlerts.map(alert => {
              const currentPrice = state.marketData?.find(p => p.commodity === alert.commodity)?.modalPrice;
              const isTriggered = currentPrice && (alert.condition === 'above' ? currentPrice >= alert.threshold : currentPrice <= alert.threshold);
              
              return (
                <motion.div 
                  layout
                  key={alert.id} 
                  className={cn(
                    "card-bg p-6 rounded-[2rem] border flex items-center justify-between shadow-sm transition-all",
                    isTriggered ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/10 shadow-amber-500/10" : "border-border/30"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                      isTriggered ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-gray-100 dark:bg-gray-800 text-secondary"
                    )}>
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-text">{alert.commodity}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-secondary">
                          {t.notify_me} {alert.condition === 'above' ? t.above : t.below}
                        </span>
                        <span className="text-xs font-bold text-primary">₹{alert.threshold}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {isTriggered && (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest animate-pulse">Triggered</span>
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400">₹{currentPrice}</span>
                      </div>
                    )}
                    <button 
                      onClick={() => onRemoveAlert(alert.id)}
                      className="p-3 text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all active:scale-95"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12 card-bg rounded-[2.5rem] border-2 border-dashed border-border/50 opacity-60">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary">
                <AlertCircle size={32} />
              </div>
              <p className="text-sm font-bold text-text">{t.no_alerts}</p>
              <p className="text-xs text-secondary mt-1">Set alerts to get notified of price changes</p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedPrice && (
          <MarketDetailModal 
            price={selectedPrice} 
            t={t} 
            language={state.language}
            onClose={() => setSelectedPrice(null)} 
            onAddAlert={onAddAlert}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface MarketDetailModalProps {
  price: MarketPrice;
  t: any;
  language: string;
  onClose: () => void;
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'isActive'>) => void;
}

function MarketDetailModal({ price, t, language, onClose, onAddAlert }: MarketDetailModalProps) {
  const [alertThreshold, setAlertThreshold] = useState(price.modalPrice.toString());
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');
  const [showAddAlert, setShowAddAlert] = useState(false);
  
  const crop = CROPS.find(c => 
    Object.values(c.name).some(name => name.toLowerCase() === price.commodity.toLowerCase()) ||
    price.commodity.toLowerCase().includes(c.id.toLowerCase())
  );

  const cropDiseases = crop ? DISEASES.filter(d => d.crop === crop.id) : [];

  const getMonthName = (m: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[m - 1];
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg card-bg rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10"
      >
        <div className="p-8 border-b border-border/50 flex items-center justify-between sticky top-0 card-bg z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <TrendingUp size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text">{price.commodity}</h2>
              <p className="text-xs text-secondary font-medium uppercase tracking-wider mt-1">{price.market}, {price.state}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-secondary hover:text-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8">
          {/* Price Summary */}
          <div className="grid grid-cols-2 gap-6">
            <div className="card-bg p-6 rounded-[2rem] border border-border/50 shadow-sm">
              <span className="text-[10px] text-secondary uppercase font-bold tracking-widest block mb-2">{t.modal_price}</span>
              <div className="text-3xl font-display font-bold text-primary">₹{price.modalPrice}</div>
              <span className="text-[10px] text-secondary font-medium mt-1 block">per {price.unit}</span>
            </div>
            <button 
              onClick={() => setShowAddAlert(!showAddAlert)}
              className={cn(
                "rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-lg",
                showAddAlert 
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 border-2 border-amber-500 shadow-amber-500/10" 
                  : "bg-amber-500 text-white shadow-amber-500/20"
              )}
            >
              <AlertCircle size={28} />
              <span className="text-xs font-bold uppercase tracking-wider">{t.set_alert}</span>
            </button>
          </div>

          <AnimatePresence>
            {showAddAlert && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="card-bg p-6 rounded-[2.5rem] border-2 border-amber-500/30 bg-amber-50/30 dark:bg-amber-900/10 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">{t.alert_threshold}</label>
                      <input 
                        type="number" 
                        value={alertThreshold}
                        onChange={(e) => setAlertThreshold(e.target.value)}
                        className="w-full card-bg border border-border/50 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-1">{t.alert_condition}</label>
                      <select 
                        value={alertCondition}
                        onChange={(e) => setAlertCondition(e.target.value as 'above' | 'below')}
                        className="w-full card-bg border border-border/50 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="above">{t.above}</option>
                        <option value="below">{t.below}</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      onAddAlert({
                        commodity: price.commodity,
                        threshold: parseFloat(alertThreshold),
                        condition: alertCondition
                      });
                      setShowAddAlert(false);
                    }}
                    className="w-full py-4 bg-amber-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    {t.save} Alert
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {crop ? (
            <>
              {/* Growing Season */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Calendar size={20} />
                  <h3 className="font-bold text-sm uppercase tracking-widest">Growing Season</h3>
                </div>
                <div className="card-bg p-6 rounded-[2.5rem] border border-border/50">
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                      const isSowing = crop.sowingMonths.includes(m);
                      return (
                        <div 
                          key={m}
                          className={cn(
                            "h-12 rounded-xl flex items-center justify-center text-[10px] font-bold border transition-all",
                            isSowing 
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                              : "bg-gray-50 dark:bg-gray-800/50 text-secondary border-transparent"
                          )}
                        >
                          {getMonthName(m)}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <Info size={16} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-secondary font-medium leading-relaxed">
                      Highlighted months indicate the ideal sowing window for <strong>{price.commodity}</strong> in this region.
                    </p>
                  </div>
                </div>
              </div>

              {/* Crop Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-amber-600">
                  <Info size={20} />
                  <h3 className="font-bold text-sm uppercase tracking-widest">Crop Details</h3>
                </div>
                <div className="card-bg p-6 rounded-[2.5rem] border border-border/50 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-widest px-1">Description</span>
                    <p className="text-sm text-text leading-relaxed font-medium">
                      {crop.description[language] || crop.description.en}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <span className="text-[10px] text-secondary font-bold uppercase tracking-widest px-1">Soil Type</span>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-border/30">
                        <p className="text-xs text-text font-bold">
                          {crop.soilType[language] || crop.soilType.en}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] text-secondary font-bold uppercase tracking-widest px-1">Water Need</span>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-border/30">
                        <p className="text-xs text-text font-bold">
                          {crop.waterRequirement}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pests & Diseases */}
              {cropDiseases.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-red-600">
                    <Bug size={20} />
                    <h3 className="font-bold text-sm uppercase tracking-widest">Common Pests & Diseases</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {cropDiseases.map(disease => (
                      <div key={disease.id} className="card-bg p-4 rounded-2xl border border-red-100 dark:border-red-900/20 flex gap-4 group hover:border-red-500/30 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 shrink-0 group-hover:scale-110 transition-transform">
                          <AlertCircle size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-text group-hover:text-red-600 transition-colors">
                            {disease.name[language] || disease.name.en}
                          </h4>
                          <p className="text-[11px] text-secondary mt-1 leading-relaxed line-clamp-2">
                            {disease.symptoms[language] || disease.symptoms.en}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 p-6 rounded-[2.5rem] flex gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
                <AlertCircle size={24} />
              </div>
              <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed font-medium">
                Detailed agricultural data for <strong>{price.commodity}</strong> is currently unavailable in our library. We are constantly updating our database to provide you with the best insights.
              </p>
            </div>
          )}
        </div>

        <div className="p-8 card-bg border-t border-border/50">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </div>
  );
}
