# MovieStream - Netflix-like Movie Streaming Platform

A production-ready full-stack movie streaming web application with a working admin panel. Built with FastAPI (Python), React, and MongoDB.

## Features

### Public Features (No Authentication Required)
- **Home Page**: Hero carousel with featured movies, genre-based rows, trending movies
- **Movie Detail Page**: Comprehensive movie information with play functionality
- **Video Player**: Full-featured video player with playback progress saved locally
- **Search**: Advanced search with genre and year filters
- **Watchlist**: Local browser-based watchlist (localStorage)
- **Watch History**: Track viewing history locally
- **Responsive Design**: Fully responsive Netflix-like dark theme
- **Accessibility**: Keyboard navigation and ARIA attributes

### Admin Panel Features (Token Protected)
- **Dashboard**: Analytics overview with total movies, views, and top movies
- **Movie Management**: Full CRUD operations for movies
- **Genre Management**: Create and manage movie genres
- **Bulk Import**: CSV-based bulk movie import
- **Statistics**: View counts and performance metrics

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: Single admin token (Bearer token)
- **API**: RESTful API with automatic OpenAPI documentation

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS with custom Netflix-like theme
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

### Database
- **MongoDB**: Document-based NoSQL database
- **Collections**: movies, genres

## Project Structure

```
/app/
├── backend/
│   ├── server.py           # FastAPI application
│   ├── seed_data.py        # Database seeding script
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── MovieDetail.jsx
│   │   │   ├── Search.jsx
│   │   │   └── admin/     # Admin pages
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── HeroCarousel.jsx
│   │   │   ├── MovieRow.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ui/        # Shadcn UI components
│   │   ├── App.js         # Main app component
│   │   └── App.css        # Global styles
│   ├── package.json
│   └── .env              # Frontend environment variables
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (running locally or connection string)
- Yarn package manager

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd /app/backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables** (`.env`):
   ```env
   MONGO_URL="mongodb://localhost:27017"
   DB_NAME="moviestream_db"
   CORS_ORIGINS="*"
   ADMIN_TOKEN="admin_secret_token_12345"
   ```

4. **Seed the database** (loads 30 sample movies):
   ```bash
   python seed_data.py
   ```

5. **Run the backend server** (development):
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd /app/frontend
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Configure environment variables** (`.env`):
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

4. **Run the frontend** (development):
   ```bash
   yarn start
   ```

5. **Access the application**:
   - Public site: `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin/login`

### Using Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Seed the database
docker-compose exec backend python seed_data.py

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Admin Access

### Default Admin Token
```
admin_secret_token_12345
```

### How to Use Admin Panel

1. Navigate to `/admin/login`
2. Enter the admin token
3. Access dashboard, movies, and genres management

### Changing Admin Token

Update the `ADMIN_TOKEN` in `/app/backend/.env`:
```env
ADMIN_TOKEN="your_secure_token_here"
```

Restart the backend server for changes to take effect.

## API Documentation

### Public Endpoints

#### Get Movies
```http
GET /api/movies?skip=0&limit=20&genre=Action
```

#### Get Movie by ID
```http
GET /api/movies/{movie_id}
```

#### Search Movies
```http
GET /api/movies/search/query?q=quantum&genre=Sci-Fi&year=2023
```

#### Increment View Count
```http
POST /api/movies/{movie_id}/increment-view
```

#### Get Genres
```http
GET /api/genres
```

### Admin Endpoints (Require Authorization Header)

#### Validate Token
```http
POST /api/admin/validate-token
Authorization: Bearer admin_secret_token_12345
```

#### Create Movie
```http
POST /api/admin/movies
Authorization: Bearer admin_secret_token_12345
Content-Type: application/json

{
  "title": "Movie Title",
  "synopsis": "Movie description",
  "genres": ["Action", "Thriller"],
  "cast": ["Actor 1", "Actor 2"],
  "releaseYear": 2024,
  "runtime": 120,
  "posterUrl": "https://example.com/poster.jpg",
  "videoUrl": "https://example.com/video.mp4",
  "language": "English"
}
```

#### Update Movie
```http
PUT /api/admin/movies/{movie_id}
Authorization: Bearer admin_secret_token_12345
```

#### Delete Movie
```http
DELETE /api/admin/movies/{movie_id}
Authorization: Bearer admin_secret_token_12345
```

#### Get Admin Statistics
```http
GET /api/admin/stats
Authorization: Bearer admin_secret_token_12345
```

#### Bulk Import Movies (CSV)
```http
POST /api/admin/movies/bulk-import
Authorization: Bearer admin_secret_token_12345
Content-Type: multipart/form-data

