# MovieStream API Documentation

## Base URL

**Development**: `http://localhost:8001`
**Production**: `https://your-api-domain.com`

All endpoints are prefixed with `/api`

## Authentication

### Public Endpoints
No authentication required. Accessible to all users.

### Admin Endpoints
Require Bearer token authentication in the `Authorization` header:

```http
Authorization: Bearer your_admin_token_here
```

## Response Format

All responses are in JSON format.

### Success Response
```json
{
  "id": "uuid",
  "field": "value"
}
```

### Error Response
```json
{
  "detail": "Error message"
}
```

## Public Endpoints

### GET /api/

Health check endpoint.

**Response**:
```json
{
  "message": "MovieStream API v1.0"
}
```

---

### GET /api/movies

Get a list of movies with pagination and optional genre filter.

**Query Parameters**:
- `skip` (integer, default: 0) - Number of movies to skip
- `limit` (integer, default: 20, max: 100) - Number of movies to return
- `genre` (string, optional) - Filter by genre name

**Example Request**:
```http
GET /api/movies?skip=0&limit=10&genre=Action
```

**Response**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "The Quantum Heist",
    "synopsis": "A team of scientists must steal...",
    "genres": ["Action", "Sci-Fi", "Thriller"],
    "cast": ["Michael Chen", "Sarah Johnson"],
    "releaseYear": 2023,
    "runtime": 142,
    "posterUrl": "https://...",
    "videoUrl": "https://...",
    "language": "English",
    "subtitles": ["English", "Spanish"],
    "viewCount": 12450,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### GET /api/movies/{movie_id}

Get details of a specific movie.

**Path Parameters**:
- `movie_id` (string, required) - Movie UUID

**Example Request**:
```http
GET /api/movies/550e8400-e29b-41d4-a716-446655440000
```

**Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "The Quantum Heist",
  "synopsis": "A team of scientists...",
  "genres": ["Action", "Sci-Fi"],
  "cast": ["Michael Chen", "Sarah Johnson"],
  "releaseYear": 2023,
  "runtime": 142,
  "posterUrl": "https://...",
  "videoUrl": "https://...",
  "language": "English",
  "subtitles": ["English", "Spanish"],
  "viewCount": 12450,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- `404`: Movie not found

---

### GET /api/movies/search/query

Search for movies by title or synopsis with optional filters.

**Query Parameters**:
- `q` (string, required, min: 1) - Search query
- `genre` (string, optional) - Filter by genre
- `year` (integer, optional) - Filter by release year
- `limit` (integer, default: 20, max: 100) - Number of results

**Example Request**:
```http
GET /api/movies/search/query?q=quantum&genre=Sci-Fi&year=2023&limit=10
```

**Response**:
```json
[
  {
    "id": "...",
    "title": "The Quantum Heist",
    ...
  }
]
```

---

### POST /api/movies/{movie_id}/increment-view

Increment the view count for a movie.

**Path Parameters**:
- `movie_id` (string, required) - Movie UUID

**Example Request**:
```http
POST /api/movies/550e8400-e29b-41d4-a716-446655440000/increment-view
```

**Response**:
```json
{
  "success": true,
  "message": "View count incremented"
}
```

**Error Responses**:
- `404`: Movie not found

---

### GET /api/genres

Get all available genres.

**Example Request**:
```http
GET /api/genres
```

**Response**:
```json
[
  {
    "id": "uuid",
    "name": "Action",
    "slug": "action"
  },
  {
    "id": "uuid",
    "name": "Drama",
    "slug": "drama"
  }
]
```

---

## Admin Endpoints

All admin endpoints require the `Authorization` header with Bearer token.

### POST /api/admin/validate-token

Validate an admin token.

**Headers**:
```http
Authorization: Bearer admin_secret_token_12345
```

**Response**:
```json
{
  "valid": true,
  "message": "Token is valid"
}
```

**Error Responses**:
- `401`: Authorization header missing
- `403`: Invalid admin token

---

### POST /api/admin/movies

Create a new movie.

**Headers**:
```http
Authorization: Bearer admin_secret_token_12345
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "New Movie Title",
  "synopsis": "Movie description here...",
  "genres": ["Action", "Thriller"],
  "cast": ["Actor 1", "Actor 2", "Actor 3"],
  "releaseYear": 2024,
  "runtime": 125,
  "posterUrl": "https://example.com/poster.jpg",
  "videoUrl": "https://example.com/video.mp4",
  "language": "English",
  "subtitles": ["English", "Spanish"]
}
```

