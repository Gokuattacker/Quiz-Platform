const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  // lazyConnect removed: connect eagerly so failures surface at startup
  retryStrategy: (times) => Math.min(times * 100, 3000) // retry with backoff
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err.message));

module.exports = redis;
