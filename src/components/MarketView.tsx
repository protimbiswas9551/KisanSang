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
  Scale
} from 'lucide-react';
import { AppState, MarketPrice } from '../types';
import { fetchMarketPrices } from '../services';
import { cn } from '../utils';

interface MarketViewProps {
  state: AppState;
  t: any;
  onDataUpdate: (data: MarketPrice[]) => void;
}

export default function MarketView({ state, t, onDataUpdate }: MarketViewProps) {
  const [loading, setLoading] = useState(!state.marketData);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await fetchMarketPrices();
      onDataUpdate(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch market prices');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!state.marketData) {
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
                className="card-bg p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
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
    </div>
  );
}
