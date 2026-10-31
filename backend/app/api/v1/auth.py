from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.models import User, IndividualProfile, CompanyProfile
from app.schemas.schemas import UserCreate, UserLogin, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new individual or company account."""
    existing_user = db.query(User).filter(User.email == user_in.email.strip().lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Create User
    new_user = User(
        email=user_in.email.strip().lower(),
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role if user_in.role in ["individual", "company"] else "individual"
    )
    db.add(new_user)
    db.flush()

    # Create associated profile
    if new_user.role == "company":
        company_name = user_in.company_name or f"{user_in.full_name}'s Organization"
        profile = CompanyProfile(
            user_id=new_user.id,
            company_name=company_name,
            industry=user_in.industry or "Technology"
        )
        db.add(profile)
    else:
        profile = IndividualProfile(
            user_id=new_user.id,
            bio="Seeking opportunities to apply technical skills and expand industry knowledge."
        )
        db.add(profile)

    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(subject=new_user.id, role=new_user.role)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": new_user.id,
        "email": new_user.email,
        "full_name": new_user.full_name,
        "role": new_user.role
    }

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user with email and password and return JWT token."""
    user = db.query(User).filter(User.email == login_in.email.strip().lower()).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is currently inactive."
        )

    access_token = create_access_token(subject=user.id, role=user.role)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Retrieve details and profile of currently authenticated user."""
    return current_user
