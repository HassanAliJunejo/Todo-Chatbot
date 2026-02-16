"""
Rate limiting middleware for AI Chat endpoint.
Uses in-memory sliding window to prevent abuse.
"""

import time
from collections import defaultdict
from fastapi import HTTPException, status, Request
from typing import Dict, List


class RateLimiter:
    """Simple in-memory sliding window rate limiter per user."""

    def __init__(self, max_requests: int = 20, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: Dict[int, List[float]] = defaultdict(list)

    def _cleanup(self, user_id: int) -> None:
        """Remove expired timestamps for a user."""
        cutoff = time.time() - self.window_seconds
        self._requests[user_id] = [
            ts for ts in self._requests[user_id] if ts > cutoff
        ]

    def check(self, user_id: int) -> None:
        """
        Check if user is within rate limits.
        Raises HTTPException 429 if limit exceeded.
        """
        self._cleanup(user_id)

        if len(self._requests[user_id]) >= self.max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Maximum {self.max_requests} requests per {self.window_seconds} seconds."
            )

        self._requests[user_id].append(time.time())

    def remaining(self, user_id: int) -> int:
        """Return remaining requests for user in current window."""
        self._cleanup(user_id)
        return max(0, self.max_requests - len(self._requests[user_id]))


# Singleton instance: 20 requests per 60 seconds per user
chat_rate_limiter = RateLimiter(max_requests=20, window_seconds=60)
