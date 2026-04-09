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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <RefreshCw className="w-8 h-8 text-[#2D6A4F] animate-spin" />
        <p className="text-gray-500 dark:text-slate-400 text-sm">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">{t.market_prices}</h2>
        <button 
          onClick={() => loadData(true)}
          disabled={isRefreshing}
          className={cn(
            "p-2 rounded-lg card-bg text-gray-600 dark:text-slate-400 active:scale-95 transition-all",
            isRefreshing && "animate-spin"
          )}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder={t.search_commodity}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl card-bg border border-gray-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl card-bg border border-gray-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all appearance-none"
            >
              <option value="All">{t.all_states}</option>
              {states.filter(s => s !== 'All').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price List */}
        <div className="space-y-3">
          {filteredPrices.length > 0 ? (
            filteredPrices.map((price, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={price.id}
                onClick={() => setSelectedPrice(price)}
                className="card-bg p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800 dark:text-slate-100">{price.commodity}</h3>
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-full font-medium">
                        {price.variety}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400 text-[10px]">
                      <MapPin size={10} className="text-[#2D6A4F]" />
                      <span>{price.market}, {price.district}, {price.state}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#2D6A4F]">₹{price.modalPrice}</div>
                    <div className="text-[10px] text-gray-400 font-medium">per {price.unit}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-50 dark:border-slate-800/50">
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Min</div>
                    <div className="text-xs font-bold text-gray-700 dark:text-slate-300">₹{price.minPrice}</div>
                  </div>
                  <div className="text-center border-x border-gray-50 dark:border-slate-800/50">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Max</div>
                    <div className="text-xs font-bold text-gray-700 dark:text-slate-300">₹{price.maxPrice}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Date</div>
                    <div className="text-[10px] font-bold text-gray-600 dark:text-slate-400">{price.arrivalDate}</div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 card-bg rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
              <p className="text-gray-500 dark:text-slate-400 text-sm">{t.no_results}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-4 rounded-xl">
        <div className="flex gap-3">
          <TrendingUp className="text-blue-500 shrink-0" size={20} />
          <div>
            <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-1">Market Insight</h4>
            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
              Prices are updated daily from Agmarknet. Consider selling when the modal price is closer to the maximum range.
            </p>
          </div>
        </div>
      </div>

      {/* News Section */}
      <NewsSection news={state.marketNews} t={t} />

      {/* Price Alerts Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertCircle size={20} />
            <h2 className="font-bold text-gray-800 dark:text-slate-100">{t.price_alerts}</h2>
          </div>
        </div>
        
        <div className="space-y-3">
          {state.priceAlerts.length > 0 ? (
            state.priceAlerts.map(alert => {
              const currentPrice = state.marketData?.find(p => p.commodity === alert.commodity)?.modalPrice;
              const isTriggered = currentPrice && (alert.condition === 'above' ? currentPrice >= alert.threshold : currentPrice <= alert.threshold);
              
              return (
                <div key={alert.id} className={cn(
                  "card-bg p-4 rounded-2xl border flex items-center justify-between shadow-sm",
                  isTriggered ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/10" : "border-gray-100 dark:border-slate-800"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      isTriggered ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-400"
                    )}>
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-slate-100">{alert.commodity}</h4>
                      <p className="text-[10px] text-gray-500 dark:text-slate-400">
                        {t.notify_me} {alert.condition === 'above' ? t.above : t.below} ₹{alert.threshold}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {isTriggered && (
                      <span className="text-[10px] font-bold text-amber-600 animate-pulse">TRIGGERED</span>
                    )}
                    <button 
                      onClick={() => onRemoveAlert(alert.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 card-bg rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 opacity-60">
              <p className="text-xs text-gray-400">{t.no_alerts}</p>
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
        className="relative w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">{price.commodity}</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">{price.market}, {price.state}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Price Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card-bg p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-1">{t.modal_price}</span>
              <div className="text-2xl font-bold text-[#2D6A4F]">₹{price.modalPrice}</div>
              <span className="text-[10px] text-gray-500">per {price.unit}</span>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setShowAddAlert(!showAddAlert)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
              >
                <AlertCircle size={20} />
                <span className="text-[10px] font-bold uppercase">{t.set_alert}</span>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showAddAlert && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="card-bg p-4 rounded-2xl border border-amber-200 dark:border-amber-900/30 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">{t.alert_threshold}</label>
                      <input 
                        type="number" 
                        value={alertThreshold}
                        onChange={(e) => setAlertThreshold(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">{t.alert_condition}</label>
                      <select 
                        value={alertCondition}
                        onChange={(e) => setAlertCondition(e.target.value as 'above' | 'below')}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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
                    className="w-full py-2 bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all"
                  >
                    {t.save}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {crop ? (
            <>
              {/* Growing Season */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#2D6A4F]">
                  <Calendar size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Growing Season</h3>
                </div>
                <div className="card-bg p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                      const isSowing = crop.sowingMonths.includes(m);
                      return (
                        <div 
                          key={m}
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all",
                            isSowing 
                              ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-sm" 
                              : "bg-gray-50 dark:bg-slate-900 text-gray-300 dark:text-slate-700 border-gray-100 dark:border-slate-800"
                          )}
                        >
                          {getMonthName(m)}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-3 italic">
                    Highlighted months indicate the ideal sowing window for {price.commodity}.
                  </p>
                </div>
              </div>

              {/* Crop Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-600">
                  <Info size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Crop Details</h3>
                </div>
                <div className="card-bg p-4 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-3">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Description</span>
                    <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                      {crop.description[language] || crop.description.en}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Soil Type</span>
                      <p className="text-xs text-gray-700 dark:text-slate-300 font-medium">
                        {crop.soilType[language] || crop.soilType.en}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Water Need</span>
                      <p className="text-xs text-gray-700 dark:text-slate-300 font-medium">
                        {crop.waterRequirement}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pests & Diseases */}
              {cropDiseases.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-600">
                    <Bug size={18} />
                    <h3 className="font-bold text-sm uppercase tracking-wider">Common Pests & Diseases</h3>
                  </div>
                  <div className="space-y-2">
                    {cropDiseases.map(disease => (
                      <div key={disease.id} className="card-bg p-3 rounded-xl border border-red-50 dark:border-red-900/20 flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 shrink-0">
                          <AlertCircle size={16} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-800 dark:text-slate-100">
                            {disease.name[language] || disease.name.en}
                          </h4>
                          <p className="text-[10px] text-gray-500 dark:text-slate-400 line-clamp-2">
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
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 p-4 rounded-2xl flex gap-3">
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                Detailed agricultural data for <strong>{price.commodity}</strong> is currently unavailable in our library. We are constantly updating our database.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 dark:bg-slate-900/50 border-t border-border">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-[#2D6A4F] text-white rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
