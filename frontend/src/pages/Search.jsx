import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [searchParams]);

  const loadGenres = async () => {
    try {
      const response = await axios.get(`${API}/genres`);
      setGenres(response.data);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      if (selectedGenre) params.append('genre', selectedGenre);
      if (selectedYear) params.append('year', selectedYear);

      const response = await axios.get(`${API}/movies/search/query?${params.toString()}`);
      setMovies(response.data);
    } catch (error) {
      console.error('Error searching movies:', error);
      setMovies([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const params = new URLSearchParams();
    params.append('q', query);
    if (selectedGenre) params.append('genre', selectedGenre);
    if (selectedYear) params.append('year', selectedYear);
    
    setSearchParams(params);
  };

  const handleGenreChange = (value) => {
    const genre = value === 'all' ? '' : value;
    setSelectedGenre(genre);
    if (query) {
      const params = new URLSearchParams();
      params.append('q', query);
      if (genre) params.append('genre', genre);
      if (selectedYear) params.append('year', selectedYear);
      setSearchParams(params);
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => 2024 - i);

  return (
    <div className="min-h-screen bg-black" data-testid="search-page">
      <Navbar />

      <div className="pt-24 px-8 md:px-16 max-w-7xl mx-auto pb-16">
        <h1 className="heading-font text-5xl md:text-6xl font-bold mb-8 text-white">Search Movies</h1>

        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Search for movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 h-12 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              data-testid="search-input"
            />
            
            <Select value={selectedGenre || "all"} onValueChange={handleGenreChange}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-gray-900 border-gray-700 text-white" data-testid="genre-filter">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.name}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              type="submit"
              className="h-12 px-8 bg-[#e50914] hover:bg-[#b8070f] text-white font-semibold rounded-md"
              data-testid="search-button"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#e50914]" />
          </div>
        ) : movies.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-white">
              Found {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        ) : query ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No movies found matching your search.</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Enter a search term to find movies.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}