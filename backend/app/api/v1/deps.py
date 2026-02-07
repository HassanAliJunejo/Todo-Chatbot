from fastapi import Depends, HTTPException, status, Request
from sqlmodel import Session
from app.core.security import verify_token
from app.core.db import get_session
from app.models.user import User


def get_token_from_header(request: Request):
    authorization = request.headers.get("Authorization")
    if authorization is None:
        return None

    try:
        scheme, token = authorization.split(" ")
        if scheme.lower() != "bearer":
            return None
        return token
    except ValueError:
        return None


def get_current_user(request: Request, session: Session = Depends(get_session)) -> User:
    token_str = get_token_from_header(request)
    token = verify_token(token_str)

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = token.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    from app.services.user import get_user_by_email
    user = get_user_by_email(session=session, email=email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user