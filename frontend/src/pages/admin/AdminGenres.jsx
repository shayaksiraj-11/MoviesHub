import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminGenres() {
  const [genres, setGenres] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  useEffect(() => {
    loadGenres();
  }, []);

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
    try {
      await axios.post(`${API}/admin/genres`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Genre created successfully');
      setDialogOpen(false);
      setFormData({ name: '', slug: '' });
      loadGenres();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create genre');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this genre?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${API}/admin/genres/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Genre deleted successfully');
      loadGenres();
    } catch (error) {
      toast.error('Failed to delete genre');
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleNameChange = (name) => {
    setFormData({
      name,
      slug: generateSlug(name)
    });
  };

  return (
    <div className="space-y-6" data-testid="admin-genres-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Genres</h1>
          <p className="text-gray-400">Manage movie categories</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#e50914] hover:bg-[#b8070f]" data-testid="add-genre-button">
              <Plus className="w-5 h-5 mr-2" />
              Add Genre
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl">Add New Genre</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Action, Drama, Comedy"
                  className="bg-gray-800 border-gray-700"
                  data-testid="genre-name-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <Input
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="e.g. action, drama, comedy"
                  className="bg-gray-800 border-gray-700"
                  data-testid="genre-slug-input"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated from name, but you can customize it</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-[#e50914] hover:bg-[#b8070f]" data-testid="save-genre-button">
                  Create Genre
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-gray-700">
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Genres grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {genres.map((genre) => (
          <div 
            key={genre.id}
            className="bg-gray-800 rounded-xl p-6 flex items-center justify-between hover:bg-gray-700 transition-colors"
            data-testid={`genre-card-${genre.slug}`}
          >
            <div>
              <h3 className="text-xl font-bold text-white">{genre.name}</h3>
              <p className="text-sm text-gray-400">{genre.slug}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(genre.id)}
              className="border-red-700 text-red-500 hover:bg-red-900"
              data-testid={`delete-genre-${genre.slug}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}