import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { PageLoader } from '../components/Spinner';
import { UserPlus, Trash2, MapPin, IndianRupee, ArrowRight, ArrowLeft, Users } from 'lucide-react';

const CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal',
  'Chandigarh', 'Patna', 'Vadodara', 'Kochi', 'Coimbatore',
];

const AddMembersPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
  name: '',
  city: '',
  budget: '',
  travelMode: 'train',
  });

  const fetchGroup = async () => {
    try {
      const { data } = await api.get(`/groups/${id}`);
      setGroup(data.group);
    } catch {
      toast.error('Group not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroup(); }, [id]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (Number(form.budget) <= 0) {
      toast.error('Budget must be greater than 0');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post(`/groups/${id}/members`, {
       name: form.name,
       city: form.city,
       budget: Number(form.budget),
       travelMode: form.travelMode,
      });
      setGroup(data.group);
      setForm({
       name: '',
       city: '',
       budget: '',
       travelMode: 'train',
      });
      toast.success(`${form.name} added! 🎉`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    try {
      const { data } = await api.delete(`/groups/${id}/members/${memberId}`);
      setGroup(data.group);
      toast.success(`${memberName} removed`);
    } catch {
      toast.error('Failed to remove member');
    }
  };

  if (loading) return <PageLoader />;

  const avgBudget = group.members.length
    ? Math.round(group.members.reduce((s, m) => s + m.budget, 0) / group.members.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            {['Create Group', 'Add Members', 'Find Destinations'].map((step, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${i <= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i <= 1 ? 'text-blue-600' : 'text-gray-400'}`}>{step}</span>
                {i < 2 && <div className={`flex-1 h-0.5 ${i < 1 ? 'bg-blue-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Add Member Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-fit">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Members</h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  Trip: <strong className="text-gray-700">{group.groupName}</strong>
                </p>
              </div>

              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="label">Member Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="label">Home City *</label>
                  <select
                    className="input-field"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  >
                    <option value="">Select city</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Travel Budget (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                    <input
                      type="number"
                      className="input-field pl-8"
                      placeholder="8000"
                      min="1"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      required
                    />
                  </div>
                </div>


                
<div>
  <label className="label">Travel Mode *</label>
  <select
    className="input-field"
    value={form.travelMode}
    onChange={(e) =>
      setForm({ ...form, travelMode: e.target.value })
    }
    required
  >
    <option value="train">Train</option>
    <option value="bus">Bus</option>
    <option value="road">Road Trip / Car</option>
    <option value="flight">Flight</option>
  </select>
  <p className="text-xs text-gray-500 mt-1">
    Select how this member will travel to the destination.
  </p>
</div>


                <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : <UserPlus size={18} />}
                  {submitting ? 'Adding...' : 'Add Member'}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Members List */}
          <div>
            {/* Stats */}
            {group.members.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{group.members.length}</p>
                  <p className="text-xs text-blue-600 font-medium">Members</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">₹{avgBudget.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-green-600 font-medium">Avg Budget</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users size={18} className="text-blue-500" />
                    Group Members
                  </h2>
                  <span className="badge bg-gray-100 text-gray-600">{group.members.length} added</span>
                </div>

                {group.members.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Users size={36} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No members yet. Add your first friend!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {group.members.map((member) => (
                      <div key={member._id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 group/item animate-slide-in">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">{member.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin size={11} /> {member.city}
                              <span>·</span>
                              <IndianRupee size={11} /> ₹{member.budget.toLocaleString('en-IN')}
                              <span>·</span>
                              <span className="capitalize">{member.travelMode || 'train'}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveMember(member._id, member.name)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover/item:opacity-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Find Destinations CTA */}
            {group.members.length >= 1 && (
              <button
                onClick={() => navigate(`/group/${id}/results`)}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2 text-base py-4"
              >
                <MapPin size={20} />
                Find Best Destinations
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMembersPage;
