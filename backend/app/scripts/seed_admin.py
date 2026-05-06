"""Create or promote a superuser.

Usage:
    python -m app.scripts.seed_admin --email admin@example.com --password secret123 --name "Admin"
"""
import argparse
import sys
from sqlmodel import Session, select
from app.database import engine, create_db_and_tables
from app.models.user import User
from app.core.security import get_password_hash


def main() -> int:
    parser = argparse.ArgumentParser(description="Create or promote a superuser.")
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--name", default="Admin")
    args = parser.parse_args()

    create_db_and_tables()

    with Session(engine) as db:
        existing = db.exec(select(User).where(User.email == args.email)).first()
        if existing:
            existing.is_superuser = True
            existing.is_active = True
            existing.hashed_password = get_password_hash(args.password)
            if args.name:
                existing.full_name = args.name
            db.commit()
            print(f"Promoted existing user '{args.email}' to superuser and reset password.")
            return 0

        user = User(
            email=args.email,
            full_name=args.name,
            hashed_password=get_password_hash(args.password),
            is_superuser=True,
            is_active=True,
        )
        db.add(user)
        db.commit()
        print(f"Created superuser '{args.email}'.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
