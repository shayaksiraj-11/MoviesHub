import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    genres: [],
    cast: '',
    releaseYear: new Date().getFullYear(),
    runtime: 0,
    posterUrl: '',
    videoUrl: '',
    language: 'English',
    subtitles: []
  });

  useEffect(() => {
    loadMovies();
    loadGenres();
  }, []);

  const loadMovies = async () => {
    try {
      const response = await axios.get(`${API}/movies?limit=100`);
      setMovies(response.data);
    } catch (error) {
      toast.error('Failed to load movies');
    }
  };

  const loadGenres = async () => {
    try {
      const response = await axios.get(`${API}/genres`);
      setGenres(response.data);
    } catch (error) {
      toast.error('Failed to load genres');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('adminToken');
    const data = {
      ...formData,
      cast: formData.cast.split(',').map(c => c.trim()),
      runtime: parseInt(formData.runtime),
      releaseYear: parseInt(formData.releaseYear)
    };

    try {
      if (editingMovie) {
        await axios.put(`${API}/admin/movies/${editingMovie.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Movie updated successfully');
      } else {
        await axios.post(`${API}/admin/movies`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Movie created successfully');
      }
      
      setDialogOpen(false);
      resetForm();
      loadMovies();
    } catch (error) {
      toast.error('Failed to save movie');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${API}/admin/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Movie deleted successfully');
      loadMovies();
    } catch (error) {
      toast.error('Failed to delete movie');
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      synopsis: movie.synopsis,
      genres: movie.genres,
      cast: movie.cast.join(', '),
      releaseYear: movie.releaseYear,
      runtime: movie.runtime,
      posterUrl: movie.posterUrl,
      videoUrl: movie.videoUrl,
      language: movie.language,
      subtitles: movie.subtitles
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      synopsis: '',
      genres: [],
      cast: '',
      releaseYear: new Date().getFullYear(),
      runtime: 0,
      posterUrl: '',
      videoUrl: '',
      language: 'English',
      subtitles: []
    });
  };

  const toggleGenre = (genreName) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genreName)
        ? prev.genres.filter(g => g !== genreName)
        : [...prev.genres, genreName]
    }));
  };

  return (
    <div className="space-y-6" data-testid="admin-movies-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Movies</h1>
          <p className="text-gray-400">Manage your movie collection</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-[#e50914] hover:bg-[#b8070f]" data-testid="add-movie-button">
              <Plus className="w-5 h-5 mr-2" />
              Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl">{editingMovie ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                  data-testid="movie-title-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Synopsis *</label>
                <Textarea
                  required
                  value={formData.synopsis}
                  onChange={(e) => setFormData({...formData, synopsis: e.target.value})}
                  className="bg-gray-800 border-gray-700 min-h-24"
                  data-testid="movie-synopsis-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Genres *</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      type="button"
                      onClick={() => toggleGenre(genre.name)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.genres.includes(genre.name)
                          ? 'bg-[#e50914] text-white'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                      data-testid={`genre-toggle-${genre.slug}`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cast (comma separated) *</label>
                <Input
                  required
                  value={formData.cast}
                  onChange={(e) => setFormData({...formData, cast: e.target.value})}
                  placeholder="Actor 1, Actor 2, Actor 3"
                  className="bg-gray-800 border-gray-700"
                  data-testid="movie-cast-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Release Year *</label>
                  <Input
                    required
                    type="number"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({...formData, releaseYear: e.target.value})}
                    className="bg-gray-800 border-gray-700"
                    data-testid="movie-year-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Runtime (minutes) *</label>
                  <Input
                    required
                    type="number"
                    value={formData.runtime}
                    onChange={(e) => setFormData({...formData, runtime: e.target.value})}
                    className="bg-gray-800 border-gray-700"
                    data-testid="movie-runtime-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Poster URL *</label>
                <Input
                  required
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
                  placeholder="https://example.com/poster.jpg"
                  className="bg-gray-800 border-gray-700"
                  data-testid="movie-poster-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Video URL *</label>
                <Input
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                  placeholder="https://example.com/video.mp4"
                  className="bg-gray-800 border-gray-700"
                  data-testid="movie-video-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <Input
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                  data-testid="movie-language-input"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-[#e50914] hover:bg-[#b8070f]" data-testid="save-movie-button">
                  {editingMovie ? 'Update Movie' : 'Create Movie'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }} className="border-gray-700">
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Movies table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-left p-4 text-gray-400 font-medium">Poster</th>
                <th className="text-left p-4 text-gray-400 font-medium">Title</th>
                <th className="text-left p-4 text-gray-400 font-medium">Year</th>
                <th className="text-left p-4 text-gray-400 font-medium">Runtime</th>
                <th className="text-left p-4 text-gray-400 font-medium">Views</th>
                <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id} className="border-t border-gray-700 hover:bg-gray-700" data-testid={`movie-row-${movie.id}`}>
                  <td className="p-4">
                    <img src={movie.posterUrl} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                  </td>
                  <td className="p-4 text-white font-medium">{movie.title}</td>
                  <td className="p-4 text-gray-400">{movie.releaseYear}</td>
                  <td className="p-4 text-gray-400">{movie.runtime} min</td>
                  <td className="p-4 text-gray-400">{movie.viewCount}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(movie)}
                        className="border-gray-700"
                        data-testid={`edit-movie-${movie.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(movie.id)}
                        className="border-red-700 text-red-500 hover:bg-red-900"
                        data-testid={`delete-movie-${movie.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}