import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, Plus, ThumbsUp, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    loadMovie();
    checkWatchlist();
  }, [id]);

  const loadMovie = async () => {
    try {
      const response = await axios.get(`${API}/movies/${id}`);
      setMovie(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading movie:', error);
      toast.error('Movie not found');
      navigate('/');
    }
  };

  const checkWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setInWatchlist(watchlist.includes(id));
  };

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    if (inWatchlist) {
      const updated = watchlist.filter(movieId => movieId !== id);
      localStorage.setItem('watchlist', JSON.stringify(updated));
      setInWatchlist(false);
      toast.success('Removed from watchlist');
    } else {
      watchlist.push(id);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      setInWatchlist(true);
      toast.success('Added to watchlist');
    }
  };

  const handlePlay = async () => {
    // Increment view count
    try {
      await axios.post(`${API}/movies/${id}/increment-view`);
    } catch (error) {
      console.error('Error incrementing view:', error);
    }

    // Add to watch history
    const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    const entry = { movieId: id, timestamp: new Date().toISOString() };
    const filtered = history.filter(h => h.movieId !== id);
    filtered.unshift(entry);
    localStorage.setItem('watchHistory', JSON.stringify(filtered.slice(0, 50)));

    setPlaying(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-[#e50914]" data-testid="loading-spinner" />
      </div>
    );
  }

  if (!movie) return null;

  if (playing) {
    return (
      <div className="min-h-screen bg-black">
        <VideoPlayer movie={movie} onClose={() => setPlaying(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" data-testid="movie-detail-page">
      <Navbar />

      {/* Hero section with backdrop */}
      <div className="relative h-[80vh] overflow-hidden">
        {/* Background image with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.posterUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-end pb-24 px-8 md:px-16 max-w-7xl">
          <div className="space-y-6 max-w-2xl">
            <h1 
              className="heading-font text-6xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl"
              data-testid="movie-title"
            >
              {movie.title}
            </h1>

            <div className="flex items-center gap-4 text-sm md:text-base">
              <span className="text-green-500 font-semibold" data-testid="movie-year">{movie.releaseYear}</span>
              <span className="text-gray-400" data-testid="movie-runtime">{movie.runtime} min</span>
              <span className="text-gray-400" data-testid="movie-language">{movie.language}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                  data-testid={`genre-${idx}`}
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-gray-200 text-base md:text-lg leading-relaxed" data-testid="movie-synopsis">
              {movie.synopsis}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Button 
                size="lg"
                className="bg-[#e50914] hover:bg-[#b8070f] text-white px-8 h-12 text-base font-semibold rounded-md"
                onClick={handlePlay}
                data-testid="play-button"
              >
                <Play className="w-5 h-5 mr-2 fill-white" />
                Play
              </Button>

              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white h-12 px-6 rounded-md"
                onClick={toggleWatchlist}
                data-testid="watchlist-button"
              >
                {inWatchlist ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Watchlist
                  </>
                )}
              </Button>

              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white h-12 w-12 rounded-full p-0"
                data-testid="like-button"
              >
                <ThumbsUp className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="px-8 md:px-16 py-12 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">Cast</h3>
            <div className="flex flex-wrap gap-2">
              {movie.cast.map((actor, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300"
                  data-testid={`cast-${idx}`}
                >
                  {actor}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">Details</h3>
            <dl className="space-y-3 text-gray-300">
              <div>
                <dt className="text-gray-500 text-sm">Views</dt>
                <dd className="text-lg" data-testid="movie-views">{movie.viewCount.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-sm">Subtitles</dt>
                <dd data-testid="movie-subtitles">
                  {movie.subtitles.length > 0 ? movie.subtitles.join(', ') : 'None'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}