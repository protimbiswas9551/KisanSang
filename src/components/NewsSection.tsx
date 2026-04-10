import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { MarketNews } from '../types';
import { cn } from '../utils';

interface NewsSectionProps {
  news: MarketNews[] | null | undefined;
  t: any;
  className?: string;
}

export default function NewsSection({ news, t, className }: NewsSectionProps) {
  if (!news || news.length === 0) {
    return (
      <div className={cn("text-center py-10 card-bg rounded-[2rem] border border-dashed border-border/50", className)}>
        <Newspaper size={32} className="mx-auto mb-2 text-secondary opacity-20" />
        <p className="text-xs text-secondary font-medium">No news articles found matching your filter.</p>
      </div>
    );
  }

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide -mx-4 px-4">
        {news.map((item, idx) => (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={item.id}
            className="min-w-[280px] max-w-[280px] card-bg p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{item.source}</span>
                <span className="text-[10px] text-gray-400">{item.date}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-100 mb-2 line-clamp-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {item.summary}
              </p>
            </div>
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F] hover:underline"
            >
              {t.read_more}
              <ExternalLink size={12} />
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
