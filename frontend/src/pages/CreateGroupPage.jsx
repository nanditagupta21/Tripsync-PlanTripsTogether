import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Calendar, Users, IndianRupee, ArrowLeft, ArrowRight } from 'lucide-react';

const CreateGroupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    groupName: '',
    startDate: '',
    endDate: '',
    maxBudget: '',
  });

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error('End date must be after start date');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/groups', {
        groupName: form.groupName,
        startDate: form.startDate,
        endDate: form.endDate,
        maxBudget: form.maxBudget ? Number(form.maxBudget) : null,
      });
      toast.success('Group created! Now add your members.');
      navigate(`/group/${data.group._id}/members`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            {['Create Group', 'Add Members', 'Find Destinations'].map((step, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i === 0 ? 'text-blue-600' : 'text-gray-400'}`}>{step}</span>
                {i < 2 && <div className={`flex-1 h-0.5 ${i === 0 ? 'bg-blue-200' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create Your Trip Group</h1>
              <p className="text-gray-500 mt-1">Set the basics — name, dates, and optional budget cap.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Group Name */}
              <div>
                <label className="label">Group Name *</label>
                <div className="relative">
                  <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="input-field pl-11"
                    placeholder="Summer Getaway 2026 🏖️"
                    value={form.groupName}
                    onChange={(e) => setForm({ ...form, groupName: e.target.value })}
                    required
                    maxLength={50}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <Calendar size={15} /> Start Date *
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    min={today}
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label flex items-center gap-2">
                    <Calendar size={15} /> End Date *
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    min={form.startDate || today}
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Trip duration hint */}
              {form.startDate && form.endDate && new Date(form.endDate) >= new Date(form.startDate) && (
                <div className="bg-blue-50 text-blue-700 rounded-xl px-4 py-3 text-sm font-medium">
                  📅 Trip duration:{' '}
                  <strong>
                    {Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24))} day(s)
                  </strong>
                </div>
              )}

              {/* Max Budget (optional) */}
              <div>
                <label className="label flex items-center gap-2">
                  <IndianRupee size={15} /> Max Budget per Person
                  <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                  <input
                    type="number"
                    className="input-field pl-8"
                    placeholder="e.g. 15000"
                    min="0"
                    value={form.maxBudget}
                    onChange={(e) => setForm({ ...form, maxBudget: e.target.value })}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Leave blank to let the group decide based on members' budgets.</p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full text-base flex items-center justify-center gap-2 mt-2">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>Create Group & Add Members <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;