file: movies.csv
```

**CSV Format**:
```csv
title,synopsis,genres,cast,releaseYear,runtime,posterUrl,videoUrl,language
"Movie Title","Description","Action|Thriller","Actor 1|Actor 2",2024,120,"https://...","https://...","English"
```

## Local Storage Features

Since there are no user accounts, the following features are implemented using browser localStorage:

### Watchlist
```javascript
// Stored as: watchlist
// Format: ["movie_id_1", "movie_id_2", ...]
const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
```

### Watch History
```javascript
// Stored as: watchHistory
// Format: [{movieId: "id", timestamp: "ISO_date"}, ...]
const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
```

### Playback Progress
```javascript
// Stored as: movie-progress-{movie_id}
// Format: "123.45" (seconds)
const progress = localStorage.getItem('movie-progress-${movieId}');
```

### Admin Token
```javascript
// Stored as: adminToken
// Format: "token_string"
const token = localStorage.getItem('adminToken');
```

## Testing

### Manual Testing

1. **Public Site**:
   - Browse movies on home page
   - Click on a movie to view details
   - Play a video and verify playback progress saves
   - Add movies to watchlist
   - Search for movies with filters

2. **Admin Panel**:
   - Login with admin token
   - View dashboard statistics
   - Create, edit, and delete movies
   - Manage genres

### API Testing with curl

```bash
# Test public endpoint
curl http://localhost:8001/api/movies

# Test admin endpoint
curl -X GET http://localhost:8001/api/admin/stats \
  -H "Authorization: Bearer admin_secret_token_12345"

# Create a movie
curl -X POST http://localhost:8001/api/admin/movies \
  -H "Authorization: Bearer admin_secret_token_12345" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Movie","synopsis":"Test","genres":["Action"],"cast":["Actor"],"releaseYear":2024,"runtime":120,"posterUrl":"https://example.com/poster.jpg","videoUrl":"https://example.com/video.mp4"}'
```

## Deployment

### Backend Deployment

**Option 1: Cloud VM (AWS EC2, DigitalOcean, etc.)**

1. Set up MongoDB (MongoDB Atlas or self-hosted)
2. Clone repository on server
3. Install dependencies: `pip install -r requirements.txt`
4. Set environment variables
5. Run with production server:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
   ```
6. Use nginx as reverse proxy
7. Set up SSL with Let's Encrypt

**Option 2: Docker Container**

```bash
# Build image
docker build -t moviestream-backend ./backend

# Run container
docker run -d -p 8001:8001 \
  -e MONGO_URL="your_mongo_url" \
  -e ADMIN_TOKEN="your_token" \
  moviestream-backend
```

### Frontend Deployment

**Option 1: Vercel (Recommended)**

1. Connect GitHub repository to Vercel
2. Set build command: `yarn build`
3. Set environment variables:
   - `REACT_APP_BACKEND_URL=https://your-api-domain.com`
4. Deploy automatically on push

**Option 2: Netlify**

1. Connect repository
2. Build settings:
   - Build command: `yarn build`
   - Publish directory: `build`
3. Set environment variables
4. Deploy

**Option 3: Static Hosting (S3, CloudFlare Pages)**

1. Build: `yarn build`
2. Upload `build/` directory
3. Configure routing for single-page app

### Environment Variables for Production

**Backend (.env)**:
```env
MONGO_URL="mongodb+srv://user:pass@cluster.mongodb.net/moviestream"
DB_NAME="moviestream_db"
CORS_ORIGINS="https://your-frontend-domain.com"
ADMIN_TOKEN="your_very_secure_random_token_here"
```

**Frontend (.env)**:
```env
REACT_APP_BACKEND_URL=https://your-api-domain.com
```

## Database Schema

### Movies Collection
```json
{
  "id": "uuid",
  "title": "string",
  "synopsis": "string",
  "genres": ["string"],
  "cast": ["string"],
  "releaseYear": "number",
  "runtime": "number",
  "posterUrl": "string",
  "videoUrl": "string",
  "language": "string",
  "subtitles": ["string"],
  "viewCount": "number",
  "createdAt": "ISO date string"
}
```

### Genres Collection
```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string"
}
```

## Security Considerations

### Admin Token Protection
- Store admin token securely in environment variables
- Never commit tokens to version control
- Use strong, randomly generated tokens in production
- Rotate tokens periodically

### CORS Configuration
- Configure `CORS_ORIGINS` to only allow your frontend domain
- Never use `*` in production

### Rate Limiting (Production Recommendation)
Add rate limiting middleware:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
```

## Sample Data

The application comes with 30 pre-seeded movies across 10 genres:
- Action, Drama, Comedy, Thriller, Sci-Fi
- Horror, Romance, Adventure, Fantasy, Crime

All movies use placeholder video URLs from public sources:
- Big Buck Bunny
- Elephants Dream
- Sintel
- Tears of Steel

## Troubleshooting

### Backend won't start
- Check MongoDB connection: `MONGO_URL` in `.env`
- Verify Python dependencies: `pip install -r requirements.txt`
- Check logs for errors

### Frontend can't connect to backend
- Verify `REACT_APP_BACKEND_URL` in frontend `.env`
- Check CORS settings in backend
- Ensure backend is running on correct port

### Admin login fails
- Verify `ADMIN_TOKEN` matches in backend `.env`
- Check browser console for errors
- Clear localStorage and try again

### Video won't play
- Check video URL is accessible
- Verify CORS headers for video hosting
- Check browser console for errors

## Contributing

This is a production-ready MVP. Future enhancements could include:
- User authentication with JWT
- Payment/subscription integration
- Server-side watchlist and progress sync
- Advanced recommendation engine
- Multi-language support
- Content moderation tools
- CDN integration for video streaming
- Advanced analytics dashboard

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues or questions:
1. Check this README
2. Review API documentation at `/docs` (FastAPI auto-generated)
3. Check browser console for frontend errors
4. Check backend logs for API errors

---

Built with ❤️ using FastAPI, React, and MongoDB