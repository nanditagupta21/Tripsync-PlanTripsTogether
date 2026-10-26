import { Link } from 'react-router-dom';
import { MapPin, Mail, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-600 p-2 rounded-xl">
              <MapPin size={18} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">TripSync</span>
          </div>
          <p className="text-sm leading-relaxed">
            Helping groups from different cities find the most budget-friendly travel destination together.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Features</h4>
          <ul className="space-y-2 text-sm">
            <li>✈️ Group Travel Planning</li>
            <li>💰 Budget Optimization</li>
            <li>🗺️ Smart Destination Finder</li>
            <li>🏨 Hotel Suggestions</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <div className="flex items-center gap-2 text-sm mb-2">
            <Mail size={14} />
            <span>support@tripsync.com</span>
          </div>
          <p className="text-sm">India 🇮🇳</p>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">© 2026 TripSync. All rights reserved.</p>
        <p className="text-sm flex items-center gap-1">Made with <Heart size={14} className="text-red-500" /> in India</p>
      </div>
    </div>
  </footer>
);

export default Footer;
