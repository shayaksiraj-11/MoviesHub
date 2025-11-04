from fastapi import FastAPI, APIRouter, HTTPException, Header, Query, UploadFile, File
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import csv
import io

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Admin token from environment
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'admin_secret_token_12345')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class Movie(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    synopsis: str
    genres: List[str]
    cast: List[str]
    releaseYear: int
    runtime: int  # in minutes
    posterUrl: str
    videoUrl: str
    language: str = "English"
    subtitles: List[str] = []
    viewCount: int = 0
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MovieCreate(BaseModel):
    title: str
    synopsis: str
    genres: List[str]
    cast: List[str]
    releaseYear: int
    runtime: int
    posterUrl: str
    videoUrl: str
    language: str = "English"
    subtitles: List[str] = []

class MovieUpdate(BaseModel):
    title: Optional[str] = None
    synopsis: Optional[str] = None
    genres: Optional[List[str]] = None
    cast: Optional[List[str]] = None
    releaseYear: Optional[int] = None
    runtime: Optional[int] = None
    posterUrl: Optional[str] = None
    videoUrl: Optional[str] = None
    language: Optional[str] = None
    subtitles: Optional[List[str]] = None

class Genre(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str

class GenreCreate(BaseModel):
    name: str
    slug: str

class AdminStats(BaseModel):
    totalMovies: int
    totalViews: int
    totalGenres: int
    topMovies: List[dict]

class TokenValidation(BaseModel):
    valid: bool
    message: str

# Admin middleware
async def verify_admin_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    if authorization != f"Bearer {ADMIN_TOKEN}":
        raise HTTPException(status_code=403, detail="Invalid admin token")
    
    return True

# Public endpoints
@api_router.get("/")
async def root():
    return {"message": "MovieStream API v1.0"}

@api_router.get("/movies", response_model=List[Movie])
async def get_movies(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    genre: Optional[str] = None
):
    query = {}
    if genre:
        query["genres"] = genre
    
    movies = await db.movies.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for movie in movies:
        if isinstance(movie.get('createdAt'), str):
            movie['createdAt'] = datetime.fromisoformat(movie['createdAt'])
    
    return movies

@api_router.get("/movies/{movie_id}", response_model=Movie)
async def get_movie(movie_id: str):
    movie = await db.movies.find_one({"id": movie_id}, {"_id": 0})
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    if isinstance(movie.get('createdAt'), str):
        movie['createdAt'] = datetime.fromisoformat(movie['createdAt'])
    
    return movie

@api_router.get("/movies/search/query")
async def search_movies(
    q: str = Query(..., min_length=1),
    genre: Optional[str] = None,
    year: Optional[int] = None,
    limit: int = Query(20, ge=1, le=100)
):
    query = {
        "$or": [
            {"title": {"$regex": q, "$options": "i"}},
            {"synopsis": {"$regex": q, "$options": "i"}}
        ]
    }
    
    if genre:
        query["genres"] = genre
    if year:
        query["releaseYear"] = year
    
    movies = await db.movies.find(query, {"_id": 0}).limit(limit).to_list(limit)
    
    for movie in movies:
        if isinstance(movie.get('createdAt'), str):
            movie['createdAt'] = datetime.fromisoformat(movie['createdAt'])
    
    return movies

@api_router.post("/movies/{movie_id}/increment-view")
async def increment_view(movie_id: str):
    result = await db.movies.update_one(
        {"id": movie_id},
        {"$inc": {"viewCount": 1}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    return {"success": True, "message": "View count incremented"}

@api_router.get("/genres", response_model=List[Genre])
async def get_genres():
    genres = await db.genres.find({}, {"_id": 0}).to_list(100)
    return genres

# Admin endpoints
@api_router.post("/admin/validate-token", response_model=TokenValidation)
async def validate_admin_token(authorization: Optional[str] = Header(None)):
    try:
        await verify_admin_token(authorization)
        return {"valid": True, "message": "Token is valid"}
    except HTTPException:
        return {"valid": False, "message": "Invalid token"}

@api_router.post("/admin/movies", response_model=Movie)
async def create_movie(
    movie: MovieCreate,
    authorization: Optional[str] = Header(None)
):
    await verify_admin_token(authorization)
    
    movie_obj = Movie(**movie.model_dump())
    doc = movie_obj.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    
    await db.movies.insert_one(doc)
    return movie_obj

@api_router.put("/admin/movies/{movie_id}", response_model=Movie)
async def update_movie(
    movie_id: str,
    movie: MovieUpdate,
    authorization: Optional[str] = Header(None)
):
    await verify_admin_token(authorization)
    
    update_data = {k: v for k, v in movie.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.movies.update_one(
        {"id": movie_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    updated_movie = await db.movies.find_one({"id": movie_id}, {"_id": 0})
    if isinstance(updated_movie.get('createdAt'), str):
        updated_movie['createdAt'] = datetime.fromisoformat(updated_movie['createdAt'])
    
    return updated_movie

@api_router.delete("/admin/movies/{movie_id}")
async def delete_movie(
    movie_id: str,
    authorization: Optional[str] = Header(None)
):
    await verify_admin_token(authorization)
    
    result = await db.movies.delete_one({"id": movie_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    return {"success": True, "message": "Movie deleted"}

@api_router.post("/admin/genres", response_model=Genre)
async def create_genre(
    genre: GenreCreate,
    authorization: Optional[str] = Header(None)
):
    await verify_admin_token(authorization)
    
    # Check if genre already exists
    existing = await db.genres.find_one({"slug": genre.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Genre already exists")
    
    genre_obj = Genre(**genre.model_dump())
    doc = genre_obj.model_dump()
    
    await db.genres.insert_one(doc)
    return genre_obj

@api_router.delete("/admin/genres/{genre_id}")
async def delete_genre(
    genre_id: str,
    authorization: Optional[str] = Header(None)
):
    await verify_admin_token(authorization)
    
    result = await db.genres.delete_one({"id": genre_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Genre not found")
    
    return {"success": True, "message": "Genre deleted"}

@api_router.get("/admin/stats", response_model=AdminStats)
async def get_admin_stats(authorization: Optional[str] = Header(None)):
    await verify_admin_token(authorization)
    
    total_movies = await db.movies.count_documents({})
    total_genres = await db.genres.count_documents({})
    
    # Calculate total views
    pipeline = [
        {"$group": {"_id": None, "totalViews": {"$sum": "$viewCount"}}}
    ]
    views_result = await db.movies.aggregate(pipeline).to_list(1)
    total_views = views_result[0]["totalViews"] if views_result else 0
    
    # Get top movies by view count
    top_movies = await db.movies.find(
        {}, 
        {"_id": 0, "id": 1, "title": 1, "viewCount": 1, "posterUrl": 1}
    ).sort("viewCount", -1).limit(10).to_list(10)
    
    return {
        "totalMovies": total_movies,
        "totalViews": total_views,
        "totalGenres": total_genres,
        "topMovies": top_movies
    }

@api_router.post("/admin/movies/bulk-import")
async def bulk_import_movies(
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(None)
):
    await verify_admin_token(authorization)
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    contents = await file.read()
    csv_data = io.StringIO(contents.decode('utf-8'))
    reader = csv.DictReader(csv_data)
    
    imported_count = 0
    errors = []
    
    for row in reader:
        try:
            movie_data = {
                "title": row["title"],
                "synopsis": row["synopsis"],
                "genres": row["genres"].split("|"),
                "cast": row["cast"].split("|"),
                "releaseYear": int(row["releaseYear"]),
                "runtime": int(row["runtime"]),
                "posterUrl": row["posterUrl"],
                "videoUrl": row["videoUrl"],
                "language": row.get("language", "English"),
            }
            
            movie_obj = Movie(**movie_data)
            doc = movie_obj.model_dump()
            doc['createdAt'] = doc['createdAt'].isoformat()
            
            await db.movies.insert_one(doc)
            imported_count += 1
        except Exception as e:
            errors.append(f"Row {imported_count + 1}: {str(e)}")
    
    return {
        "success": True,
        "imported": imported_count,
        "errors": errors
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()