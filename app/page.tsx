'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calculator from './components/Calculator';
import PriceComparisonChart from './components/PriceComparisonChart';
import PackageComparison from './components/PackageComparison';
import { ArrowUp, ArrowDown, Car, Zap, Shield, TrendingDown } from 'lucide-react';

export default function Home() {
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButtons(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  return (
    <main className="min-h-screen bg-[#0a0a0f] relative noise-bg">
      {/* Ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[128px]" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 mb-8">
            <Zap className="w-3 h-3 text-orange-400" />
            Compare CityBee, Bolt & CarGuru instantly
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="gradient-text">Car Sharing</span>
            <br />
            <span className="text-white">Calculator LV</span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Find the most cost-effective car sharing option for your trip.
            We compare all packages and standard rates to save you money.
          </p>

          <div className="flex justify-center gap-8 mt-12">
            {[
              { icon: Car, label: '3 Providers', sublabel: 'Compared' },
              { icon: TrendingDown, label: '100+ Packages', sublabel: 'Analyzed' },
              { icon: Shield, label: 'Real Prices', sublabel: 'Up to date' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mb-2">
                  <item.icon className="w-5 h-5 text-zinc-400" />
                </div>
                <p className="text-sm font-medium text-zinc-200">{item.label}</p>
                <p className="text-xs text-zinc-500">{item.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-12 space-y-8">
        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Calculator />
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-1">Price vs Time</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Bubble size represents distance. Hover for details.
            </p>
            <PriceComparisonChart type="time" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-1">Price vs Distance</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Bubble size represents time. Hover for details.
            </p>
            <PriceComparisonChart type="distance" />
          </motion.div>
        </div>

        {/* Package Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <PackageComparison />
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Standard Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'CityBee', color: 'orange', rates: [
                { label: 'Fixed fee', value: '€1.49' },
                { label: 'Per minute', value: '€0.12' },
                { label: 'Per hour', value: '€5.49' },
                { label: 'Per day', value: '€19.99' },
                { label: 'Per km', value: '€0.29' },
                { label: 'Min price', value: '€2.99' },
              ]},
              { name: 'Bolt', color: 'green', rates: [
                { label: 'Fixed fee', value: 'None' },
                { label: 'Per minute', value: '€0.11' },
                { label: 'Per hour', value: '€4.40' },
                { label: 'Per day', value: '€16.90' },
                { label: 'Per km', value: '€0.26' },
                { label: 'Min price', value: '€2.35' },
              ]},
              { name: 'CarGuru', color: 'blue', rates: [
                { label: 'Fixed fee', value: '€0.99' },
                { label: 'Per minute', value: '€0.09' },
                { label: 'Per hour', value: '€5.40' },
                { label: 'Per day', value: '€20.99' },
                { label: 'Per km', value: '€0.23' },
                { label: 'Min price', value: '€2.00' },
              ]},
            ].map((provider) => (
              <div
                key={provider.name}
                className={`rounded-xl border p-5 ${
                  provider.color === 'orange'
                    ? 'border-orange-500/20 bg-orange-500/5'
                    : provider.color === 'green'
                      ? 'border-green-500/20 bg-green-500/5'
                      : 'border-blue-500/20 bg-blue-500/5'
                }`}
              >
                <h3 className={`text-lg font-bold mb-4 ${
                  provider.color === 'orange' ? 'text-orange-400'
                    : provider.color === 'green' ? 'text-green-400'
                      : 'text-blue-400'
                }`}>{provider.name}</h3>
                <div className="space-y-2.5">
                  {provider.rates.map((rate) => (
                    <div key={rate.label} className="flex justify-between text-sm">
                      <span className="text-zinc-500">{rate.label}</span>
                      <span className="text-zinc-300 font-medium">{rate.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                'Calculate standard prices for all providers',
                'Check all available packages',
                'Calculate extra charges for package overages',
                'Recommend the cheapest option',
              ].map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-7 h-7 shrink-0 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">
                    {i + 1}
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Buttons */}
      <AnimatePresence>
        {showScrollButtons && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 flex flex-col gap-2 z-50"
          >
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-xl bg-zinc-800/80 backdrop-blur border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-700/80 transition-all flex items-center justify-center"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToBottom}
              className="w-10 h-10 rounded-xl bg-zinc-800/80 backdrop-blur border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-700/80 transition-all flex items-center justify-center"
              title="Scroll to bottom"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-500 text-sm">
            Car Sharing Calculator &copy; {new Date().getFullYear()} &mdash;{' '}
            <a href="https://rihards.dev" className="text-zinc-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              rihards.dev
            </a>
          </p>
          <p className="text-zinc-600 text-xs mt-2">
            Prices and packages are subject to change. Please verify with the service providers.
          </p>
        </div>
      </footer>
    </main>
  );
}
