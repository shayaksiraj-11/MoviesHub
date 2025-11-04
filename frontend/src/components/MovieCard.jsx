import { useNavigate } from 'react-router-dom';
import { Play, Plus } from 'lucide-react';
import { useState } from 'react';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-48 cursor-pointer group relative"
      onClick={() => navigate(`/movie/${movie.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`movie-card-${movie.id}`}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-4 animate-fade-in">
            <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{movie.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
              <span>{movie.releaseYear}</span>
              <span>•</span>
              <span>{movie.runtime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/movie/${movie.id}`);
                }}
                data-testid={`movie-card-play-${movie.id}`}
              >
                <Play className="w-4 h-4 text-black fill-black" />
              </button>
              <button
                className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center hover:bg-white/20"
                onClick={(e) => e.stopPropagation()}
                data-testid={`movie-card-add-${movie.id}`}
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 px-1">
        <h3 className="text-white font-medium text-sm line-clamp-1">{movie.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <span>{movie.releaseYear}</span>
          {movie.genres.length > 0 && (
            <>
              <span>•</span>
              <span className="line-clamp-1">{movie.genres[0]}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}