**Response**:
```json
{
  "id": "generated-uuid",
  "title": "New Movie Title",
  "synopsis": "Movie description here...",
  "genres": ["Action", "Thriller"],
  "cast": ["Actor 1", "Actor 2", "Actor 3"],
  "releaseYear": 2024,
  "runtime": 125,
  "posterUrl": "https://example.com/poster.jpg",
  "videoUrl": "https://example.com/video.mp4",
  "language": "English",
  "subtitles": ["English", "Spanish"],
  "viewCount": 0,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- `401`: Authorization header missing
- `403`: Invalid admin token
- `422`: Validation error

---

### PUT /api/admin/movies/{movie_id}

Update an existing movie.

**Headers**:
```http
Authorization: Bearer admin_secret_token_12345
Content-Type: application/json
```

**Path Parameters**:
- `movie_id` (string, required) - Movie UUID

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "synopsis": "Updated synopsis",
  "runtime": 130
}
```

**Response**:
```json
{
  "id": "movie-uuid",
  "title": "Updated Title",
  ...
}
```

**Error Responses**:
- `400`: No fields to update
- `401`: Authorization header missing
- `403`: Invalid admin token
- `404`: Movie not found

---

### DELETE /api/admin/movies/{movie_id}

Delete a movie.

**Headers**:
```http
Authorization: Bearer admin_secret_token_12345
```

**Path Parameters**:
- `movie_id` (string, required) - Movie UUID

**Response**:
```json
{
  "success": true,
  "message": "Movie deleted"
}
```

**Error Responses**:
- `401`: Authorization header missing
- `403`: Invalid admin token
- `404`: Movie not found

---

### POST /api/admin/genres

Create a new genre.

**Headers**:
```http
Authorization: Bearer admin_secret_token_12345
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Documentary",
  "slug": "documentary"
}
```

**Response**:
```json
{
  "id": "generated-uuid",
  "name": "Documentary",
  "slug": "documentary"
}
```

**Error Responses**:
- `400`: Genre already exists
- `401`: Authorization header missing
- `403`: Invalid admin token

---

### DELETE /api/admin/genres/{genre_id}

Delete a genre.

**Headers**:
```http
Authorization: Bearer admin_secret_token_12345
```

**Path Parameters**:
- `genre_id` (string, required) - Genre UUID

**Response**:
```json
{
  "success": true,
  "message": "Genre deleted"
}
```

**Error Responses**:
- `401`: Authorization header missing
- `403`: Invalid admin token
- `404`: Genre not found

---

### GET /api/admin/stats

Get platform statistics and analytics.

**Headers**:
```http
Authorization: Bearer admin_secret_token_12345
```

**Response**:
```json
{
  "totalMovies": 30,
  "totalViews": 125430,
  "totalGenres": 10,
  "topMovies": [
    {
      "id": "movie-uuid",
      "title": "Popular Movie",
      "viewCount": 19450,
      "posterUrl": "https://..."
    }
  ]
}
```

**Error Responses**:
- `401`: Authorization header missing
- `403`: Invalid admin token

---

### POST /api/admin/movies/bulk-import

Bulk import movies from CSV file.

**Headers**:
```http
Authorization: Bearer admin_secret_token_12345
Content-Type: multipart/form-data
```

**Request Body**:
- `file` (file, required) - CSV file with movie data

**CSV Format**:
```csv
title,synopsis,genres,cast,releaseYear,runtime,posterUrl,videoUrl,language
"Movie 1","Synopsis 1","Action|Thriller","Actor 1|Actor 2",2024,120,"https://...","https://...","English"
"Movie 2","Synopsis 2","Drama","Actor 3",2023,105,"https://...","https://...","English"
```

**Notes**:
- Use `|` (pipe) to separate multiple values in genres and cast fields
- All fields are required except language (defaults to "English")

**Response**:
```json
{
  "success": true,
  "imported": 25,
  "errors": [
    "Row 3: Invalid year format"
  ]
}
```

**Error Responses**:
- `400`: Only CSV files allowed
- `401`: Authorization header missing
- `403`: Invalid admin token

---

## Error Codes

- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing authorization header
- `403`: Forbidden - Invalid admin token
- `404`: Not Found - Resource doesn't exist
- `422`: Unprocessable Entity - Validation error
- `500`: Internal Server Error - Server error

## Rate Limiting

Currently not implemented. Recommended for production:
- Public endpoints: 100 requests per minute per IP
- Admin endpoints: 50 requests per minute per token

## Interactive API Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: `http://localhost:8001/docs`
- **ReDoc**: `http://localhost:8001/redoc`

These interfaces allow you to test all endpoints directly from your browser.