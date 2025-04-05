'use client';

import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'; // Removed unused import
import Calculator from './components/Calculator';
import PriceComparisonChart from './components/PriceComparisonChart';
import PackageComparison from './components/PackageComparison';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function Home() {
  // const router = useRouter(); // Removed unused variable
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
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
    <main className="min-h-screen bg-gray-100 relative">
      <div
        className="py-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.webp')" }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Car Sharing Calculator LV
          </h1>
          <p className="text-xl text-white text-center mt-4 max-w-3xl mx-auto">
            Find the most cost-effective car sharing option for your trip
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Calculator />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-2xl font-bold mb-4">Price vs Time Comparison for packages</h2>
            <p className="text-gray-600 mb-4">
              Bubble size represents distance in kilometers. Hover over points to see package details.
            </p>
            <PriceComparisonChart type="time" />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-2xl font-bold mb-4">Price vs Distance for packages</h2>
            <p className="text-gray-600 mb-4">
              Bubble size represents time in hours. Hover over points to see package details.
            </p>
            <PriceComparisonChart type="distance" />
          </div>
        </div>

        <div className="mb-8">
          <PackageComparison />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">About This Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-orange-600 mb-2">CityBee</h3>
              <p className="text-gray-700 mb-4">CityBee (orange cars) standard rates:</p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2">
                <li>Fixed fee: €1.49</li>
                <li>Per minute: €0.12</li>
                <li>Per hour: €5.49</li>
                <li>Per day: €19.99</li>
                <li>Per kilometer: €0.29</li>
                <li>Minimum trip price: €2.99</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-green-600 mb-2">Bolt</h3>
              <p className="text-gray-700 mb-4">Bolt (green cars) standard rates:</p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2">
                <li>Fixed fee: None</li>
                <li>Per minute: €0.11</li>
                <li>Per hour: €4.40</li>
                <li>Per day: €16.90</li>
                <li>Per kilometer: €0.26</li>
                <li>Minimum trip price: €2.35</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-2">CarGuru</h3>
              <p className="text-gray-700 mb-4">CarGuru (blue cars) standard rates:</p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2">
                <li>Fixed fee: €0.99</li>
                <li>Per minute: €0.09</li>
                <li>Per hour: €5.40</li>
                <li>Per day: €20.99</li>
                <li>Per kilometer: €0.23</li>
                <li>Minimum trip price: €2.00</li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">How It Works</h3>
            <p className="text-gray-700 mb-4">
              This calculator finds the most cost-effective option for your trip by:
            </p>
            <ol className="list-decimal ml-6 text-gray-700 space-y-2">
              <li>Calculating the standard price for both providers based on time and distance</li>
              <li>Checking all available packages from both providers</li>
              <li>Calculating any extra charges if you exceed package limits</li>
              <li>Recommending the cheapest option for your specific trip</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Scroll to Top/Bottom Buttons */}
      {showScrollButtons && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          <button
            onClick={scrollToTop}
            className="bg-gray-500 hover:bg-gray-400 text-white p-3 rounded-full shadow-lg transition-all"
            title="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <button
            onClick={scrollToBottom}
            className="bg-gray-500 hover:bg-gray-400 text-white p-3 rounded-full shadow-lg transition-all"
            title="Scroll to bottom"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            Car Sharing Calculator &copy; {new Date().getFullYear()} —{' '}
            <a href="https://rihards.dev" className="underline hover:text-gray-400" target="_blank" rel="noopener noreferrer">
              rihards.dev
            </a>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Prices and packages are subject to change. Please verify with the service providers.
          </p>
        </div>
      </footer>
    </main>
  );
}
