import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Sample genres
genres_data = [
    {"id": str(uuid.uuid4()), "name": "Action", "slug": "action"},
    {"id": str(uuid.uuid4()), "name": "Drama", "slug": "drama"},
    {"id": str(uuid.uuid4()), "name": "Comedy", "slug": "comedy"},
    {"id": str(uuid.uuid4()), "name": "Thriller", "slug": "thriller"},
    {"id": str(uuid.uuid4()), "name": "Sci-Fi", "slug": "sci-fi"},
    {"id": str(uuid.uuid4()), "name": "Horror", "slug": "horror"},
    {"id": str(uuid.uuid4()), "name": "Romance", "slug": "romance"},
    {"id": str(uuid.uuid4()), "name": "Adventure", "slug": "adventure"},
    {"id": str(uuid.uuid4()), "name": "Fantasy", "slug": "fantasy"},
    {"id": str(uuid.uuid4()), "name": "Crime", "slug": "crime"},
]

# Sample movies (30 movies with placeholder videos)
movies_data = [
    {
        "id": str(uuid.uuid4()),
        "title": "The Quantum Heist",
        "synopsis": "A team of scientists must steal a quantum computer from a heavily guarded facility to save humanity from an AI takeover.",
        "genres": ["Action", "Sci-Fi", "Thriller"],
        "cast": ["Michael Chen", "Sarah Johnson", "David Park"],
        "releaseYear": 2023,
        "runtime": 142,
        "posterUrl": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "language": "English",
        "subtitles": ["English", "Spanish"],
        "viewCount": 12450,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Midnight in Paris Redux",
        "synopsis": "A young artist discovers a magical portal that transports her to 1920s Paris every midnight, where she meets legendary artists.",
        "genres": ["Romance", "Fantasy", "Drama"],
        "cast": ["Emma Laurent", "Jean Beaumont", "Claire Dubois"],
        "releaseYear": 2023,
        "runtime": 118,
        "posterUrl": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "language": "English",
        "subtitles": ["English", "French"],
        "viewCount": 8920,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Shadows of Tomorrow",
        "synopsis": "In a dystopian future, a detective must solve murders that haven't happened yet using time-bending technology.",
        "genres": ["Thriller", "Sci-Fi", "Crime"],
        "cast": ["Marcus Reid", "Lisa Wang", "Tom Anderson"],
        "releaseYear": 2024,
        "runtime": 135,
        "posterUrl": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 15230,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "The Last Symphony",
        "synopsis": "A deaf composer creates one final masterpiece that has the power to heal or destroy, and everyone wants it.",
        "genres": ["Drama", "Thriller"],
        "cast": ["Anna Martinez", "Robert Chen", "Sofia Lopez"],
        "releaseYear": 2023,
        "runtime": 126,
        "posterUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "language": "English",
        "subtitles": ["English", "Spanish", "German"],
        "viewCount": 6780,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Laugh Track",
        "synopsis": "A stand-up comedian discovers her jokes are coming true in the worst possible ways, turning her life into a comedy of errors.",
        "genres": ["Comedy", "Fantasy"],
        "cast": ["Jessica Brown", "Mike Stevens", "Rachel Green"],
        "releaseYear": 2024,
        "runtime": 98,
        "posterUrl": "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 11200,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Blood Moon Rising",
        "synopsis": "A small town sheriff must protect her community from ancient creatures that awaken during a rare blood moon eclipse.",
        "genres": ["Horror", "Thriller", "Action"],
        "cast": ["Kate Morrison", "John Blake", "Maria Santos"],
        "releaseYear": 2023,
        "runtime": 110,
        "posterUrl": "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "language": "English",
        "subtitles": ["English", "Spanish"],
        "viewCount": 9340,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Expedition Everest",
        "synopsis": "A documentary crew's journey to summit Everest becomes a fight for survival when they discover something that shouldn't exist.",
        "genres": ["Adventure", "Thriller", "Drama"],
        "cast": ["Alex Turner", "Priya Sharma", "James Wilson"],
        "releaseYear": 2024,
        "runtime": 128,
        "posterUrl": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "language": "English",
        "subtitles": ["English", "Hindi"],
        "viewCount": 7890,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Code Red",
        "synopsis": "A cybersecurity expert races against time to stop a virus that's taking control of the world's nuclear arsenals.",
        "genres": ["Action", "Thriller", "Sci-Fi"],
        "cast": ["Ryan Cooper", "Nina Patel", "Mark Johnson"],
        "releaseYear": 2023,
        "runtime": 132,
        "posterUrl": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 13560,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Hearts in Bloom",
        "synopsis": "Two rival florists must work together to save their street from gentrification, discovering love in the process.",
        "genres": ["Romance", "Comedy", "Drama"],
        "cast": ["Lily Chen", "Daniel Brooks", "Sophie Martin"],
        "releaseYear": 2024,
        "runtime": 105,
        "posterUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        "language": "English",
        "subtitles": ["English", "French"],
        "viewCount": 5670,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "The Dragon's Prophecy",
        "synopsis": "A young warrior must fulfill an ancient prophecy by finding the last dragon and preventing an eternal winter.",
        "genres": ["Fantasy", "Adventure", "Action"],
        "cast": ["Leo Zhang", "Elena Frost", "Thor Magnusson"],
        "releaseYear": 2023,
        "runtime": 155,
        "posterUrl": "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "language": "English",
        "subtitles": ["English", "Mandarin"],
        "viewCount": 18920,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Silent Witness",
        "synopsis": "A forensic pathologist uncovers a conspiracy while investigating what seems like a routine case of natural death.",
        "genres": ["Crime", "Thriller", "Drama"],
        "cast": ["Dr. Sarah Mills", "Detective Harris", "Agent Chen"],
        "releaseYear": 2024,
        "runtime": 118,
        "posterUrl": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 10450,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Neon Nights",
        "synopsis": "In a cyberpunk metropolis, a street racer gets caught between corporate espionage and underground resistance.",
        "genres": ["Action", "Sci-Fi", "Crime"],
        "cast": ["Max Velocity", "Kira Neon", "Shadow Boss"],
        "releaseYear": 2023,
        "runtime": 122,
        "posterUrl": "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "language": "English",
        "subtitles": ["English", "Japanese"],
        "viewCount": 14230,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "The Forgotten Island",
        "synopsis": "Survivors of a plane crash discover an island where time doesn't flow normally and escape seems impossible.",
        "genres": ["Adventure", "Mystery", "Thriller"],
        "cast": ["Jack Rivers", "Emma Stone", "Dr. Lucas Grey"],
        "releaseYear": 2024,
        "runtime": 140,
        "posterUrl": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "language": "English",
        "subtitles": ["English", "Spanish"],
        "viewCount": 16780,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Cosmic Diner",
        "synopsis": "A 24-hour diner exists simultaneously in multiple dimensions, serving customers from across the multiverse.",
        "genres": ["Comedy", "Sci-Fi", "Fantasy"],
        "cast": ["Betty Cosmos", "Multiversal Mike", "Dimension Dave"],
        "releaseYear": 2023,
        "runtime": 95,
        "posterUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 8120,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "The Haunting of Ashwood Manor",
        "synopsis": "A paranormal investigator must spend seven nights in the most haunted mansion in America to prove ghosts exist.",
        "genres": ["Horror", "Thriller"],
        "cast": ["Dr. Emily Ashwood", "Ghost Hunter Jake", "Medium Sarah"],
        "releaseYear": 2024,
        "runtime": 108,
        "posterUrl": "https://images.unsplash.com/photo-1512446816042-444d641267d4?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 12890,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Velocity",
        "synopsis": "An underground street racing champion must win one last race to save his family's garage from a ruthless developer.",
        "genres": ["Action", "Drama"],
        "cast": ["Rico Fast", "Maya Turbo", "Boss Viper"],
        "releaseYear": 2023,
        "runtime": 115,
        "posterUrl": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "language": "English",
        "subtitles": ["English", "Spanish"],
        "viewCount": 11670,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Whispers in the Dark",
        "synopsis": "A blind sound engineer uses her heightened hearing to solve crimes by listening to audio evidence no one else can detect.",
        "genres": ["Crime", "Thriller", "Drama"],
        "cast": ["Maya Sound", "Detective Morgan", "Tech Expert Chris"],
        "releaseYear": 2024,
        "runtime": 124,
        "posterUrl": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 9560,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Love & Algorithms",
        "synopsis": "Two rival app developers create competing dating apps, but their algorithms keep matching them with each other.",
        "genres": ["Romance", "Comedy"],
        "cast": ["Alex Code", "Sophie Debug", "Binary Bob"],
        "releaseYear": 2023,
        "runtime": 102,
        "posterUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 7230,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Kingdom of Shadows",
        "synopsis": "A princess with shadow magic must unite warring kingdoms before an ancient evil consumes the realm.",
        "genres": ["Fantasy", "Adventure", "Action"],
        "cast": ["Princess Umbra", "Knight Valor", "Wizard Merlin"],
        "releaseYear": 2024,
        "runtime": 148,
        "posterUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 19450,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "The Verdict",
        "synopsis": "A rookie public defender takes on the case of her career, defending a man accused of a crime she thinks he didn't commit.",
        "genres": ["Drama", "Crime", "Thriller"],
        "cast": ["Attorney Mills", "Judge Harrison", "Prosecutor Kane"],
        "releaseYear": 2023,
        "runtime": 130,
        "posterUrl": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "language": "English",
        "subtitles": ["English", "Spanish"],
        "viewCount": 8890,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Zero Gravity",
        "synopsis": "The first human born in space must return to Earth to save humanity, but gravity might kill her first.",
        "genres": ["Sci-Fi", "Drama", "Adventure"],
        "cast": ["Luna Star", "Dr. Earth", "Commander Atlas"],
        "releaseYear": 2024,
        "runtime": 136,
        "posterUrl": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 15670,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Laugh Riot",
        "synopsis": "An improv comedy troupe accidentally stumbles into a real heist and must improvise their way out of danger.",
        "genres": ["Comedy", "Action", "Crime"],
        "cast": ["Joker Jim", "Funny Fiona", "Comedian Carl"],
        "releaseYear": 2023,
        "runtime": 96,
        "posterUrl": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 10230,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "The Crimson Curse",
        "synopsis": "A vampire hunter falls in love with her target, a vampire prince trying to break his family's curse.",
        "genres": ["Horror", "Romance", "Fantasy"],
        "cast": ["Hunter Helena", "Prince Dracula", "Elder Vampire"],
        "releaseYear": 2024,
        "runtime": 125,
        "posterUrl": "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 13120,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Sahara Storm",
        "synopsis": "An archaeologist races against mercenaries to find a legendary city buried beneath the Sahara desert.",
        "genres": ["Adventure", "Action", "Thriller"],
        "cast": ["Dr. Indiana Stone", "Merc Leader", "Guide Amir"],
        "releaseYear": 2023,
        "runtime": 127,
        "posterUrl": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "language": "English",
        "subtitles": ["English", "Arabic"],
        "viewCount": 11890,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Neural",
        "synopsis": "A neuroscientist develops a way to record dreams, but corporate spies want to weaponize the technology.",
        "genres": ["Sci-Fi", "Thriller", "Drama"],
        "cast": ["Dr. Neural", "Agent Spy", "CEO Corporate"],
        "releaseYear": 2024,
        "runtime": 119,
        "posterUrl": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 12340,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Second Chance Summer",
        "synopsis": "Childhood sweethearts reunite at their hometown beach for one summer, getting a second chance at love.",
        "genres": ["Romance", "Drama"],
        "cast": ["Summer Love", "Beach Boy", "Best Friend"],
        "releaseYear": 2023,
        "runtime": 108,
        "posterUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 6450,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "The Phoenix Protocol",
        "synopsis": "Special agents must stop a rogue AI from triggering nuclear war by uploading itself into global defense systems.",
        "genres": ["Action", "Sci-Fi", "Thriller"],
        "cast": ["Agent Phoenix", "Hacker Zero", "General Shield"],
        "releaseYear": 2024,
        "runtime": 145,
        "posterUrl": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        "language": "English",
        "subtitles": ["English", "Russian"],
        "viewCount": 17890,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Mystery Manor",
        "synopsis": "Ten strangers are invited to a remote mansion for a weekend, but they start disappearing one by one.",
        "genres": ["Thriller", "Mystery", "Horror"],
        "cast": ["Detective Claire", "Butler James", "Guest List"],
        "releaseYear": 2023,
        "runtime": 112,
        "posterUrl": "https://images.unsplash.com/photo-1512446816042-444d641267d4?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 14560,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Galactic Chef",
        "synopsis": "A chef travels the galaxy competing in cooking competitions on alien worlds to save her restaurant from bankruptcy.",
        "genres": ["Comedy", "Sci-Fi", "Adventure"],
        "cast": ["Chef Galaxy", "Alien Judge", "Sous Bot"],
        "releaseYear": 2024,
        "runtime": 99,
        "posterUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "language": "English",
        "subtitles": ["English"],
        "viewCount": 8770,
        "createdAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Eternal Flame",
        "synopsis": "An immortal firefighter has saved lives for centuries, but now must choose between immortality and true love.",
        "genres": ["Fantasy", "Romance", "Drama"],
        "cast": ["Immortal Ian", "Mortal Morgan", "Time Keeper"],
        "releaseYear": 2023,
        "runtime": 133,
        "posterUrl": "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=500",
        "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "language": "English",
        "subtitles": ["English", "Italian"],
        "viewCount": 10890,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
]

async def seed_database():
    print("Starting database seeding...")
    
    # Clear existing data
    await db.genres.delete_many({})
    await db.movies.delete_many({})
    print("Cleared existing data")
    
    # Insert genres
    await db.genres.insert_many(genres_data)
    print(f"Inserted {len(genres_data)} genres")
    
    # Insert movies
    await db.movies.insert_many(movies_data)
    print(f"Inserted {len(movies_data)} movies")
    
    print("Database seeding completed successfully!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())