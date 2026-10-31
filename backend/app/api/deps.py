from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import decode_access_token
from app.models.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_db() -> Generator:
    """Provide transactional database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Extract and validate current authenticated user from JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id_str = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception

    try:
        user_id = int(user_id_str)
    except ValueError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None or not user.is_active:
        raise credentials_exception
    return user

def require_individual(current_user: User = Depends(get_current_user)) -> User:
    """Ensure authenticated user has individual (student/job seeker) role."""
    if current_user.role != "individual":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to individual job seeker accounts."
        )
    return current_user

def require_company(current_user: User = Depends(get_current_user)) -> User:
    """Ensure authenticated user has company (recruiter/HR) role."""
    if current_user.role != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to company/recruiter accounts."
        )
    return current_user
