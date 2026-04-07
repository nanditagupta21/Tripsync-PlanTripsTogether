import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Users, IndianRupee, Star, ArrowRight, CheckCircle2, Compass, Shield } from 'lucide-react';

const FEATURES = [
  { icon: <Users size={24} className="text-blue-500" />, title: 'Group Planning', desc: 'Add all your friends with their cities and budgets in one place.' },
  { icon: <IndianRupee size={24} className="text-green-500" />, title: 'Budget Optimizer', desc: 'We crunch everyone\'s budget and find the ideal destination that fits all.' },
  { icon: <Compass size={24} className="text-orange-500" />, title: 'Smart Destinations', desc: 'Get ranked destination suggestions with hotels, highlights, and cost breakdown.' },
  { icon: <Shield size={24} className="text-purple-500" />, title: 'Secure & Private', desc: 'Your trip data is protected with JWT auth and encrypted passwords.' },
];

const DESTINATIONS = [
  { name: 'Goa', tag: 'Beaches & Vibes', img: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=600&q=80', rating: 4.8 },
  { name: 'Jaipur', tag: 'Heritage & Culture', img: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&q=80', rating: 4.7 },
  { name: 'Manali', tag: 'Mountains & Snow', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', rating: 4.9 },
  { name: 'Rishikesh', tag: 'Adventure & Yoga', img: 'https://images.unsplash.com/photo-1591968289588-f8ba7a72e8dd?w=600&q=80', rating: 4.6 },
  { name: 'Kerala', tag: 'Backwaters & Nature', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', rating: 4.8 },
];

const STEPS = [
  { step: '01', title: 'Create Your Group', desc: 'Set a group name, travel dates, and optional max budget.' },
  { step: '02', title: 'Add All Members', desc: 'Each friend adds their home city and travel budget.' },
  { step: '03', title: 'Find Destinations', desc: 'Our algorithm ranks the best destinations for your group.' },
  { step: '04', title: 'Book & Go!', desc: 'Pick your favourite, check hotel suggestions, and start packing.' },
];

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/75 to-indigo-900/80" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-8">
              <MapPin size={14} className="text-orange-400" />
              Smart Group Travel Planning for India 🇮🇳
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              Find the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
                Perfect Trip
              </span>
              <br />for Your Group
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed max-w-2xl">
              Friends from Mumbai, Delhi, Bangalore? We find destinations that work for everyone's budget and location.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link to="/dashboard" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5">
                  Go to Dashboard <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5">
                    Plan a Group Trip <ArrowRight size={20} />
                  </Link>
                  <Link to="/login" className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all border border-white/30">
                    Login
                  </Link>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-12 text-sm text-blue-200">
              {['Free to use', 'No credit card required', '5+ smart destinations'].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 0 960 80 720 40C480 0 240 80 0 40L0 80Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why GroupTripFinder?</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Everything you need to plan a group trip without the chaos of WhatsApp polls.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="card hover:shadow-md transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-500">Four simple steps to your dream group trip.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 to-blue-400" />
            {STEPS.map((s, i) => (
              <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-extrabold mx-auto mb-4 shadow-lg shadow-blue-200">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Showcase */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-xl text-gray-500">Our algorithm recommends from these curated Indian destinations.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {DESTINATIONS.map((d, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                <img src={d.img} alt={d.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-bold text-base">{d.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <Star size={11} fill="currentColor" /> {d.rating}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300">{d.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Plan Your Group Trip?</h2>
          <p className="text-xl text-blue-200 mb-10">Join thousands of groups who found their perfect destination with us.</p>
          {user ? (
            <Link to="/create-group" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all shadow-xl hover:-translate-y-0.5">
              Create New Trip <ArrowRight size={20} />
            </Link>
          ) : (
            <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold py-4 px-10 rounded-2xl text-lg transition-all shadow-xl hover:-translate-y-0.5">
              Get Started Free <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
