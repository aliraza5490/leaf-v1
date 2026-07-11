import redis
from ...settings import settings

# Initialize Redis client connection
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
