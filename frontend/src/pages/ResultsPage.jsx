
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { PageLoader } from '../components/Spinner';
import {
  Star, MapPin, Users, IndianRupee, Calendar, ArrowLeft,
  Award, Tag, Sunrise, Hotel, CheckCircle2, Train, Bus, Car, Plane,
  Share2, ChevronDown, ChevronUp, Info, Navigation, CalendarDays,
  Sparkles, Copy, RefreshCw, Clock, Wallet, Compass
} from 'lucide-react';

const tagColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
];

const TRAVEL_MODES = [
  { key: 'train', label: 'Train', Icon: Train },
  { key: 'flight', label: 'Flight', Icon: Plane },
  { key: 'road', label: 'Road Trip', Icon: Car },
  { key: 'bus', label: 'Bus', Icon: Bus },
];

const formatMoney = (amount) =>
  Number(amount ?? 0).toLocaleString('en-IN');

const NEARBY = {
  Rishikesh: ['Haridwar', 'Mussoorie', 'Dehradun'],
  Jaipur: ['Ajmer', 'Pushkar', 'Udaipur'],
  Goa: ['Gokarna', 'Malvan', 'Pondicherry'],
  Manali: ['Kasol', 'Kufri', 'Dharamshala'],
  Kerala: ['Coorg', 'Ooty', 'Munnar'],
  Kasol: ['Manali', 'Tosh', 'Manikaran'],
  'Old Manali': ['Kasol', 'Kullu', 'Solang Valley'],
  Kodaikanal: ['Madurai', 'Munnar', 'Ooty'],
};
const AI_DESTINATION_IMAGES = {
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80',
  kasol: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80',
  munnar: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',
  jaipur: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=900&q=80',
  rishikesh: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&q=80',
  kodaikanal: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=900&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80',
  varkala: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80',
  alleppey: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80',
  coorg: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=900&q=80',
  shimla: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=80',
  darjeeling: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=80',
  udaipur: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=900&q=80',
  andaman: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=900&q=80',
};

const getAIDestinationImage = (name = '') => {
  const key = name.toLowerCase();

  const match = Object.keys(AI_DESTINATION_IMAGES).find((place) =>
    key.includes(place)
  );

  return match
    ? AI_DESTINATION_IMAGES[match]
    : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80';
};

