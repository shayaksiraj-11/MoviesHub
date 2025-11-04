import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
      data-testid="navbar"
    >
      <div className="px-8 md:px-16 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="home-link">
            <div className="bg-[#e50914] p-2 rounded group-hover:scale-110 transition-transform">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="heading-font text-3xl font-bold text-white">MOVIESTREAM</span>
          </Link>

          {/* Search and Admin */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 bg-gray-900/50 border border-gray-700 rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e50914]"
                  data-testid="navbar-search-input"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </form>

            <Button
              onClick={() => navigate('/admin/login')}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
              data-testid="admin-link"
            >
              Admin
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}