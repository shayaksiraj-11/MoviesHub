import { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, LayoutDashboard, Video, Tag, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-black" data-testid="admin-layout">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-[#e50914] p-2 rounded">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="heading-font text-2xl font-bold text-white block">ADMIN</span>
              <span className="text-xs text-gray-400">MovieStream</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/admin') && location.pathname === '/admin'
                ? 'bg-[#e50914] text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            data-testid="admin-nav-dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/admin/movies"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/admin/movies')
                ? 'bg-[#e50914] text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            data-testid="admin-nav-movies"
          >
            <Video className="w-5 h-5" />
            <span className="font-medium">Movies</span>
          </Link>

          <Link
            to="/admin/genres"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/admin/genres')
                ? 'bg-[#e50914] text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            data-testid="admin-nav-genres"
          >
            <Tag className="w-5 h-5" />
            <span className="font-medium">Genres</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
            data-testid="admin-logout-button"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
}