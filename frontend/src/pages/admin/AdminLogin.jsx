import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Film, Lock } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast.error('Please enter admin token');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/admin/validate-token`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.valid) {
        localStorage.setItem('adminToken', token);
        toast.success('Login successful!');
        navigate('/admin');
      } else {
        toast.error('Invalid admin token');
      }
    } catch (error) {
      toast.error('Invalid admin token');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-[#e50914] p-4 rounded-full">
              <Film className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="heading-font text-4xl font-bold text-center mb-2 text-white">Admin Panel</h1>
          <p className="text-center text-gray-400 mb-8">Enter your admin token to continue</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Token</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="password"
                  placeholder="Enter your admin token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="pl-10 h-12 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  data-testid="admin-token-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#e50914] hover:bg-[#b8070f] text-white font-semibold rounded-lg"
              data-testid="admin-login-button"
            >
              {loading ? 'Validating...' : 'Login to Admin Panel'}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              <span className="font-semibold text-gray-300">Default Token:</span> admin_secret_token_12345
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white text-sm"
            data-testid="back-to-home"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}