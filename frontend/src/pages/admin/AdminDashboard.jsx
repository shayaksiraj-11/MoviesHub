import { useEffect, useState } from 'react';
import axios from 'axios';
import { Film, Eye, Tag, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load stats');
    }
    setLoading(false);
  };

  if (loading || !stats) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-8" data-testid="admin-dashboard">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your streaming platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white" data-testid="total-movies-card">
          <div className="flex items-center justify-between mb-4">
            <Film className="w-10 h-10 opacity-80" />
            <span className="text-3xl font-bold" data-testid="total-movies">{stats.totalMovies}</span>
          </div>
          <h3 className="text-lg font-semibold">Total Movies</h3>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white" data-testid="total-views-card">
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-10 h-10 opacity-80" />
            <span className="text-3xl font-bold" data-testid="total-views">{stats.totalViews.toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-semibold">Total Views</h3>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white" data-testid="total-genres-card">
          <div className="flex items-center justify-between mb-4">
            <Tag className="w-10 h-10 opacity-80" />
            <span className="text-3xl font-bold" data-testid="total-genres">{stats.totalGenres}</span>
          </div>
          <h3 className="text-lg font-semibold">Total Genres</h3>
        </div>
      </div>

      {/* Top Movies */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-[#e50914]" />
          <h2 className="text-2xl font-bold text-white">Top 10 Movies by Views</h2>
        </div>

        <div className="space-y-3">
          {stats.topMovies.map((movie, index) => (
            <div 
              key={movie.id}
              className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg hover:bg-gray-700 transition-colors"
              data-testid={`top-movie-${index}`}
            >
              <span className="text-2xl font-bold text-gray-600 w-8">{index + 1}</span>
              <img 
                src={movie.posterUrl} 
                alt={movie.title}
                className="w-16 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-white font-semibold">{movie.title}</h3>
                <p className="text-gray-400 text-sm">{movie.viewCount.toLocaleString()} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}