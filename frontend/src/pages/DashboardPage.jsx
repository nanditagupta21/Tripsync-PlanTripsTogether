import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { PageLoader } from '../components/Spinner';
import {
  Plus, Trash2, Users, Calendar, IndianRupee, ArrowRight, MapPin, Inbox
} from 'lucide-react';

const statusColors = {
  planning: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
};

const GroupCard = ({ group, onDelete }) => {
  const navigate = useNavigate();
  const startDate = new Date(group.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const endDate = new Date(group.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="card hover:shadow-md transition-all hover:-translate-y-0.5 group animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-lg truncate">{group.groupName}</h3>
            <span className={`badge text-xs ${statusColors[group.status]}`}>{group.status}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Calendar size={14} />
            <span>{startDate} → {endDate}</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(group._id)}
          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all ml-2 opacity-0 group-hover:opacity-100"
          title="Delete group"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Users size={15} className="text-blue-500" />
          <span><strong>{group.memberCount}</strong> members</span>
        </div>
        {group.avgBudget > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <IndianRupee size={15} className="text-green-500" />
            <span>Avg ₹<strong>{group.avgBudget.toLocaleString('en-IN')}</strong></span>
          </div>
        )}
        {group.maxBudget && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <span>Max ₹<strong>{Number(group.maxBudget).toLocaleString('en-IN')}</strong></span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/group/${group._id}/members`)}
          className="flex-1 btn-secondary text-sm py-2.5"
        >
          <Users size={15} className="inline mr-1.5" /> Add Members
        </button>
        {group.memberCount > 0 && (
          <button
            onClick={() => navigate(`/group/${group._id}/results`)}
            className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-1.5"
          >
            <MapPin size={15} /> Find Destinations
          </button>
        )}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const { data } = await api.get('/groups');
      setGroups(data.groups);
    } catch {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroups(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this group? This cannot be undone.')) return;
    try {
      await api.delete(`/groups/${id}`);
      setGroups((prev) => prev.filter((g) => g._id !== id));
      toast.success('Group deleted');
    } catch {
      toast.error('Failed to delete group');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Trips 🗺️
            </h1>
            <p className="text-gray-500 mt-1">Welcome back, <span className="font-semibold text-gray-700">{user?.name}</span>!</p>
          </div>
          <Link to="/create-group" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            <Plus size={18} /> New Trip
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Trips', value: groups.length, icon: <MapPin size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
            { label: 'Planning', value: groups.filter(g => g.status === 'planning').length, icon: <Calendar size={20} className="text-orange-500" />, bg: 'bg-orange-50' },
            { label: 'Total Members', value: groups.reduce((s, g) => s + g.memberCount, 0), icon: <Users size={20} className="text-green-500" />, bg: 'bg-green-50' },
            { label: 'Avg Budget', value: groups.length ? `₹${Math.round(groups.reduce((s,g)=>s+g.avgBudget,0)/groups.length).toLocaleString('en-IN')}` : '—', icon: <IndianRupee size={20} className="text-purple-500" />, bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <div key={i} className="card flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Groups Grid */}
        {groups.length === 0 ? (
          <div className="card text-center py-20">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox size={36} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Create your first group trip and start finding the perfect destination for everyone!</p>
            <Link to="/create-group" className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} /> Plan Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupCard key={group._id} group={group} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
