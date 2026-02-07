from sqlmodel import Session, select
from ..models.user import User
from typing import Optional
from ..core.security import get_password_hash


def create_user(*, session: Session, user_create) -> User:
    hashed_password = get_password_hash(user_create.password)
    db_user = User(email=user_create.email, full_name=user_create.full_name, hashed_password=hashed_password)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> Optional[User]:
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    return user


def get_user_by_id(*, session: Session, user_id: int) -> Optional[User]:
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    return user