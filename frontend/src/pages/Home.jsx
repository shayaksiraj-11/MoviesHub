import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import MovieRow from '@/components/MovieRow';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredMovies, setFeaturedMovies] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [moviesRes, genresRes] = await Promise.all([
        axios.get(`${API}/movies?limit=30`),
        axios.get(`${API}/genres`)
      ]);

      setMovies(moviesRes.data);
      setGenres(genresRes.data);
      
      // Select top 5 movies for hero carousel
      const featured = moviesRes.data
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 5);
      setFeaturedMovies(featured);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const getMoviesByGenre = (genreName) => {
    return movies.filter(movie => movie.genres.includes(genreName));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-[#e50914]" data-testid="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" data-testid="home-page">
      <Navbar />
      
      <HeroCarousel movies={featuredMovies} />

      <div className="pb-16">
        {/* Trending Now */}
        <MovieRow 
          title="Trending Now" 
          movies={movies.sort((a, b) => b.viewCount - a.viewCount).slice(0, 10)}
        />

        {/* Genre rows */}
        {genres.slice(0, 6).map((genre) => {
          const genreMovies = getMoviesByGenre(genre.name);
          if (genreMovies.length === 0) return null;
          
          return (
            <MovieRow 
              key={genre.id}
              title={genre.name}
              movies={genreMovies}
            />
          );
        })}

        {/* Recently Added */}
        <MovieRow 
          title="Recently Added" 
          movies={movies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)}
        />
      </div>

      <Footer />
    </div>
  );
}