const parseAIRecommendations = (text = '') => {
  if (!text || typeof text !== 'string' || !text.trim()) return [];

  const sections = text.split(
    /(?=DESTINATION\s*\d*\s*:\s*)/i
  );

  return sections
    .filter((section) => /DESTINATION\s*\d*\s*:/i.test(section))
    .map((section, index) => {
      const titleMatch = section.match(
        /DESTINATION\s*\d*\s*:\s*([^\r\n]+)/i
      );

      const title = titleMatch
        ? titleMatch[1]
            .replace(/\*\*/g, '')
            .replace(/^#+\s*/, '')
            .trim()
        : `Destination ${index + 1}`;

      const cleanSection = section
        .replace(/\*\*/g, '')
        .replace(/^\s*[-*]\s+/gm, '')
        .replace(/\\(?=\r?\n|$)/g, '\n')
        .trim();

      const details = cleanSection
        .replace(/^DESTINATION\s*\d*\s*:\s*[^\r\n]+/i, '')
        .trim();

      const getDetail = (pattern) =>
        cleanSection.match(pattern)?.[1]?.trim() || '';

      return {
        title,
        image: getAIDestinationImage(title),
        details,
        why: getDetail(
          /Why it suits (?:the )?group\s*:\s*([\s\S]*?)(?=Suggested activities\s*:|Accommodation per person\s*:|Food and activities per person\s*:|Member-wise budget breakdown\s*:|Things to consider\s*:|$)/i
        ),
        activities: getDetail(
          /Suggested activities\s*:\s*([\s\S]*?)(?=Accommodation per person\s*:|Food and activities per person\s*:|Member-wise budget breakdown\s*:|Things to consider\s*:|$)/i
        ),
      };
    });
};




const ITINERARIES = {
  Rishikesh: [
    { day: 1, title: 'Arrival & Ganga Aarti', morning: 'Check in and freshen up', afternoon: 'Explore Laxman Jhula and Ram Jhula', evening: 'Visit Triveni Ghat for Ganga Aarti', tip: 'Check the local Aarti timing before visiting.' },
    { day: 2, title: 'Adventure Day', morning: 'Explore local adventure activities', afternoon: 'Lunch at a riverside cafe', evening: 'Relax by the Ganga', tip: 'Use authorised adventure operators.' },
    { day: 3, title: 'Nature & Departure', morning: 'Visit a nearby waterfall if accessible', afternoon: 'Explore local cafes and markets', evening: 'Depart for home', tip: 'Allow enough time for your return journey.' },
  ],
  Jaipur: [
    { day: 1, title: 'Explore the Pink City', morning: 'Check in and explore the old city', afternoon: 'Visit Hawa Mahal and City Palace', evening: 'Try a local Rajasthani meal', tip: 'Check monument opening times.' },
    { day: 2, title: 'Forts & Views', morning: 'Visit Amber Fort', afternoon: 'Explore Nahargarh Fort', evening: 'Enjoy a rooftop cafe', tip: 'Start early to avoid the midday heat.' },
    { day: 3, title: 'Markets & Departure', morning: 'Visit Jantar Mantar', afternoon: 'Shop at local bazaars', evening: 'Depart for home', tip: 'Keep time for station or airport transfers.' },
  ],
  Goa: [
    { day: 1, title: 'Beaches & Cafes', morning: 'Check in and visit a nearby beach', afternoon: 'Explore beachside cafes', evening: 'Watch the sunset', tip: 'Check beach conditions and local guidance.' },
    { day: 2, title: 'Heritage & Culture', morning: 'Explore Old Goa', afternoon: 'Walk through Fontainhas', evening: 'Enjoy a local dinner', tip: 'Confirm attraction opening times.' },
    { day: 3, title: 'Coast & Departure', morning: 'Enjoy a beach walk', afternoon: 'Explore a local market', evening: 'Depart for home', tip: 'Plan transport to the station or airport.' },
  ],
  Manali: [
    { day: 1, title: 'Arrival & Old Manali', morning: 'Check in and rest', afternoon: 'Visit Hadimba Devi Temple', evening: 'Explore Old Manali cafes', tip: 'Allow time to rest after travelling.' },
    { day: 2, title: 'Mountain Views', morning: 'Visit Solang Valley', afternoon: 'Enjoy the mountain scenery', evening: 'Relax at a cafe', tip: 'Check weather and road conditions.' },
    { day: 3, title: 'Local Exploration', morning: 'Explore Mall Road', afternoon: 'Shop for local products', evening: 'Start your return journey', tip: 'Check your transport departure time.' },
  ],
  Kasol: [
    { day: 1, title: 'Arrival & Cafe Culture', morning: 'Arrive and check in', afternoon: 'Explore Kasol market', evening: 'Visit riverside cafes', tip: 'Plan the final bus or taxi connection.' },
    { day: 2, title: 'Nature & Nearby Villages', morning: 'Explore nearby walking trails', afternoon: 'Enjoy local food and views', evening: 'Relax by the river where permitted', tip: 'Check trail conditions before setting out.' },
    { day: 3, title: 'Slow Morning & Departure', morning: 'Breakfast at a local cafe', afternoon: 'Prepare for the return journey', evening: 'Depart', tip: 'Leave enough time for connecting transport.' },
  ],
  Kerala: [
    { day: 1, title: 'Explore Kochi', morning: 'Arrive and check in', afternoon: 'Explore Fort Kochi', evening: 'Try local Kerala cuisine', tip: 'Confirm attraction opening times.' },
    { day: 2, title: 'Backwaters & Nature', morning: 'Travel to the backwaters', afternoon: 'Explore the area', evening: 'Enjoy a relaxed dinner', tip: 'Confirm what is included in any cruise booking.' },
    { day: 3, title: 'Local Exploration & Departure', morning: 'Enjoy a local breakfast', afternoon: 'Explore nearby sights', evening: 'Depart', tip: 'Allow sufficient transfer time.' },
  ],
  Kodaikanal: [
    { day: 1, title: 'Arrival & Lake', morning: 'Check in and rest', afternoon: 'Explore Kodaikanal Lake', evening: 'Visit a local cafe', tip: 'Check weather before outdoor activities.' },
    { day: 2, title: 'Scenic Views', morning: 'Visit Coaker’s Walk', afternoon: 'Explore Pillar Rocks if accessible', evening: 'Enjoy a quiet cafe', tip: 'Check local conditions and opening times.' },
    { day: 3, title: 'Local Markets & Departure', morning: 'Enjoy breakfast', afternoon: 'Explore local shops', evening: 'Depart', tip: 'Allow time for the onward connection.' },
  ],
};

const getItinerary = (destName, tripDays) => {
  const plan = ITINERARIES[destName] || [];
  return plan.slice(0, Math.min(Number(tripDays) || 0, plan.length));
};

const WhyMatch = ({ dest, avgBudget }) => {
  const [open, setOpen] = useState(false);
  const difference = Number(avgBudget || 0) - Number(dest.costPerPerson || 0);
  const score = Number(dest.score || 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"
      >
        <span className="flex items-center gap-2"><Info size={15} /> Why this match?</span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && (
        <div className="space-y-3 bg-white p-4 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Average budget comparison</span>
            <span className={difference >= 0 ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>
              {difference >= 0 ? `₹${formatMoney(difference)} under` : `₹${formatMoney(Math.abs(difference))} over`}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Matching categories</span>
            <span className="font-semibold">{(dest.tags || []).length}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Destination match score</span>
            <span className="font-bold text-blue-700">{score}%</span>
          </div>
          <p className="border-t pt-2 text-xs text-gray-400">
            This score represents the application's estimated budget and category fit.
          </p>
        </div>
      )}
    </div>
  );
};

const ItinerarySection = ({ destName, tripDays }) => {
  const [open, setOpen] = useState(false);
  const plan = getItinerary(destName, tripDays);

  if (!plan.length) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-orange-100">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-100"
      >
        <span className="flex items-center gap-2"><CalendarDays size={15} /> Suggested itinerary</span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && (
        <div className="divide-y divide-gray-100 bg-white">
          {plan.map((day) => (
            <div key={day.day} className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">{day.day}</span>
                <h4 className="font-bold text-gray-900">{day.title}</h4>
              </div>
              <div className="ml-9 space-y-1 text-sm text-gray-600">
                <p><strong>Morning:</strong> {day.morning}</p>
                <p><strong>Afternoon:</strong> {day.afternoon}</p>
                <p><strong>Evening:</strong> {day.evening}</p>
                <p className="mt-2 rounded-lg bg-yellow-50 p-2 text-xs text-yellow-800">Tip: {day.tip}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NearbySection = ({ destName }) => {
  const nearby = NEARBY[destName];
  if (!nearby) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-green-100">
      <div className="flex items-center gap-2 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
        <Navigation size={15} /> Nearby places to consider
      </div>
      <div className="flex flex-wrap gap-2 bg-white p-4">
        {nearby.map((place) => (
          <span key={place} className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            <MapPin size={11} className="mr-1 inline" />{place}
          </span>
        ))}
      </div>
    </div>
  );
};

const ShareButton = ({ groupName, memberCount, tripDays, avgBudget, topDest }) => {
  const handleShare = () => {
    const text =
      `🌍 TripSync Results — ${groupName}\n\n` +
      `Members: ${memberCount}\n` +
      `Duration: ${tripDays} days\n` +
      `Average budget: ₹${formatMoney(avgBudget)}/person\n` +
      `Top destination match: ${topDest}\n\n` +
      `View results: ${window.location.href}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    toast.success('Opening WhatsApp!');
  };

  return (
    <button onClick={handleShare} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 sm:w-auto">
      <Share2 size={16} /> Share on WhatsApp
    </button>
  );
};

const MemberCostBreakdown = ({ dest }) => {
  const members = Array.isArray(dest.memberCosts) ? dest.memberCosts : [];

  if (!members.length) {
    return (
      <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
        <h4 className="mb-2 text-sm font-bold text-gray-800">Individual member costs</h4>
        <p className="text-sm text-orange-700">
          The destination API has not returned a member-wise cost breakdown for this destination.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl bg-gray-50 p-4">
      <h4 className="text-sm font-bold text-gray-800">Individual member costs</h4>
      {members.map((member, index) => {
        const mode = TRAVEL_MODES.find((item) => item.key === member.travelMode);
        const ModeIcon = mode?.Icon || MapPin;
        const transport = Number(member.estimatedTransportCost ?? 0);
        const stay = Number(member.estimatedStayAndActivitiesCost ?? 0);
        const total = Number(member.estimatedTotal ?? transport + stay);
        const budget = Number(member.budget ?? 0);
        const withinBudget = member.withinBudget ?? total <= budget;

        return (
          <div key={member.memberId || `${member.name || 'member'}-${index}`} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">{member.name || `Member ${index + 1}`}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500"><MapPin size={12} />{member.city || 'City not provided'}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-blue-600"><ModeIcon size={13} />{mode?.label || member.travelMode || 'Transport not specified'}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${withinBudget ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {withinBudget ? 'Within budget' : 'Over budget'}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-3 text-gray-600"><span>Transport (estimated)</span><span>₹{formatMoney(transport)}</span></div>
              <div className="flex justify-between gap-3 text-gray-600"><span>Stay + activities</span><span>₹{formatMoney(stay)}</span></div>
              <div className="flex justify-between gap-3 text-gray-600"><span>Personal budget</span><span>₹{formatMoney(budget)}</span></div>
              <div className="flex justify-between gap-3 border-t pt-3 font-bold text-gray-900"><span>Estimated total</span><span>₹{formatMoney(total)}</span></div>
            </div>
            <p className={`text-xs font-medium ${withinBudget ? 'text-green-700' : 'text-red-600'}`}>
              {withinBudget
                ? `₹${formatMoney(Math.max(0, budget - total))} remaining`
                : `₹${formatMoney(Math.max(0, total - budget))} over budget`}
            </p>
          </div>
        );
      })}
      <p className="text-xs text-gray-500">Transport estimates are not live fares. Confirm actual prices and schedules before booking.</p>
    </div>
  );
};

const DestinationCard = ({ dest, rank, avgBudget, tripDays }) => {
  const [expanded, setExpanded] = useState(rank === 0);
  const isTop = rank === 0;
  const tags = Array.isArray(dest.tags) ? dest.tags : [];
  const highlights = Array.isArray(dest.highlights) ? dest.highlights : [];
  const hotels = Array.isArray(dest.hotels) ? dest.hotels : [];

  return (
    <article className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md ${isTop ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100'}`}>
      {isTop && <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-sm font-bold text-white"><Award size={16} /> Best match for your group</div>}

      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-200 to-indigo-300">
        <img
          src={dest.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'}
          alt={dest.name || 'Destination'}
          className="h-full w-full object-cover"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className={`absolute right-3 top-3 flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold ${isTop ? 'bg-orange-500 text-white' : 'bg-white text-gray-800'}`}>
          <Star size={14} fill="currentColor" className="text-yellow-400" />{Number(dest.score || 0)}% match
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-4 text-white">
          <div>
            <h3 className="text-2xl font-extrabold">{dest.name}</h3>
            <p className="flex items-center gap-1 text-sm text-gray-200"><MapPin size={13} />{dest.state || 'India'}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${dest.affordable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {dest.affordable ? 'Affordable' : 'Check budget'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-5 pt-4">
        {tags.map((tag, i) => <span key={`${tag}-${i}`} className={`rounded-full px-3 py-1 text-xs font-semibold ${tagColors[i % tagColors.length]}`}><Tag size={11} className="mr-1 inline" />{tag}</span>)}
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-4">
        {[
          ['Average / person', `₹${formatMoney(dest.costPerPerson)}`],
          ['Group total', `₹${formatMoney(dest.totalCost)}`],
          ['Stay + activities / day', `₹${formatMoney(dest.costPerDay)}`],
          ['Group transport', `₹${formatMoney(dest.totalTransportCost)}`],
        ].map(([label, value], i) => (
          <div key={label} className={`rounded-xl p-3 text-center ${i === 3 ? 'border border-blue-100 bg-blue-50' : 'bg-gray-50'}`}>
            <p className="mb-1 text-xs text-gray-500">{label}</p>
            <p className="text-sm font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {dest.bestFor && <p className="px-5 pb-3 text-sm italic text-gray-500">{dest.bestFor}</p>}

      <button onClick={() => setExpanded(!expanded)} className="flex w-full items-center justify-center gap-2 border-t border-gray-100 px-5 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50">
        {expanded ? 'Show less' : 'Explore details, itinerary & more'}
        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {expanded && (
        <div className="space-y-4 px-5 pb-5">
          <MemberCostBreakdown dest={dest} />
          <WhyMatch dest={dest} avgBudget={avgBudget} />
          <ItinerarySection destName={dest.name} tripDays={tripDays || dest.tripDays} />

          <div>
            <h4 className="mb-3 flex items-center gap-2 font-bold text-gray-900"><Sunrise size={16} className="text-orange-500" /> Highlights</h4>
            {highlights.length ? <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{highlights.map((item, i) => <p key={`${item}-${i}`} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 size={14} className="shrink-0 text-green-500" />{item}</p>)}</div> : <p className="text-sm text-gray-500">No highlights available.</p>}
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 font-bold text-gray-900"><Hotel size={16} className="text-blue-500" /> Hotel suggestions</h4>
            {hotels.length ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{hotels.map((hotel, i) => <div key={`${hotel.name}-${i}`} className="overflow-hidden rounded-2xl border border-gray-100"><img src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'} alt={hotel.name || 'Hotel'} className="h-32 w-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'; }} /><div className="p-3"><p className="text-sm font-semibold text-gray-900">{hotel.name}</p><p className="mt-1 text-sm font-bold text-blue-600">₹{formatMoney(hotel.price)}<span className="text-xs font-normal text-gray-400"> /night</span></p></div></div>)}</div> : <p className="text-sm text-gray-500">No hotel suggestions available.</p>}
          </div>

          <NearbySection destName={dest.name} />
        </div>
      )}
    </article>
  );
};

const ResultsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const fetchDestinations = useCallback(async () => {
    try {
      const { data: response } = await api.get(`/groups/${id}/destinations`);
      setData(response);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load destinations.');
      setData(null);
    }
  }, [id]);

  useEffect(() => {
    let active = true;
    const init = async () => {
      setLoading(true);
      try {
        const { data: response } = await api.get(`/groups/${id}/destinations`);
        if (active) setData(response);
      } catch (err) {
        if (active) {
          toast.error(err.response?.data?.message || 'Failed to load destinations.');
          setData(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    init();
    return () => { active = false; };
  }, [id]);

  const handleAIRecommendations = async () => {
    if (!preferences.trim()) {
      toast.error('Tell us what your group enjoys first.');
      return;
    }
    if (!data) {
      toast.error('Group data is not available yet.');
      return;
    }

    try {
      setAiLoading(true);
      setAiRecommendations('');

      const { data: result } = await api.post('/ai/recommend', {
        budget: data.avgBudget,
        tripDays: data.tripDays,
        cities: data.members?.map((member) => member.city) || [],
        members: data.members?.map((member) => ({
          name: member.name,
          city: member.city,
          budget: member.budget,
          travelMode: member.travelMode,
        })) || [],
        preferences: preferences.trim(),
      });

      if (!result?.success || !result?.recommendations) {
        throw new Error(result?.message || 'No recommendations were returned.');
      }

      setAiRecommendations(result.recommendations);
      toast.success('Your AI trip ideas are ready!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not generate AI recommendations.');
    } finally {
      setAiLoading(false);
    }
  };

  const copyRecommendations = async () => {
    try {
      await navigator.clipboard.writeText(aiRecommendations);
      toast.success('Recommendations copied!');
    } catch {
      toast.error('Could not copy automatically. Please select and copy the text.');
    }
  };

  if (loading) return <PageLoader />;

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-5">
        <div className="text-center">
          <p className="mb-4 text-lg text-gray-500">Could not load destinations.</p>
          <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const destinations = Array.isArray(data.destinations) ? data.destinations : [];
  const memberCount = data.memberCount ?? data.members?.length ?? 0;
  const topDest = destinations[0]?.name || 'Not available';

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 animate-fade-in sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link to={`/group/${id}/members`} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900">
          <ArrowLeft size={16} /> Back to Members
        </Link>

        <div className="mb-8 flex items-center gap-3">
          {['Create Group', 'Add Members', 'Find Destinations'].map((step, i) => (
            <div key={step} className="flex flex-1 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{i + 1}</div>
              <span className="hidden text-sm font-medium text-blue-600 sm:block">{step}</span>
              {i < 2 && <div className="h-0.5 flex-1 bg-blue-300" />}
            </div>
          ))}
        </div>

        <section className="mb-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-100"><Compass size={16} /> YOUR NEXT ADVENTURE STARTS HERE</p>
          <h1 className="mb-2 text-2xl font-extrabold sm:text-3xl">Trip results — {data.groupName}</h1>
          <p className="mb-6 text-sm text-blue-100">Personalised ideas for {memberCount} member{memberCount !== 1 ? 's' : ''} over {data.tripDays} day{Number(data.tripDays) !== 1 ? 's' : ''}.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur-sm"><Users size={20} className="mx-auto mb-2 text-blue-100" /><p className="text-2xl font-bold">{memberCount}</p><p className="text-xs text-blue-100">Group members</p></div>
            <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur-sm"><Wallet size={20} className="mx-auto mb-2 text-blue-100" /><p className="text-2xl font-bold">₹{formatMoney(data.avgBudget)}</p><p className="text-xs text-blue-100">Average budget/person</p></div>
            <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur-sm"><Calendar size={20} className="mx-auto mb-2 text-blue-100" /><p className="text-2xl font-bold">{data.tripDays}</p><p className="text-xs text-blue-100">Trip days</p></div>
          </div>
        </section>

        <div className="mb-8">
          <ShareButton groupName={data.groupName} memberCount={memberCount} tripDays={data.tripDays} avgBudget={data.avgBudget} topDest={topDest} />
        </div>

        <section className="mb-8 overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 p-5 text-white sm:p-6">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-100"><Sparkles size={17} /> SMART TRIP PLANNER</p>
            <h2 className="text-2xl font-extrabold">Let AI inspire your next trip</h2>
            <p className="mt-2 text-sm text-purple-100">Explore destinations based on your group's budgets, starting cities, travel modes and interests.</p>
          </div>

          <div className="p-5 sm:p-6">
            <label htmlFor="trip-preferences" className="mb-2 block text-sm font-bold text-gray-800">What does your group enjoy?</label>
            <textarea
              id="trip-preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="For example: mountains, cafes, nature, adventure, nightlife..."
              rows={3}
              maxLength={500}
              disabled={aiLoading}
              className="mb-2 w-full resize-y rounded-xl border border-gray-200 p-4 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50"
            />
            <div className="mb-4 flex items-center justify-between gap-3 text-xs text-gray-400">
              <span>Describe the kind of experience your group wants.</span>
              <span>{preferences.length}/500</span>
            </div>

            <button onClick={handleAIRecommendations} disabled={aiLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
              {aiLoading ? <><RefreshCw size={17} className="animate-spin" /> Finding destinations...</> : <><Sparkles size={17} /> Generate AI recommendations</>}
            </button>

            {aiLoading && (
              <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700"><Sparkles size={20} /></div>
                  <div><p className="font-semibold text-purple-900">Planning your group trip</p><p className="text-sm text-purple-700">Comparing your preferences and member details...</p></div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-purple-100"><div className="h-full w-1/2 animate-pulse rounded-full bg-purple-500" /></div>
                <p className="mt-3 text-xs text-purple-700">This can take a few seconds. Keep this page open.</p>
              </div>
            )}
            
{aiRecommendations && (
  <div className="mt-6 overflow-hidden rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-indigo-50 shadow-lg">
    {/* Header */}
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 px-5 py-5 sm:px-7">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
          ✨ AI TRIP PLANNER
        </div>
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Recommended for your group
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Discover destinations picked around your group's preferences.
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(aiRecommendations);
          toast.success('Recommendations copied!');
        }}
        className="rounded-xl border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
      >
        Copy results
      </button>
    </div>

    {/* Destination cards */}
    <div className="grid grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-2">
      {parseAIRecommendations(aiRecommendations).length > 0 ? (
        parseAIRecommendations(aiRecommendations).map((destination, index) => (
          <div
            key={`${destination.title}-${index}`}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative h-52 overflow-hidden bg-purple-100">
              <img
                src={destination.image}
                alt={destination.title}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-purple-700">
                  OPTION {index + 1}
                </span>
                <h3 className="mt-2 text-2xl font-bold text-white">
                  {destination.title}
                </h3>
              </div>
            </div>

            <div className="space-y-4 p-5">
              {destination.why && (
                <div>
                  <h4 className="mb-1 flex items-center gap-2 text-sm font-bold text-gray-900">
                    <span>💜</span> Why your group may love it
                  </h4>
                  <p className="whitespace-pre-line text-sm leading-6 text-gray-600">
                    {destination.why}
                  </p>
                </div>
              )}

              {destination.activities && (
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900">
                    <span>🧭</span> Things to do
                  </h4>
                  <div className="whitespace-pre-line rounded-xl bg-purple-50 p-3 text-sm leading-6 text-gray-700">
                    {destination.activities}
                  </div>
                </div>
              )}

             
<details className="group border-t border-gray-100 pt-3">
  <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-purple-50">
    See trip details
    <span className="text-purple-600 transition group-open:rotate-45">＋</span>
  </summary>

  <div className="mt-4 space-y-4">
    {/* Accommodation and food */}
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-blue-50 p-3">
        <p className="text-xs text-blue-600">Accommodation / person</p>
        <p className="mt-1 font-bold text-gray-900">
          {destination.details.match(/Accommodation per person:\s*(₹[\d,]+)/i)?.[1] || 'See details'}
        </p>
      </div>

      <div className="rounded-xl bg-emerald-50 p-3">
        <p className="text-xs text-emerald-600">Food & activities / person</p>
        <p className="mt-1 font-bold text-gray-900">
          {destination.details.match(/Food and activities per person:\s*(₹[\d,]+)/i)?.[1] || 'See details'}
        </p>
      </div>
    </div>

    {/* Member budgets and remaining details */}
  
<div className="rounded-xl border border-gray-100 p-4">
  <h4 className="mb-3 text-sm font-bold text-gray-900">
    Group budget breakdown
  </h4>

  {(() => {
  const breakdown =
    destination.details.match(
      /Member-wise budget breakdown\s*:\s*([\s\S]*?)(?=Things to consider\s*:|$)/i
    )?.[1] || '';

  const normalized = breakdown
    .replace(/\\r\\n|\\n|\\r/g, '\n')
    .replace(/\\(?=\s|[A-Za-z])/g, '\n')
    .replace(/\r/g, '')
    .replace(/\*\*/g, '')
    .trim();

  const blocks = normalized
    .split(
      /(?=^[ \t]*[^\n:]+?\s*\([^()\n]+\)\s*$)/m
    )
    .map((block) => block.trim())
    .filter(Boolean);

  const members = blocks
    .map((block) => {
      const header = block.match(
        /^(.+?)\s*\(([^)\n]+)\)/m
      );

      const getAmount = (label) => {
        const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const match = block.match(
          new RegExp(
            `${escapedLabel}\\s*:\\s*(?:₹\\s*)?([\\d,]+)`,
            'i'
          )
        );
        return match ? match[1].replace(/,/g, '') : '';
      };

      const status =
        block.match(/Status\s*:\s*([^\n]+)/i)?.[1]?.trim() || '';

      const transport = getAmount('Transport');
      const stay = getAmount('Accommodation');
      const food = getAmount('Food and activities');
      const total = getAmount('Total');
      const budget = getAmount('Individual budget');

      if (
        !header ||
        !transport ||
        !stay ||
        !food ||
        !total ||
        !budget
      ) {
        return null;
      }

      return {
        name: header[1].trim(),
        travelInfo: header[2].trim(),
        transport,
        stay,
        food,
        total,
        budget,
        status,
      };
    })
    .filter(Boolean);

  if (!members.length) {
    return (
      <div className="text-sm text-gray-500">
        The AI response format could not be recognised. Please generate recommendations again.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member, index) => (
        <div
          key={`${member.name}-${index}`}
          className="rounded-xl border border-gray-200 bg-white p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h5 className="font-semibold text-gray-900">
                {member.name}
              </h5>
              <p className="mt-1 text-xs text-gray-500">
                {member.travelInfo}
              </p>
            </div>
            <p className="text-lg font-bold text-purple-700">
              ₹{formatMoney(member.total)}
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between gap-3">
              <span>Transport</span>
              <span>₹{formatMoney(member.transport)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Accommodation</span>
              <span>₹{formatMoney(member.stay)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Food & activities</span>
              <span>₹{formatMoney(member.food)}</span>
            </div>
            <div className="flex justify-between gap-3 border-t border-gray-100 pt-2">
              <span>Personal budget</span>
              <span>₹{formatMoney(member.budget)}</span>
            </div>
          </div>

          {member.status && (
            <p
              className={`mt-3 text-xs font-semibold ${
                /over budget|exceed/i.test(member.status)
                  ? 'text-red-600'
                  : 'text-green-700'
              }`}
            >
              {member.status}
            </p>
          )}
        </div>
      ))}
    </div>
  );
})()}
</div>


    {/* Travel considerations */}
    {destination.details.match(/Things to consider:\s*([\s\S]*)/i)?.[1] && (
      <div className="rounded-xl bg-amber-50 p-4">
        <h4 className="mb-2 text-sm font-bold text-amber-800">
          Before you go
        </h4>
        <p className="text-sm leading-6 text-amber-900">
          {destination.details.match(/Things to consider:\s*([\s\S]*)/i)?.[1]?.trim()}
        </p>
      </div>
    )}
  </div>
</details>

            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full rounded-2xl bg-white p-5">
          <p className="mb-3 text-sm text-gray-500">
            Your AI recommendations are ready. Here's the complete response:
          </p>
          <ReactMarkdown>
            {aiRecommendations.replace(/\\([*])/g, '$1')}
          </ReactMarkdown>
        </div>
      )}
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-purple-100 px-5 py-4 sm:px-7">
      <p className="text-xs text-gray-500">
        AI-generated suggestions — verify prices and travel details before booking.
      </p>
      <button
        type="button"
        onClick={handleAIRecommendations}
        disabled={aiLoading}
        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {aiLoading ? 'Generating...' : 'Generate another version'}
      </button>
    </div>
  </div>
)}

          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-600">Picked for your group</p>
              <h2 className="text-2xl font-extrabold text-gray-900">Ranked destinations</h2>
            </div>
            <p className="text-sm text-gray-500">{destinations.length} destination{destinations.length !== 1 ? 's' : ''} to explore</p>
          </div>

          {destinations.length ? (
            <div className="space-y-6">
              {destinations.map((dest, i) => <DestinationCard key={dest._id || dest.name || i} dest={dest} rank={i} avgBudget={data.avgBudget} tripDays={data.tripDays} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center">
              <MapPin size={28} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600">No destinations were returned for this group.</p>
              <button onClick={fetchDestinations} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"><RefreshCw size={15} /> Try again</button>
            </div>
          )}
        </section>

        <footer className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to={`/group/${id}/members`} className="btn-secondary flex-1 text-center text-sm">← Edit members</Link>
          <Link to="/create-group" className="btn-primary flex-1 text-center text-sm">Plan another trip 🚀</Link>
        </footer>

        <p className="mt-6 text-center text-xs text-gray-400">TripSync helps your group plan together. Confirm important travel details before making bookings.</p>
      </div>
    </main>
  );
};

export default ResultsPage;
