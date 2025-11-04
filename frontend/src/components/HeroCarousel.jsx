import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroCarousel({ movies }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (movies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  return (
    <div className="relative h-[85vh] overflow-hidden" data-testid="hero-carousel">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${currentMovie.posterUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end pb-32 px-8 md:px-16">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <h1 
            className="heading-font text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl"
            data-testid="hero-movie-title"
          >
            {currentMovie.title}
          </h1>

          <div className="flex items-center gap-4 text-sm md:text-base">
            <span className="text-green-500 font-semibold">{currentMovie.releaseYear}</span>
            <span className="text-gray-300">{currentMovie.runtime} min</span>
            <div className="flex gap-2">
              {currentMovie.genres.slice(0, 3).map((genre, idx) => (
                <span key={idx} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <p className="text-gray-200 text-base md:text-lg line-clamp-3 leading-relaxed">
            {currentMovie.synopsis}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200 px-8 h-12 text-base font-semibold rounded-md"
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
              data-testid="hero-play-button"
            >
              <Play className="w-5 h-5 mr-2 fill-black" />
              Play
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white h-12 px-6 rounded-md"
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
              data-testid="hero-info-button"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
        data-testid="hero-prev-button"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
        data-testid="hero-next-button"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-white w-8' : 'bg-white/40'
            }`}
            data-testid={`hero-dot-${idx}`}
          />
        ))}
      </div>
    </div>
  );
}