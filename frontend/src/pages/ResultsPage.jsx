import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { PageLoader } from '../components/Spinner';
import {
  Star, MapPin, Users, IndianRupee, Calendar, ArrowLeft,
  Award, Tag, Sunrise, Hotel, CheckCircle2
} from 'lucide-react';

const tagColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
];

const DestinationCard = ({ dest, rank }) => {
  const [expanded, setExpanded] = useState(rank === 0);
  const isTop = rank === 0;

  return (
    <div className={`bg-white rounded-3xl shadow-sm border overflow-hidden transition-all duration-300 ${isTop ? 'border-blue-300 ring-2 ring-blue-200 shadow-blue-100 shadow-lg' : 'border-gray-100 hover:shadow-md'}`}>
      {/* Top badge */}
      {isTop && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 text-sm font-bold flex items-center justify-center gap-2">
          <Award size={16} /> Best Match for Your Group
        </div>
      )}

      {/* Hero Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={dest.image}
          alt={dest.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Score badge */}
        <div className={`absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold shadow ${isTop ? 'bg-orange-500 text-white' : 'bg-white text-gray-800'}`}>
          <Star size={14} fill="currentColor" className="text-yellow-400" />
          {dest.score}% match
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-extrabold">{dest.name}</h3>
              <p className="text-sm text-gray-300 flex items-center gap-1"><MapPin size={13} /> {dest.state}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${dest.affordable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {dest.affordable ? '✓ Affordable' : '⚠ Over budget'}
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 px-5 pt-4">
        {dest.tags.map((tag, i) => (
          <span key={i} className={`badge text-xs ${tagColors[i % tagColors.length]}`}>
            <Tag size={11} className="mr-1" />{tag}
          </span>
        ))}
      </div>

      {/* Cost Summary */}
      <div className="grid grid-cols-3 gap-3 px-5 py-4">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Per Person</p>
          <p className="font-bold text-gray-900 text-sm">₹{dest.costPerPerson.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Cost</p>
          <p className="font-bold text-gray-900 text-sm">₹{dest.totalCost.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Per Day</p>
          <p className="font-bold text-gray-900 text-sm">₹{dest.costPerDay.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <p className="px-5 text-gray-500 text-sm italic pb-3">{dest.bestFor}</p>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-semibold py-3 px-5 border-t border-gray-100 hover:bg-blue-50 transition-all"
      >
        {expanded ? '▲ Show less' : '▼ Highlights & Hotels'}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-5 animate-fade-in">
          {/* Highlights */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Sunrise size={16} className="text-orange-500" /> Highlights
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {dest.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Hotels */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Hotel size={16} className="text-blue-500" /> Recommended Hotels
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {dest.hotels.map((hotel, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'; }}
                  />
                  <div className="p-3">
                    <p className="font-semibold text-gray-900 text-sm leading-tight">{hotel.name}</p>
                    <p className="text-blue-600 font-bold text-sm mt-1">₹{hotel.price.toLocaleString('en-IN')}<span className="text-gray-400 font-normal text-xs">/night</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResultsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await api.get(`/groups/${id}/destinations`);
        setData(res);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <PageLoader />;
  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 text-lg mb-4">Could not load destinations.</p>
        <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link to={`/group/${id}/members`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Members
        </Link>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            {['Create Group', 'Add Members', 'Find Destinations'].map((step, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-blue-600 text-white">{i + 1}</div>
                <span className="text-sm font-medium hidden sm:block text-blue-600">{step}</span>
                {i < 2 && <div className="flex-1 h-0.5 bg-blue-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="card mb-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
          <h1 className="text-2xl font-extrabold mb-1">🎯 Trip Results — {data.groupName}</h1>
          <p className="text-blue-200 text-sm mb-6">Based on {data.memberCount} member{data.memberCount !== 1 ? 's' : ''} over {data.tripDays} day{data.tripDays !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center">
              <Users size={20} className="mx-auto mb-1 text-blue-200" />
              <p className="text-xl font-bold">{data.memberCount}</p>
              <p className="text-xs text-blue-200">Members</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center">
              <IndianRupee size={20} className="mx-auto mb-1 text-blue-200" />
              <p className="text-xl font-bold">₹{data.avgBudget.toLocaleString('en-IN')}</p>
              <p className="text-xs text-blue-200">Avg Budget</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center">
              <Calendar size={20} className="mx-auto mb-1 text-blue-200" />
              <p className="text-xl font-bold">{data.tripDays}</p>
              <p className="text-xs text-blue-200">Days</p>
            </div>
          </div>
        </div>

        {/* Destination Cards */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ranked Destinations</h2>
        <div className="space-y-6">
          {data.destinations.map((dest, i) => (
            <DestinationCard key={dest.name} dest={dest} rank={i} />
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link to={`/group/${id}/members`} className="btn-secondary flex-1 text-center text-sm">
            ← Edit Members
          </Link>
          <Link to="/create-group" className="btn-primary flex-1 text-center text-sm">
            Plan Another Trip 🚀
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
